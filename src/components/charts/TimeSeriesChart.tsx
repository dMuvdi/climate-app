import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { TimeSeriesData } from '@/types/climate';

interface TimeSeriesChartProps {
    data: TimeSeriesData[];
    parameter: 'temperature' | 'humidity' | 'windSpeed' | 'precipitation';
    isLoading?: boolean;
    className?: string;
}

const parameterConfig = {
    temperature: {
        label: 'Temperatura (°C)',
        color: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)'
    },
    humidity: {
        label: 'Humedad (%)',
        color: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
    },
    windSpeed: {
        label: 'Velocidad del Viento (km/h)',
        color: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)'
    },
    precipitation: {
        label: 'Precipitación (mm/h)',
        color: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgba(168, 85, 247, 1)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)'
    }
};

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
    data,
    parameter,
    isLoading = false,
    className = ''
}) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (isLoading || !data.length) return;

        const ctx = chartRef.current?.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }

        // Destroy existing chart instance before creating a new one
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const config = parameterConfig[parameter];

        // Create new Chart.js instance
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.formattedTime),
                datasets: [{
                    label: config.label,
                    data: data.map(item => item[parameter]),
                    borderColor: config.borderColor,
                    backgroundColor: config.backgroundColor,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Hora'
                        },
                        ticks: {
                            maxTicksLimit: 8,
                            maxRotation: 45
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: config.label
                        },
                        beginAtZero: parameter === 'precipitation' || parameter === 'humidity'
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                return `Hora: ${context[0].label}`;
                            },
                            label: function (context) {
                                const value = context.parsed.y;
                                const unit = parameter === 'temperature' ? '°C' :
                                    parameter === 'humidity' ? '%' :
                                        parameter === 'windSpeed' ? 'km/h' : 'mm/h';
                                return `${config.label}: ${value}${unit}`;
                            }
                        }
                    }
                }
            }
        });

        // Cleanup function
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [data, parameter, isLoading]);

    if (isLoading) {
        return (
            <div className={`bg-white p-4 rounded-xl shadow-lg ${className}`}>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className={`bg-white p-4 rounded-xl shadow-lg text-center ${className}`}>
                <p className="text-gray-500">No hay datos disponibles para mostrar</p>
            </div>
        );
    }

    return (
        <div className={`bg-white p-4 rounded-xl shadow-lg ${className}`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {parameterConfig[parameter].label} - Variación Temporal
            </h3>
            <div className="chart-container" style={{ height: '300px' }}>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};
