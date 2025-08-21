import React, { useEffect, useRef } from 'react';
import Chart, { ChartDataset, TooltipItem, TooltipModel } from 'chart.js/auto';
import { ClimateData } from '@/types/climate';

interface ImpactsChartProps {
    data: ClimateData;
    isLoading?: boolean;
}

export const ImpactsChart: React.FC<ImpactsChartProps> = ({ data, isLoading = false }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (isLoading) return;

        const ctx = chartRef.current?.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }

        // Destroy existing chart instance before creating a new one
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create new Chart.js instance
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.impact_labels,
                datasets: [{
                    label: 'Impacto en el Ecosistema',
                    data: data.impact_data,
                    backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(239, 68, 68, 0.6)'],
                    borderColor: ['rgba(59, 130, 246, 1)', 'rgba(239, 68, 68, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
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
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (this: TooltipModel<"bar">, tooltipItem: TooltipItem<"bar">) {
                                const dataset = tooltipItem.dataset as ChartDataset<"bar", (number | [number, number] | null)[]>;
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
    }, [data, isLoading]);

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

    return (
        <div className="fade-in bg-white p-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{data.impact_title}</h2>
            <p className="text-gray-600 mb-6">{data.impact_desc}</p>
            <div className="chart-container">
                <canvas ref={chartRef} id="impacts-chart"></canvas>
            </div>
        </div>
    );
};
