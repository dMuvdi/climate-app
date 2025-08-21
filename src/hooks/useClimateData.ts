import { useQuery } from '@tanstack/react-query';
import { nasaPowerService } from '@/services/api/nasaPowerService';
import { STATIC_CLIMATE_DATA, LOCATION_COORDINATES } from '@/constants/locations';
import { ClimateData, ProcessedClimateData, TimeSeriesData, ClimateAverages } from '@/types/climate';
import { climateAnalysisService } from '@/services/analysis/climateAnalysisService';

interface UseClimateDataOptions {
    location: string;
    startDate: string;
    endDate: string;
    useStaticData?: boolean;
}

interface UseClimateDataReturn {
    data: ClimateData | null;
    nasaData: ProcessedClimateData[] | null;
    timeSeriesData: TimeSeriesData[] | null;
    dailyAverages: ClimateAverages[] | null;
    isLoading: boolean;
    error: Error | null;
    isStaticData: boolean;
}

export const useClimateData = ({
    location,
    startDate,
    endDate,
    useStaticData = false
}: UseClimateDataOptions): UseClimateDataReturn => {
    // Get location coordinates
    const locationCoords = LOCATION_COORDINATES.find(loc => loc.region === location);

    // Query for NASA POWER data
    const {
        data: nasaData,
        isLoading: nasaLoading,
        error: nasaError
    } = useQuery({
        queryKey: ['climate-data', location, startDate, endDate],
        queryFn: async () => {
            if (!locationCoords || useStaticData) {
                throw new Error('Using static data or location not found');
            }
            return await nasaPowerService.fetchClimateData(locationCoords, startDate, endDate);
        },
        enabled: !useStaticData && !!locationCoords,
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    });

    // Query for time series data
    const {
        data: timeSeriesData,
        isLoading: timeSeriesLoading
    } = useQuery({
        queryKey: ['time-series-data', location, startDate, endDate],
        queryFn: async () => {
            if (!locationCoords || useStaticData) {
                throw new Error('Using static data or location not found');
            }
            return await nasaPowerService.getTimeSeriesData(locationCoords, startDate, endDate);
        },
        enabled: !useStaticData && !!locationCoords,
        retry: 2,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    // Query for daily averages
    const {
        data: dailyAverages,
        isLoading: dailyAveragesLoading
    } = useQuery({
        queryKey: ['daily-averages', location, startDate, endDate],
        queryFn: async () => {
            if (!locationCoords || useStaticData) {
                throw new Error('Using static data or location not found');
            }
            return await nasaPowerService.getDailyAverages(locationCoords, startDate, endDate);
        },
        enabled: !useStaticData && !!locationCoords,
        retry: 2,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    // Get static data as fallback
    const staticData = STATIC_CLIMATE_DATA[location as keyof typeof STATIC_CLIMATE_DATA] || null;

    // Transform NASA data to ClimateData format for UI with dynamic analysis
    const transformNASADataToClimateData = (nasaData: ProcessedClimateData[]): ClimateData | null => {
        if (!nasaData || nasaData.length === 0) return null;

        // Calculate averages from NASA data
        const avgTemp = Math.round(nasaData.reduce((sum, d) => sum + d.temperature, 0) / nasaData.length);
        const avgHumidity = Math.round(nasaData.reduce((sum, d) => sum + d.humidity, 0) / nasaData.length);
        const avgWind = Math.round(nasaData.reduce((sum, d) => sum + d.windSpeed, 0) / nasaData.length);
        const avgPrecip = Math.round(nasaData.reduce((sum, d) => sum + d.precipitation, 0) / nasaData.length);

        // Get dynamic analysis based on actual data
        const analysis = climateAnalysisService.analyzeClimateData(nasaData, location);

        // Use static data as template and override with NASA averages and dynamic analysis
        const staticTemplate = STATIC_CLIMATE_DATA[location as keyof typeof STATIC_CLIMATE_DATA];
        if (!staticTemplate) return null;

        return {
            ...staticTemplate,
            temp: avgTemp,
            humidity: avgHumidity,
            wind: avgWind,
            precip: avgPrecip,
            temp_anomaly: `+${Math.abs(avgTemp - staticTemplate.temp).toFixed(1)}°C`,
            // Override with dynamic analysis
            impact_title: analysis.impact_title,
            impact_desc: analysis.impact_desc,
            impact_data: analysis.impact_data,
            impact_labels: analysis.impact_labels,
            tip: analysis.tip,
            tip_icon: analysis.tip_icon,
            enso: analysis.enso,
            enso_desc: analysis.enso_desc
        };
    };

    // Determine which data to use
    const isStaticData = useStaticData || !nasaData || !!nasaError;
    const finalData = isStaticData ? staticData : transformNASADataToClimateData(nasaData || []);



    return {
        data: finalData,
        nasaData: nasaData || null,
        timeSeriesData: timeSeriesData || null,
        dailyAverages: dailyAverages || null,
        isLoading: nasaLoading || timeSeriesLoading || dailyAveragesLoading,
        error: nasaError as Error | null,
        isStaticData
    };
};

// Hook for getting average climate data
export const useAverageClimateData = (options: UseClimateDataOptions) => {
    const locationCoords = LOCATION_COORDINATES.find(loc => loc.region === options.location);

    return useQuery({
        queryKey: ['average-climate-data', options.location, options.startDate, options.endDate],
        queryFn: async () => {
            if (!locationCoords || options.useStaticData) {
                throw new Error('Using static data or location not found');
            }
            return await nasaPowerService.getAverageClimateData(
                locationCoords,
                options.startDate,
                options.endDate
            );
        },
        enabled: !options.useStaticData && !!locationCoords,
        retry: 2,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};
