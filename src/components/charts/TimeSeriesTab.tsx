import React, { useState } from 'react';
import { TimeSeriesChart } from './TimeSeriesChart';
import { TimeSeriesData } from '@/types/climate';

interface TimeSeriesTabProps {
    data: TimeSeriesData[];
    isLoading?: boolean;
}

export const TimeSeriesTab: React.FC<TimeSeriesTabProps> = ({ data, isLoading = false }) => {
    const [selectedParameter, setSelectedParameter] = useState<'temperature' | 'humidity' | 'windSpeed' | 'precipitation'>('temperature');

    const parameters = [
        { key: 'temperature', label: '🌡️ Temperatura', icon: '🌡️' },
        { key: 'humidity', label: '💧 Humedad', icon: '💧' },
        { key: 'windSpeed', label: '💨 Viento', icon: '💨' },
        { key: 'precipitation', label: '🌧️ Precipitación', icon: '🌧️' }
    ] as const;

    return (
        <div className="fade-in">
            {/* Parameter Selector */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Selecciona el parámetro a visualizar:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {parameters.map((param) => (
                        <button
                            key={param.key}
                            onClick={() => setSelectedParameter(param.key)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${selectedParameter === param.key
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                }`}
                        >
                            <div className="text-2xl mb-1">{param.icon}</div>
                            <div className="text-sm font-medium">{param.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <TimeSeriesChart
                data={data}
                parameter={selectedParameter}
                isLoading={isLoading}
                className="mb-6"
            />

            {/* Data Summary */}
            {!isLoading && data.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-gray-800">Resumen de Datos:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Mínimo:</span>
                            <div className="font-semibold">
                                {Math.min(...data.map(d => d[selectedParameter]))}
                                {selectedParameter === 'temperature' ? '°C' :
                                    selectedParameter === 'humidity' ? '%' :
                                        selectedParameter === 'windSpeed' ? ' km/h' : ' mm/h'}
                            </div>
                        </div>
                        <div>
                            <span className="text-gray-600">Máximo:</span>
                            <div className="font-semibold">
                                {Math.max(...data.map(d => d[selectedParameter]))}
                                {selectedParameter === 'temperature' ? '°C' :
                                    selectedParameter === 'humidity' ? '%' :
                                        selectedParameter === 'windSpeed' ? ' km/h' : ' mm/h'}
                            </div>
                        </div>
                        <div>
                            <span className="text-gray-600">Promedio:</span>
                            <div className="font-semibold">
                                {Math.round(data.reduce((sum, d) => sum + d[selectedParameter], 0) / data.length)}
                                {selectedParameter === 'temperature' ? '°C' :
                                    selectedParameter === 'humidity' ? '%' :
                                        selectedParameter === 'windSpeed' ? ' km/h' : ' mm/h'}
                            </div>
                        </div>
                        <div>
                            <span className="text-gray-600">Mediciones:</span>
                            <div className="font-semibold">{data.length} puntos</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
