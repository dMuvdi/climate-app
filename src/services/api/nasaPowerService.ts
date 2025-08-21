import axios from 'axios';
import { NASAPowerParams, NASAPowerResponse, ProcessedClimateData, LocationCoordinates, TimeSeriesData, ClimateAverages } from '@/types/climate';
import { NASA_POWER_CONFIG } from '@/constants/locations';
import { getValidDateRangeForAPI } from '@/utils/dateUtils';

class NASAPowerService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = NASA_POWER_CONFIG.baseUrl;
    }

    /**
     * Fetch climate data from NASA POWER API
     */
    async fetchClimateData(
        location: LocationCoordinates,
        startDate: string,
        endDate: string
    ): Promise<ProcessedClimateData[]> {
        try {
            // Convert dates to YYYYMMDD format for NASA POWER API
            const apiDateRange = getValidDateRangeForAPI(startDate, endDate);

            const params: NASAPowerParams = {
                latitude: location.latitude,
                longitude: location.longitude,
                start: apiDateRange.start,
                end: apiDateRange.end,
                community: NASA_POWER_CONFIG.community,
                parameters: NASA_POWER_CONFIG.parameters.join(','),
                format: NASA_POWER_CONFIG.format,
                units: NASA_POWER_CONFIG.units
            };

            const response = await axios.get<NASAPowerResponse>(this.baseUrl, { params });

            return this.processNASAResponse(response.data);
        } catch (error) {
            console.error('Error fetching NASA POWER data:', error);
            throw new Error('Failed to fetch climate data from NASA POWER API');
        }
    }

    /**
     * Process NASA POWER API response into usable format
     */
    private processNASAResponse(
        data: NASAPowerResponse
    ): ProcessedClimateData[] {
        const processedData: ProcessedClimateData[] = [];
        const parameters = data.properties.parameter;

        // Get all available timestamps from the response
        const timestamps = Object.keys(parameters.T2M || {});

        timestamps.forEach(timestamp => {
            const temperature = parameters.T2M?.[timestamp] || 0;
            const humidity = parameters.RH2M?.[timestamp] || 0;
            const windSpeed = parameters.WS2M?.[timestamp] || 0;
            const precipitation = parameters.PRECTOTCORR?.[timestamp] || 0;

            // Convert timestamp from YYYYMMDDHH to readable date
            const date = this.formatTimestampToDate(timestamp);

            processedData.push({
                temperature: Math.round(temperature), // Already in Celsius
                humidity: Math.round(humidity),
                windSpeed: Math.round(windSpeed * 3.6), // Convert m/s to km/h
                precipitation: Math.round(precipitation), // Already in mm/hour
                date,
                timestamp
            });
        });

        return processedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    /**
     * Convert timestamp from YYYYMMDDHH format to readable date
     */
    private formatTimestampToDate(timestamp: string): string {
        const year = timestamp.substring(0, 4);
        const month = timestamp.substring(4, 6);
        const day = timestamp.substring(6, 8);
        const hour = timestamp.substring(8, 10);

        return `${year}-${month}-${day} ${hour}:00`;
    }

    /**
     * Convert Kelvin to Celsius
     */
    private convertKelvinToCelsius(kelvin: number): number {
        return Math.round(kelvin - 273.15);
    }

    /**
     * Get time series data for charts
     */
    async getTimeSeriesData(
        location: LocationCoordinates,
        startDate: string,
        endDate: string
    ): Promise<TimeSeriesData[]> {
        const data = await this.fetchClimateData(location, startDate, endDate);

        return data.map(item => ({
            timestamp: item.timestamp,
            temperature: item.temperature,
            humidity: item.humidity,
            windSpeed: item.windSpeed,
            precipitation: item.precipitation,
            formattedTime: item.date
        }));
    }

    /**
     * Get daily averages from hourly data
     */
    async getDailyAverages(
        location: LocationCoordinates,
        startDate: string,
        endDate: string
    ): Promise<ClimateAverages[]> {
        const data = await this.fetchClimateData(location, startDate, endDate);

        // Group by date (YYYY-MM-DD)
        const dailyGroups = data.reduce((groups, item) => {
            const date = item.date.split(' ')[0]; // Get just the date part
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(item);
            return groups;
        }, {} as { [date: string]: ProcessedClimateData[] });

        // Calculate averages for each day
        return Object.entries(dailyGroups).map(([date, dayData]) => {
            const averages = dayData.reduce(
                (acc, curr) => ({
                    temperature: acc.temperature + curr.temperature,
                    humidity: acc.humidity + curr.humidity,
                    windSpeed: acc.windSpeed + curr.windSpeed,
                    precipitation: acc.precipitation + curr.precipitation
                }),
                { temperature: 0, humidity: 0, windSpeed: 0, precipitation: 0 }
            );

            return {
                temperature: Math.round(averages.temperature / dayData.length),
                humidity: Math.round(averages.humidity / dayData.length),
                windSpeed: Math.round(averages.windSpeed / dayData.length),
                precipitation: Math.round(averages.precipitation / dayData.length),
                date
            };
        });
    }

    /**
     * Get average climate data for a date range
     */
    async getAverageClimateData(
        location: LocationCoordinates,
        startDate: string,
        endDate: string
    ): Promise<ProcessedClimateData> {
        const data = await this.fetchClimateData(location, startDate, endDate);

        if (data.length === 0) {
            throw new Error('No data available for the specified date range');
        }

        const averages = data.reduce(
            (acc, curr) => ({
                temperature: acc.temperature + curr.temperature,
                humidity: acc.humidity + curr.humidity,
                windSpeed: acc.windSpeed + curr.windSpeed,
                precipitation: acc.precipitation + curr.precipitation,
                date: curr.date,
                timestamp: curr.timestamp
            }),
            { temperature: 0, humidity: 0, windSpeed: 0, precipitation: 0, date: '', timestamp: '' }
        );

        return {
            temperature: Math.round(averages.temperature / data.length),
            humidity: Math.round(averages.humidity / data.length),
            windSpeed: Math.round(averages.windSpeed / data.length),
            precipitation: Math.round(averages.precipitation / data.length),
            date: endDate,
            timestamp: data[data.length - 1]?.timestamp || ''
        };
    }
}

// Export singleton instance
export const nasaPowerService = new NASAPowerService();
