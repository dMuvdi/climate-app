// Climate data types for the application

export interface ClimateData {
    temp: number;
    temp_anomaly: string;
    wind: number;
    humidity: number;
    precip: number;
    enso: string;
    enso_desc: string;
    impact_title: string;
    impact_desc: string;
    impact_data: number[];
    impact_labels: string[];
    tip: string;
    tip_icon: string;
}

export interface LocationData {
    andes: ClimateData;
    caribe: ClimateData;
    pacifico: ClimateData;
    amazonia: ClimateData;
    orinoquia: ClimateData;
}

// NASA POWER API types
export interface NASAPowerParams {
    latitude: number;
    longitude: number;
    start: string;
    end: string;
    community: string;
    parameters: string;
    format: string;
    units: string;
}

export interface NASAPowerResponse {
    type: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    properties: {
        parameter: {
            T2M?: { [timestamp: string]: number };
            RH2M?: { [timestamp: string]: number };
            WS2M?: { [timestamp: string]: number };
            PRECTOTCORR?: { [timestamp: string]: number };
        };
    };
    header: {
        title: string;
        api: {
            version: string;
            name: string;
        };
        sources: string[];
        fill_value: number;
        time_standard: string;
        start: string;
        end: string;
    };
    messages: string[];
    parameters: {
        T2M: {
            units: string;
            longname: string;
        };
        RH2M: {
            units: string;
            longname: string;
        };
        WS2M: {
            units: string;
            longname: string;
        };
        PRECTOTCORR: {
            units: string;
            longname: string;
        };
    };
    times: {
        data: number;
        process: number;
    };
}

export interface ProcessedClimateData {
    temperature: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    date: string;
    timestamp: string;
}

export interface TimeSeriesData {
    timestamp: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    formattedTime: string;
}

export interface ClimateAverages {
    temperature: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    date: string;
}

export interface LocationCoordinates {
    latitude: number;
    longitude: number;
    name: string;
    region: keyof LocationData;
}

export interface DateRange {
    startDate: string;
    endDate: string;
}
