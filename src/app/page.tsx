"use client"

import React, { useState, useEffect, useRef } from 'react';
import Chart, { ChartDataset, TooltipItem, TooltipModel } from 'chart.js/auto';

// Data for the application
const appData = {
  andes: {
    temp: 17, temp_anomaly: "+1.5°C", wind: 12, humidity: 75, precip: 5, enso: "Neutral", enso_desc: "Condiciones climáticas promedio, pero la tendencia al calentamiento continúa.",
    impact_title: "Estrés en los Páramos Andinos",
    impact_desc: "El aumento de la temperatura está causando que los ecosistemas de páramo, vitales para el suministro de agua de Colombia, se reduzcan. Especies únicas de plantas y animales que dependen de estas condiciones frías están perdiendo su hábitat.",
    impact_data: [13, 34],
    impact_labels: ["Impacto en Temporada Húmeda (%)", "Impacto en Temporada Seca (%)"],
    tip: "Usa el transporte público o la bicicleta. Reducir tu huella de carbono ayuda a frenar el calentamiento que amenaza nuestros páramos.",
    tip_icon: "🚲"
  },
  caribe: {
    temp: 31, temp_anomaly: "+2.1°C", wind: 25, humidity: 85, precip: 2, enso: "El Niño (Fase Cálida)", enso_desc: "Se esperan condiciones más secas y calurosas, aumentando el estrés en los ecosistemas marinos.",
    impact_title: "Blanqueamiento de Corales",
    impact_desc: "Las temperaturas del mar inusualmente altas estresan a los corales, causando que expulsen las algas que viven en sus tejidos y les dan color. Este 'blanqueamiento' puede llevar a la muerte del coral y la pérdida de biodiversidad marina.",
    impact_data: [25, 60],
    impact_labels: ["Mortalidad de Coral Histórica (%)", "Riesgo de Mortalidad Actual (%)"],
    tip: "Reduce el uso de plásticos de un solo uso. La contaminación plástica daña los arrecifes de coral y la vida marina.",
    tip_icon: "🐢"
  },
  pacifico: {
    temp: 26, temp_anomaly: "+1.2°C", wind: 10, humidity: 90, precip: 15, enso: "La Niña (Fase Fría)", enso_desc: "Se esperan precipitaciones superiores a la media, lo que aumenta el riesgo de inundaciones y deslizamientos de tierra.",
    impact_title: "Alteración de Ciclos Hídricos",
    impact_desc: "La deforestación y el cambio climático alteran el ciclo del agua. Lluvias más intensas en periodos cortos pueden causar erosión y afectar a los anfibios, que son muy sensibles a los cambios de humedad y calidad del agua.",
    impact_data: [15, 40],
    impact_labels: ["Aumento de Escorrentía (%)", "Riesgo para Anfibios (%)"],
    tip: "Apoya la reforestación y protege los bosques locales. Los árboles son cruciales para regular el flujo de agua y prevenir la erosión.",
    tip_icon: "🌳"
  },
  amazonia: {
    temp: 28, temp_anomaly: "+1.8°C", wind: 15, humidity: 88, precip: 8, enso: "Neutral", enso_desc: "El aumento de la temperatura y los cambios en los patrones de lluvia aumentan la frecuencia de los incendios forestales.",
    impact_title: "Riesgo de Incendios Forestales",
    impact_desc: "Períodos secos más largos y vientos fuertes crean las condiciones perfectas para la propagación de incendios. Estos destruyen vastas áreas de selva, liberan carbono y amenazan a innumerables especies.",
    impact_data: [30, 55],
    impact_labels: ["Humedad Relativa (%)", "Riesgo de Incendio Relativo (%)"],
    tip: "Reduce tu consumo de carne. La ganadería es uno de los principales motores de la deforestación en la Amazonía.",
    tip_icon: "🔥"
  },
  orinoquia: {
    temp: 27, temp_anomaly: "+1.6°C", wind: 20, humidity: 70, precip: 3, enso: "El Niño (Fase Cálida)", enso_desc: "La fase cálida de El Niño intensifica las sequías, afectando la humedad del suelo y la disponibilidad de agua.",
    impact_title: "Degradación del Suelo",
    impact_desc: "La disminución de la lluvia y la mayor evaporación reducen la humedad del suelo, vital para la agricultura y los ecosistemas de sabana. Esto puede llevar a la desertificación y a la pérdida de tierras productivas.",
    impact_data: [20, 45],
    impact_labels: ["Humedad del Suelo Actual (%)", "Humedad del Suelo Óptima (%)"],
    tip: "Conserva el agua en casa. Cada gota cuenta, especialmente durante períodos de sequía. Repara las fugas y usa el agua de manera consciente.",
    tip_icon: "💧"
  }
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];

// Main App Component
export default function Home() {
  // State variables for managing location and active tab
  const [selectedLocation, setSelectedLocation] = useState('andes');
  const [activeTab, setActiveTab] = useState('dashboard');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const impactsChartInstance = useRef<Chart | null>(null);

  const [startDate, setStartDate] = useState(formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));
  const [endDate, setEndDate] = useState(formatDate(new Date()));

  // Effect hook to re-render chart when location or tab changes
  useEffect(() => {
    if (activeTab === 'impacts') {
      renderImpactsChart();
    } else {
      // Destroy existing chart instance if not on impacts tab
      if (impactsChartInstance.current) {
        impactsChartInstance.current;
        impactsChartInstance.current = null;
      }
    }
  }, [selectedLocation, activeTab]);

  useEffect(() => {
    // In a real application, this is where you would fetch data
    // from your backend/APIs based on selectedLocation, startDate, and endDate.
    // For this MVP, data remains static, but the UI is ready.
    console.log(`Fetching data for ${selectedLocation} from ${startDate} to ${endDate}`);
    // Example: fetchData(selectedLocation, startDate, endDate).then(data => setDynamicData(data));
    // For now, we'll just re-render the current static content to reflect date selection.
    if (activeTab === 'impacts') {
      renderImpactsChart();
    }
  }, [selectedLocation, startDate, endDate, activeTab]);


  // Function to render the Chart.js bar chart for impacts
  const renderImpactsChart = () => {
    const data = appData[selectedLocation as keyof typeof appData];
    const ctx = chartRef.current?.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    // Destroy existing chart instance before creating a new one
    if (impactsChartInstance.current) {
      impactsChartInstance.current.destroy();
    }

    // Create new Chart.js instance
    impactsChartInstance.current = new Chart(ctx, {
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
        maintainAspectRatio: false, // Important for responsive height
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function (value: string | number) {
                return value + '%'
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
  };

  // Get current data based on selected location
  const currentData = appData[selectedLocation as keyof typeof appData];

  return (
   <div className="text-gray-800 font-inter bg-[#F9F9F7] min-h-screen overflow-x-hidden"> {/* Added overflow-x-hidden */}
            <div className="container mx-auto max-w-7xl"> {/* Removed p-4 md:p-6 */}
                {/* Header Section */}
                <header className="text-center mb-8 px-4 md:px-6 mt-10"> {/* Added px-4 md:px-6 */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Eco-Colombia Insights</h1>
                    <p className="mt-2 text-lg text-gray-600">Conectando el clima, la biodiversidad y la acción en Colombia.</p>
                </header>

                {/* Location Selector */}
                <div className="bg-white p-4 rounded-xl shadow-md mb-8 mx-5">
                    <label htmlFor="location-selector" className="block text-sm font-medium text-gray-700 mb-2">Selecciona tu Región:</label>
                    <select
                        id="location-selector"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                        <option value="andes">Región Andina (Ej. Bogotá, Medellín)</option>
                        <option value="caribe">Región Caribe (Ej. Cartagena, Barranquilla)</option>
                        <option value="pacifico">Región Pacífica (Ej. Quibdó, Buenaventura)</option>
                        <option value="amazonia">Región Amazónica (Ej. Leticia, Mitú)</option>
                        <option value="orinoquia">Orinoquía (Ej. Villavicencio, Yopal)</option>
                    </select>

                    {/* Date Pickers */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio:</label>
                            <input
                                type="date"
                                id="start-date"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min="1975-01-01" // Set minimum start date
                                max="2023-11-30"
                            />
                        </div>
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin:</label>
                            <input
                                type="date"
                                id="end-date"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                max="2023-12-31" // Set maximum end date
                            />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                        <span className="font-semibold">Nota:</span> En este MVP, los datos mostrados son estáticos. Los selectores de fecha están listos para integrar datos dinámicos en futuras versiones.
                    </p>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white p-4 mx-5 rounded-xl shadow-md mb-8">
                    <div className="border-b border-gray-200 overflow-x-auto">
                        <nav className="flex -mb-px space-x-6" aria-label="Tabs">
                            <button
                                className={`tab-button whitespace-nowrap py-4 px-4 border-b-2 font-semibold text-base transition-colors duration-200 ${activeTab === 'dashboard' ? 'tab-active border-green-500 text-gray-900' : 'tab-inactive border-transparent text-gray-600'}`}
                                onClick={() => setActiveTab('dashboard')}
                            >
                                Mi Dashboard
                            </button>
                            <button
                                className={`tab-button whitespace-nowrap py-4 px-4 border-b-2 font-semibold text-base transition-colors duration-200 ${activeTab === 'impacts' ? 'tab-active border-green-500 text-gray-900' : 'tab-inactive border-transparent text-gray-600'}`}
                                onClick={() => setActiveTab('impacts')}
                            >
                                Impactos en Biodiversidad
                            </button>
                            <button
                                className={`tab-button whitespace-nowrap py-4 px-4 border-b-2 font-semibold text-base transition-colors duration-200 ${activeTab === 'action' ? 'tab-active border-green-500 text-gray-900' : 'tab-inactive border-transparent text-gray-600'}`}
                                onClick={() => setActiveTab('action')}
                            >
                                ¡Actúa Ahora!
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content Area based on active tab */}
                <main id="content-area" className="bg-white p-4 rounded-xl shadow-md mx-5">
                    {activeTab === 'dashboard' && (
                        <div className="fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                                <h3 className="font-semibold text-blue-800">Temperatura Actual</h3>
                                <p className="text-3xl font-bold text-blue-900">{currentData.temp}°C</p>
                                <p className="text-sm text-blue-700">Anomalía: {currentData.temp_anomaly}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl shadow-sm">
                                <h3 className="font-semibold text-green-800">Viento y Humedad</h3>
                                <p className="text-3xl font-bold text-green-900">{currentData.wind} km/h</p>
                                <p className="text-sm text-green-700">Humedad: {currentData.humidity}%</p>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-xl shadow-sm">
                                <h3 className="font-semibold text-yellow-800">Precipitación (Hoy)</h3>
                                <p className="text-3xl font-bold text-yellow-900">{currentData.precip} mm</p>
                                <p className="text-sm text-yellow-700">Bajo riesgo de lluvia</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl shadow-sm">
                                <h3 className="font-semibold text-purple-800">Fase ENSO Actual</h3>
                                <p className="text-3xl font-bold text-purple-900">{currentData.enso}</p>
                                <p className="text-sm text-purple-700">{currentData.enso_desc}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'impacts' && (
                        <div className="fade-in bg-white p-4 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-2">{currentData.impact_title}</h2>
                            <p className="text-gray-600 mb-6">{currentData.impact_desc}</p>
                            <div className="chart-container">
                                <canvas ref={chartRef} id="impacts-chart"></canvas>
                            </div>
                        </div>
                    )}

                    {activeTab === 'action' && (
                        <div className="fade-in bg-white p-4 rounded-xl shadow-lg text-center">
                            <h2 className="text-2xl font-bold mb-4">Tu Eco-Tip del Día</h2>
                            <div className="text-6xl mb-4">{currentData.tip_icon}</div>
                            <p className="text-lg text-gray-700 max-w-2xl mx-auto">{currentData.tip}</p>
                            <div className="mt-8">
                                <h3 className="font-bold text-xl mb-4">Otras Acciones que Puedes Tomar:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold">💧 Ahorra Agua</h4>
                                        <p className="text-sm text-gray-600">Toma duchas más cortas y repara cualquier fuga en casa.</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold">💡 Reduce Energía</h4>
                                        <p className="text-sm text-gray-600">Apaga las luces y desconecta los aparatos que no estés usando.</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold">♻️ Recicla y Reutiliza</h4>
                                        <p className="text-sm text-gray-600">Separa tus residuos y dale una segunda vida a los objetos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
  );
}