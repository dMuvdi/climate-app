import React from 'react';
import { ClimateData } from '@/types/climate';
import { climateAnalysisService } from '@/services/analysis/climateAnalysisService';

interface ActionTabProps {
    data: ClimateData;
    isLoading?: boolean;
    region?: string;
}

export const ActionTab: React.FC<ActionTabProps> = ({ data, isLoading = false, region = 'andes' }) => {
    if (isLoading) {
        return (
            <div className="fade-in bg-white p-4 rounded-xl shadow-lg text-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded max-w-2xl mx-auto"></div>
                </div>
            </div>
        );
    }

    // Create a mock data array for analysis (since we only have aggregated data)
    const mockData = [{
        temperature: data.temp,
        humidity: data.humidity,
        windSpeed: data.wind,
        precipitation: data.precip,
        date: new Date().toISOString(),
        timestamp: new Date().toISOString()
    }];

    // Get dynamic analysis based on current data
    const analysis = climateAnalysisService.analyzeClimateData(mockData, region);
    const recommendations = analysis.recommendations;
    const riskLevel = analysis.risk_level;

    // Risk level indicator
    const getRiskLevelColor = (level: string) => {
        switch (level) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getRiskLevelText = (level: string) => {
        switch (level) {
            case 'high': return 'Alto Riesgo';
            case 'medium': return 'Riesgo Moderado';
            case 'low': return 'Bajo Riesgo';
            default: return 'Riesgo Desconocido';
        }
    };

    return (
        <div className="fade-in bg-white p-4 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Tu Eco-Tip del Día</h2>
            <div className="text-6xl mb-4">{data.tip_icon}</div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">{data.tip}</p>

            {/* Risk Level Indicator */}
            <div className="mt-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColor(riskLevel)}`}>
                    {getRiskLevelText(riskLevel)}
                </span>
            </div>

            <div className="mt-8">
                <h3 className="font-bold text-xl mb-4">Recomendaciones Específicas:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {recommendations.map((recommendation, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                            <h4 className="font-semibold text-green-700">✓ {recommendation}</h4>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="font-bold text-xl mb-4">Otras Acciones que Puedes Tomar:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold">💧 Ahorra Agua</h4>
                        <p className="text-sm text-gray-600">
                            Toma duchas más cortas y repara cualquier fuga en casa.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold">💡 Reduce Energía</h4>
                        <p className="text-sm text-gray-600">
                            Apaga las luces y desconecta los aparatos que no estés usando.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold">♻️ Recicla y Reutiliza</h4>
                        <p className="text-sm text-gray-600">
                            Separa tus residuos y dale una segunda vida a los objetos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
