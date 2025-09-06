import React, { useEffect, useRef } from 'react';
import Chart, { TooltipItem, TooltipModel } from 'chart.js/auto';
import { ClimateData } from '@/types/climate';

interface ImpactsChartProps {
    data: ClimateData;
    isLoading?: boolean;
    region?: string;
}

export const ImpactsChart: React.FC<ImpactsChartProps> = ({ data, isLoading = false, region }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (isLoading) return;

        const ctx = chartRef.current?.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }

        // Debug logging to see what data we're getting
        console.log('ImpactsChart - Region:', region);
        console.log('ImpactsChart - Data:', data);
        console.log('ImpactsChart - Impact Title:', data?.impact_title);
        console.log('ImpactsChart - Impact Data:', data?.impact_data);
        console.log('ImpactsChart - Impact Labels:', data?.impact_labels);

        // Destroy existing chart instance before creating a new one
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Get region-specific chart configuration
        const getRegionChartConfig = (region: string) => {
            const configs = {
                andes: {
                    type: 'bar' as const,
                    colors: {
                        bg: ['rgba(34, 197, 94, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(59, 130, 246, 0.6)'],
                        border: ['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)', 'rgba(59, 130, 246, 1)']
                    },
                    data: {
                        labels: data.impact_labels,
                        datasets: [{
                            label: 'Impacto en Páramos',
                            data: data.impact_data,
                            backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(59, 130, 246, 0.6)'],
                            borderColor: ['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)', 'rgba(59, 130, 246, 1)'],
                            borderWidth: 2
                        }]
                    }
                },
                caribe: {
                    type: 'pie' as const,
                    colors: {
                        bg: ['rgba(59, 130, 246, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(16, 185, 129, 0.6)'],
                        border: ['rgba(59, 130, 246, 1)', 'rgba(245, 158, 11, 1)', 'rgba(239, 68, 68, 1)', 'rgba(16, 185, 129, 1)']
                    },
                    data: {
                        labels: data.impact_labels,
                        datasets: [{
                            label: 'Impacto en Ecosistemas Marinos',
                            data: data.impact_data,
                            backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(16, 185, 129, 0.6)'],
                            borderColor: ['rgba(59, 130, 246, 1)', 'rgba(245, 158, 11, 1)', 'rgba(239, 68, 68, 1)', 'rgba(16, 185, 129, 1)'],
                            borderWidth: 2
                        }]
                    }
                },
                pacifico: {
                    type: 'doughnut' as const,
                    colors: {
                        bg: ['rgba(16, 185, 129, 0.6)', 'rgba(139, 69, 19, 0.6)', 'rgba(34, 197, 94, 0.6)'],
                        border: ['rgba(16, 185, 129, 1)', 'rgba(139, 69, 19, 1)', 'rgba(34, 197, 94, 1)']
                    },
                    data: {
                        labels: data.impact_labels,
                        datasets: [{
                            label: 'Impacto en Ciclos Hídricos',
                            data: data.impact_data,
                            backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(139, 69, 19, 0.6)', 'rgba(34, 197, 94, 0.6)'],
                            borderColor: ['rgba(16, 185, 129, 1)', 'rgba(139, 69, 19, 1)', 'rgba(34, 197, 94, 1)'],
                            borderWidth: 2
                        }]
                    }
                },
                amazonia: {
                    type: 'line' as const,
                    colors: {
                        bg: ['rgba(34, 197, 94, 0.6)', 'rgba(220, 38, 38, 0.6)', 'rgba(245, 158, 11, 0.6)'],
                        border: ['rgba(34, 197, 94, 1)', 'rgba(220, 38, 38, 1)', 'rgba(245, 158, 11, 1)']
                    },
                    data: {
                        labels: data.impact_labels,
                        datasets: [{
                            label: 'Tendencia de Incendios Forestales',
                            data: data.impact_data,
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            borderColor: 'rgba(220, 38, 38, 1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: 'rgba(220, 38, 38, 1)',
                            pointBorderColor: 'rgba(255, 255, 255, 1)',
                            pointBorderWidth: 2,
                            pointRadius: 6
                        }]
                    }
                },
                orinoquia: {
                    type: 'radar' as const,
                    colors: {
                        bg: ['rgba(245, 158, 11, 0.6)', 'rgba(168, 85, 247, 0.6)', 'rgba(34, 197, 94, 0.6)'],
                        border: ['rgba(245, 158, 11, 1)', 'rgba(168, 85, 247, 1)', 'rgba(34, 197, 94, 1)']
                    },
                    data: {
                        labels: data.impact_labels,
                        datasets: [{
                            label: 'Estado del Suelo',
                            data: data.impact_data,
                            backgroundColor: 'rgba(245, 158, 11, 0.2)',
                            borderColor: 'rgba(168, 85, 247, 1)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(168, 85, 247, 1)',
                            pointBorderColor: 'rgba(255, 255, 255, 1)',
                            pointBorderWidth: 2,
                            pointRadius: 4
                        }]
                    }
                }
            };
            return configs[region as keyof typeof configs] || configs.andes;
        };

        const chartConfig = getRegionChartConfig(region || 'andes');

        // Create new Chart.js instance
        chartInstance.current = new Chart(ctx, {
            type: chartConfig.type,
            data: chartConfig.data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: chartConfig.type === 'radar' ? {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function (value: string | number) {
                                return value + '%';
                            }
                        }
                    }
                } : {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function (value: string | number) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: chartConfig.type === 'pie' || chartConfig.type === 'doughnut' || chartConfig.type === 'radar',
                        position: 'bottom' as const,
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (this: TooltipModel<"bar" | "pie" | "doughnut" | "line" | "radar">, tooltipItem: TooltipItem<"bar" | "pie" | "doughnut" | "line" | "radar">) {
                                const dataset = tooltipItem.dataset;
                                if (chartConfig.type === 'pie' || chartConfig.type === 'doughnut') {
                                    return `${tooltipItem.label}: ${tooltipItem.formattedValue}%`;
                                }
                                return `${dataset.label}: ${tooltipItem.formattedValue}%`;
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
    }, [data, isLoading, region]);

    if (isLoading) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-lg">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // Get region display name and chart type
    const getRegionDisplayInfo = (region: string) => {
        const regionInfo = {
            andes: { name: 'Región Andina', chartType: 'Gráfico de Barras', icon: '📊' },
            caribe: { name: 'Región Caribe', chartType: 'Gráfico Circular', icon: '🥧' },
            pacifico: { name: 'Región Pacífica', chartType: 'Gráfico de Donut', icon: '🍩' },
            amazonia: { name: 'Región Amazónica', chartType: 'Gráfico de Líneas', icon: '📈' },
            orinoquia: { name: 'Orinoquía', chartType: 'Gráfico Radar', icon: '🎯' }
        };
        return regionInfo[region as keyof typeof regionInfo] || { name: 'Región', chartType: 'Gráfico', icon: '📊' };
    };

    // Get region-specific title and subtitle
    const getRegionTitleAndSubtitle = (region: string) => {
        const regionTitles = {
            andes: {
                title: '🏔️ Estrés en Páramos Andinos',
                subtitle: 'Análisis del impacto climático en los ecosistemas de alta montaña'
            },
            caribe: {
                title: '🌊 Blanqueamiento de Corales',
                subtitle: 'Estado de salud de los arrecifes coralinos del Caribe'
            },
            pacifico: {
                title: '🌧️ Alteración de Ciclos Hídricos',
                subtitle: 'Impacto en los patrones de lluvia y ecosistemas acuáticos'
            },
            amazonia: {
                title: '🔥 Riesgo de Incendios Forestales',
                subtitle: 'Monitoreo de condiciones propicias para incendios en la selva'
            },
            orinoquia: {
                title: '🌾 Degradación del Suelo',
                subtitle: 'Evaluación de la salud del suelo y productividad agrícola'
            }
        };
        return regionTitles[region as keyof typeof regionTitles] || {
            title: 'Impactos en Biodiversidad',
            subtitle: 'Análisis de los efectos del cambio climático'
        };
    };

    const regionInfo = region ? getRegionDisplayInfo(region) : null;
    const regionTitleInfo = region ? getRegionTitleAndSubtitle(region) : null;

    return (
        <div className="fade-in bg-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {regionTitleInfo?.title || data.impact_title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {regionTitleInfo?.subtitle || data.impact_desc}
                    </p>
                </div>
                {regionInfo && (
                    <div className="flex flex-col items-end space-y-1">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            {regionInfo.icon} {regionInfo.name}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {regionInfo.chartType}
                        </span>
                    </div>
                )}
            </div>
            <div className="chart-container" style={{ height: '400px' }}>
                <canvas ref={chartRef} id="impacts-chart"></canvas>
            </div>
        </div>
    );
};
