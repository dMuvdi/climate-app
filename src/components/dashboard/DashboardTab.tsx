import React from 'react';
import { ClimateCard } from './ClimateCard';
import { ClimateData } from '@/types/climate';

interface DashboardTabProps {
    data: ClimateData;
    isLoading?: boolean;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ data, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 p-4 rounded-xl shadow-sm animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            <ClimateCard
                title="Temperatura Actual"
                value={`${data.temp}°C`}
                subtitle={`Anomalía: ${data.temp_anomaly}`}
                variant="blue"
            />
            <ClimateCard
                title="Viento y Humedad"
                value={`${data.wind} km/h`}
                subtitle={`Humedad: ${data.humidity}%`}
                variant="green"
            />
            <ClimateCard
                title="Precipitación"
                value={`${data.precip} mm`}
                subtitle="Bajo riesgo de lluvia"
                variant="yellow"
            />
        </div>
    );
};
