import { ProcessedClimateData } from '@/types/climate';

export interface ClimateAnalysis {
    impact_title: string;
    impact_desc: string;
    impact_data: number[];
    impact_labels: string[];
    tip: string;
    tip_icon: string;
    enso: string;
    enso_desc: string;
    risk_level: 'low' | 'medium' | 'high';
    recommendations: string[];
}

export interface ImpactTemplate {
    title: string;
    description: string;
    data_labels: string[];
    data_calculator: (data: ProcessedClimateData[]) => number[];
    conditions: (data: ProcessedClimateData[]) => boolean;
}

export interface EcoTipTemplate {
    icon: string;
    tip: string;
    conditions: (data: ProcessedClimateData[]) => boolean;
    priority: number;
}

class ClimateAnalysisService {
    // Impact templates for different scenarios
    private impactTemplates: ImpactTemplate[] = [
        {
            title: "Estrés en los Páramos Andinos",
            description: "El aumento de la temperatura está causando que los ecosistemas de páramo, vitales para el suministro de agua de Colombia, se reduzcan. Especies únicas de plantas y animales que dependen de estas condiciones frías están perdiendo su hábitat.",
            data_labels: ["Impacto en Temporada Húmeda (%)", "Impacto en Temporada Seca (%)"],
            data_calculator: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                const tempStress = Math.min(100, Math.max(0, (avgTemp - 15) * 10));
                const humidityStress = Math.min(100, Math.max(0, (85 - data.reduce((sum, d) => sum + d.humidity, 0) / data.length) * 2));
                return [Math.round(tempStress), Math.round(humidityStress)];
            },
            conditions: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                return avgTemp > 18;
            }
        },
        {
            title: "Blanqueamiento de Corales",
            description: "Las temperaturas del mar inusualmente altas estresan a los corales, causando que expulsen las algas que viven en sus tejidos y les dan color. Este 'blanqueamiento' puede llevar a la muerte del coral y la pérdida de biodiversidad marina.",
            data_labels: ["Mortalidad de Coral Histórica (%)", "Riesgo de Mortalidad Actual (%)"],
            data_calculator: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                const coralRisk = Math.min(100, Math.max(0, (avgTemp - 28) * 15));
                return [25, Math.round(coralRisk)];
            },
            conditions: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                return avgTemp > 30;
            }
        },
        {
            title: "Alteración de Ciclos Hídricos",
            description: "La deforestación y el cambio climático alteran el ciclo del agua. Lluvias más intensas en periodos cortos pueden causar erosión y afectar a los anfibios, que son muy sensibles a los cambios de humedad y calidad del agua.",
            data_labels: ["Aumento de Escorrentía (%)", "Riesgo para Anfibios (%)"],
            data_calculator: (data) => {
                const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;
                const runoffRisk = Math.min(100, Math.max(0, avgPrecip * 3));
                const amphibianRisk = Math.min(100, Math.max(0, (avgPrecip - 5) * 8));
                return [Math.round(runoffRisk), Math.round(amphibianRisk)];
            },
            conditions: (data) => {
                const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;
                return avgPrecip > 8;
            }
        },
        {
            title: "Riesgo de Incendios Forestales",
            description: "Períodos secos más largos y vientos fuertes crean las condiciones perfectas para la propagación de incendios. Estos destruyen vastas áreas de selva, liberan carbono y amenazan a innumerables especies.",
            data_labels: ["Humedad Relativa (%)", "Riesgo de Incendio Relativo (%)"],
            data_calculator: (data) => {
                const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
                const avgWind = data.reduce((sum, d) => sum + d.windSpeed, 0) / data.length;
                const fireRisk = Math.min(100, Math.max(0, (70 - avgHumidity) + (avgWind - 10) * 2));
                return [Math.round(avgHumidity), Math.round(fireRisk)];
            },
            conditions: (data) => {
                const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
                const avgWind = data.reduce((sum, d) => sum + d.windSpeed, 0) / data.length;
                return avgHumidity < 75 && avgWind > 15;
            }
        },
        {
            title: "Degradación del Suelo",
            description: "La disminución de la lluvia y la mayor evaporación reducen la humedad del suelo, vital para la agricultura y los ecosistemas de sabana. Esto puede llevar a la desertificación y a la pérdida de tierras productivas.",
            data_labels: ["Humedad del Suelo Actual (%)", "Humedad del Suelo Óptima (%)"],
            data_calculator: (data) => {
                const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
                const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;
                const soilMoisture = Math.min(100, Math.max(0, avgHumidity * 0.8 + avgPrecip * 5));
                return [Math.round(soilMoisture), 80];
            },
            conditions: (data) => {
                const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
                const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;
                return avgHumidity < 70 && avgPrecip < 3;
            }
        }
    ];

    // Eco tip templates
    private ecoTipTemplates: EcoTipTemplate[] = [
        {
            icon: "🚲",
            tip: "Usa el transporte público o la bicicleta. Reducir tu huella de carbono ayuda a frenar el calentamiento que amenaza nuestros ecosistemas.",
            conditions: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                return avgTemp > 25;
            },
            priority: 1
        },
        {
            icon: "💧",
            tip: "Conserva el agua en casa. Cada gota cuenta, especialmente durante períodos de sequía. Repara las fugas y usa el agua de manera consciente.",
            conditions: (data) => {
                const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;
                return avgPrecip < 5;
            },
            priority: 2
        },
        {
            icon: "🌳",
            tip: "Apoya la reforestación y protege los bosques locales. Los árboles son cruciales para regular el flujo de agua y prevenir la erosión.",
            conditions: (data) => {
                const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;
                return avgPrecip > 10;
            },
            priority: 3
        },
        {
            icon: "🔥",
            tip: "Reduce tu consumo de carne. La ganadería es uno de los principales motores de la deforestación y contribuye significativamente al cambio climático.",
            conditions: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                return avgTemp > 28;
            },
            priority: 4
        },
        {
            icon: "🐢",
            tip: "Reduce el uso de plásticos de un solo uso. La contaminación plástica daña los ecosistemas marinos y terrestres.",
            conditions: (data) => {
                const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
                return avgHumidity > 80;
            },
            priority: 5
        },
        {
            icon: "💡",
            tip: "Apaga las luces y desconecta los aparatos que no estés usando. Cada vatio ahorrado reduce las emisiones de CO2.",
            conditions: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                return avgTemp > 22;
            },
            priority: 6
        },
        {
            icon: "♻️",
            tip: "Separa tus residuos y dale una segunda vida a los objetos. El reciclaje reduce la presión sobre los recursos naturales.",
            conditions: () => true, // Always applicable
            priority: 7
        }
    ];

    /**
     * Analyze climate data and generate dynamic impacts and eco tips
     */
    analyzeClimateData(data: ProcessedClimateData[], region: string): ClimateAnalysis {
        if (!data || data.length === 0) {
            return this.getDefaultAnalysis(region);
        }

        // Find the most relevant impact template
        const relevantImpact = this.impactTemplates.find(template => template.conditions(data))
            || this.impactTemplates[0]; // Fallback to first template

        // Calculate impact data
        const impactData = relevantImpact.data_calculator(data);

        // Find the most relevant eco tip
        const relevantTips = this.ecoTipTemplates
            .filter(tip => tip.conditions(data))
            .sort((a, b) => a.priority - b.priority);

        const selectedTip = relevantTips[0] || this.ecoTipTemplates[6]; // Fallback to recycling tip

        // Determine ENSO conditions based on temperature and precipitation patterns
        const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
        const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;
        const ensoInfo = this.determineENSO(avgTemp, avgPrecip, region);

        // Calculate risk level
        const riskLevel = this.calculateRiskLevel(data);

        // Generate recommendations
        const recommendations = this.generateRecommendations(data, region, riskLevel);

        return {
            impact_title: relevantImpact.title,
            impact_desc: relevantImpact.description,
            impact_data: impactData,
            impact_labels: relevantImpact.data_labels,
            tip: selectedTip.tip,
            tip_icon: selectedTip.icon,
            enso: ensoInfo.enso,
            enso_desc: ensoInfo.description,
            risk_level: riskLevel,
            recommendations
        };
    }

    /**
     * Determine ENSO conditions based on climate data
     */
    private determineENSO(avgTemp: number, avgPrecip: number, region: string): { enso: string; description: string } {
        const regionBaselines = {
            andes: { temp: 17, precip: 5 },
            caribe: { temp: 31, precip: 2 },
            pacifico: { temp: 26, precip: 15 },
            amazonia: { temp: 28, precip: 8 },
            orinoquia: { temp: 27, precip: 3 }
        };

        const baseline = regionBaselines[region as keyof typeof regionBaselines] || regionBaselines.andes;
        const tempAnomaly = avgTemp - baseline.temp;
        const precipAnomaly = avgPrecip - baseline.precip;

        if (tempAnomaly > 2 && precipAnomaly < -2) {
            return {
                enso: "El Niño (Fase Cálida)",
                description: "Se esperan condiciones más secas y calurosas, aumentando el estrés en los ecosistemas."
            };
        } else if (tempAnomaly < -1 && precipAnomaly > 3) {
            return {
                enso: "La Niña (Fase Fría)",
                description: "Se esperan precipitaciones superiores a la media, lo que puede causar inundaciones y deslizamientos."
            };
        } else {
            return {
                enso: "Neutral",
                description: "Condiciones climáticas promedio, pero la tendencia al calentamiento continúa."
            };
        }
    }

    /**
     * Calculate overall risk level
     */
    private calculateRiskLevel(data: ProcessedClimateData[]): 'low' | 'medium' | 'high' {
        const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
        const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
        const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;
        const avgWind = data.reduce((sum, d) => sum + d.windSpeed, 0) / data.length;

        let riskScore = 0;

        // Temperature risk
        if (avgTemp > 30) riskScore += 3;
        else if (avgTemp > 25) riskScore += 2;
        else if (avgTemp > 20) riskScore += 1;

        // Humidity risk
        if (avgHumidity < 60) riskScore += 2;
        else if (avgHumidity > 90) riskScore += 1;

        // Precipitation risk
        if (avgPrecip > 15) riskScore += 2;
        else if (avgPrecip < 2) riskScore += 2;

        // Wind risk
        if (avgWind > 20) riskScore += 1;

        if (riskScore >= 6) return 'high';
        if (riskScore >= 3) return 'medium';
        return 'low';
    }

    /**
     * Generate specific recommendations based on data and region
     */
    private generateRecommendations(data: ProcessedClimateData[], region: string, riskLevel: 'low' | 'medium' | 'high'): string[] {
        const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
        const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;

        const recommendations: string[] = [];

        // Temperature-based recommendations
        if (avgTemp > 28) {
            recommendations.push("Evita actividades al aire libre durante las horas más calurosas del día");
            recommendations.push("Mantén tu casa fresca usando ventiladores y cortinas");
        }

        // Precipitation-based recommendations
        if (avgPrecip > 10) {
            recommendations.push("Prepara tu casa para posibles inundaciones");
            recommendations.push("Evita conducir en áreas propensas a inundaciones");
        } else if (avgPrecip < 3) {
            recommendations.push("Implementa sistemas de captación de agua de lluvia");
            recommendations.push("Riega tus plantas temprano en la mañana o tarde en la noche");
        }

        // Risk-based recommendations
        if (riskLevel === 'high') {
            recommendations.push("Consulta las alertas meteorológicas locales");
            recommendations.push("Ten un plan de emergencia preparado");
        } else if (riskLevel === 'low') {
            recommendations.push("Aprovecha las condiciones favorables para actividades al aire libre");
        }

        // Region-specific recommendations
        const regionRecs = {
            andes: ["Protege los páramos locales", "Usa transporte público en Bogotá y Medellín"],
            caribe: ["Protege los arrecifes de coral", "Reduce el uso de plásticos"],
            pacifico: ["Apoya la reforestación", "Protege los manglares"],
            amazonia: ["Reduce el consumo de carne", "Apoya productos sostenibles"],
            orinoquia: ["Conserva el agua", "Apoya la agricultura sostenible"]
        };

        recommendations.push(...(regionRecs[region as keyof typeof regionRecs] || []));

        return recommendations.slice(0, 4); // Limit to 4 recommendations
    }

    /**
     * Get default analysis when no data is available
     */
    private getDefaultAnalysis(region: string): ClimateAnalysis {
        const defaults = {
            andes: {
                impact_title: "Estrés en los Páramos Andinos",
                impact_desc: "El aumento de la temperatura está causando que los ecosistemas de páramo, vitales para el suministro de agua de Colombia, se reduzcan.",
                tip: "Usa el transporte público o la bicicleta. Reducir tu huella de carbono ayuda a frenar el calentamiento.",
                tip_icon: "🚲"
            },
            caribe: {
                impact_title: "Blanqueamiento de Corales",
                impact_desc: "Las temperaturas del mar inusualmente altas estresan a los corales, causando que expulsen las algas que viven en sus tejidos.",
                tip: "Reduce el uso de plásticos de un solo uso. La contaminación plástica daña los arrecifes de coral.",
                tip_icon: "🐢"
            },
            pacifico: {
                impact_title: "Alteración de Ciclos Hídricos",
                impact_desc: "La deforestación y el cambio climático alteran el ciclo del agua. Lluvias más intensas pueden causar erosión.",
                tip: "Apoya la reforestación y protege los bosques locales. Los árboles son cruciales para regular el flujo de agua.",
                tip_icon: "🌳"
            },
            amazonia: {
                impact_title: "Riesgo de Incendios Forestales",
                impact_desc: "Períodos secos más largos y vientos fuertes crean las condiciones perfectas para la propagación de incendios.",
                tip: "Reduce tu consumo de carne. La ganadería es uno de los principales motores de la deforestación.",
                tip_icon: "🔥"
            },
            orinoquia: {
                impact_title: "Degradación del Suelo",
                impact_desc: "La disminución de la lluvia y la mayor evaporación reducen la humedad del suelo, vital para la agricultura.",
                tip: "Conserva el agua en casa. Cada gota cuenta, especialmente durante períodos de sequía.",
                tip_icon: "💧"
            }
        };

        const defaultData = defaults[region as keyof typeof defaults] || defaults.andes;

        return {
            ...defaultData,
            impact_data: [20, 40],
            impact_labels: ["Impacto Actual (%)", "Riesgo Proyectado (%)"],
            enso: "Neutral",
            enso_desc: "Condiciones climáticas promedio, pero la tendencia al calentamiento continúa.",
            risk_level: 'medium',
            recommendations: ["Reduce tu huella de carbono", "Conserva agua", "Protege la biodiversidad local", "Apoya iniciativas sostenibles"]
        };
    }
}

// Export singleton instance
export const climateAnalysisService = new ClimateAnalysisService();
