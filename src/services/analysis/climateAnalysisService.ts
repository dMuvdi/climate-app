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
            data_labels: ["Estrés por Temperatura (%)", "Pérdida de Humedad (%)", "Riesgo de Especies (%)"],
            data_calculator: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
                const tempStress = Math.min(100, Math.max(0, (avgTemp - 15) * 10));
                const humidityStress = Math.min(100, Math.max(0, (85 - avgHumidity) * 2));
                const speciesRisk = Math.min(100, Math.max(0, (tempStress + humidityStress) / 2));
                return [Math.round(tempStress), Math.round(humidityStress), Math.round(speciesRisk)];
            },
            conditions: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                return avgTemp > 18;
            }
        },
        {
            title: "Blanqueamiento de Corales",
            description: "Las temperaturas del mar inusualmente altas estresan a los corales, causando que expulsen las algas que viven en sus tejidos y les dan color. Este 'blanqueamiento' puede llevar a la muerte del coral y la pérdida de biodiversidad marina.",
            data_labels: ["Coral Saludable (%)", "Coral Estresado (%)", "Coral Muerto (%)", "Recuperación (%)"],
            data_calculator: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                const coralRisk = Math.min(100, Math.max(0, (avgTemp - 28) * 15));
                const healthy = Math.max(0, 100 - coralRisk - 25);
                const stressed = Math.min(50, coralRisk);
                const dead = Math.min(25, coralRisk * 0.3);
                const recovery = Math.min(20, 100 - coralRisk);
                return [Math.round(healthy), Math.round(stressed), Math.round(dead), Math.round(recovery)];
            },
            conditions: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                return avgTemp > 30;
            }
        },
        {
            title: "Alteración de Ciclos Hídricos",
            description: "La deforestación y el cambio climático alteran el ciclo del agua. Lluvias más intensas en periodos cortos pueden causar erosión y afectar a los anfibios, que son muy sensibles a los cambios de humedad y calidad del agua.",
            data_labels: ["Escorrentía Normal (%)", "Escorrentía Alta (%)", "Erosión del Suelo (%)"],
            data_calculator: (data) => {
                const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;
                const runoffRisk = Math.min(100, Math.max(0, avgPrecip * 3));
                const normalRunoff = Math.max(0, 100 - runoffRisk);
                const highRunoff = Math.min(60, runoffRisk);
                const erosion = Math.min(40, runoffRisk * 0.5);
                return [Math.round(normalRunoff), Math.round(highRunoff), Math.round(erosion)];
            },
            conditions: (data) => {
                const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;
                return avgPrecip > 8;
            }
        },
        {
            title: "Riesgo de Incendios Forestales",
            description: "Períodos secos más largos y vientos fuertes crean las condiciones perfectas para la propagación de incendios. Estos destruyen vastas áreas de selva, liberan carbono y amenazan a innumerables especies.",
            data_labels: ["Temperatura (°C)", "Humedad (%)", "Viento (km/h)", "Riesgo de Incendio (%)"],
            data_calculator: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
                const avgWind = data.reduce((sum, d) => sum + d.windSpeed, 0) / data.length;
                const fireRisk = Math.min(100, Math.max(0, (70 - avgHumidity) + (avgWind - 10) * 2 + (avgTemp - 25) * 3));
                return [Math.round(avgTemp), Math.round(avgHumidity), Math.round(avgWind), Math.round(fireRisk)];
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
            data_labels: ["Humedad del Suelo (%)", "Fertilidad (%)", "Erosión (%)", "Productividad (%)"],
            data_calculator: (data) => {
                const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
                const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;
                const soilMoisture = Math.min(100, Math.max(0, avgHumidity * 0.8 + avgPrecip * 5));
                const fertility = Math.min(100, Math.max(0, soilMoisture * 0.9));
                const erosion = Math.min(100, Math.max(0, (100 - soilMoisture) * 0.7));
                const productivity = Math.min(100, Math.max(0, (soilMoisture + fertility) / 2 - erosion * 0.3));
                return [Math.round(soilMoisture), Math.round(fertility), Math.round(erosion), Math.round(productivity)];
            },
            conditions: (data) => {
                const avgHumidity = data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
                const avgPrecip = data.reduce((sum, d) => sum + d.precipitation, 0) / data.length;
                return avgHumidity < 70 && avgPrecip < 3;
            }
        },
        {
            title: "Pérdida de Biodiversidad Marina",
            description: "El aumento de la temperatura del mar y la acidificación de los océanos están afectando gravemente a los ecosistemas marinos. Los corales, peces y otras especies marinas están perdiendo sus hábitats naturales.",
            data_labels: ["Acidificación del Océano (%)", "Pérdida de Biodiversidad (%)"],
            data_calculator: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                const acidification = Math.min(100, Math.max(0, (avgTemp - 28) * 8));
                const biodiversityLoss = Math.min(100, Math.max(0, (avgTemp - 26) * 12));
                return [Math.round(acidification), Math.round(biodiversityLoss)];
            },
            conditions: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                return avgTemp > 29;
            }
        },
        {
            title: "Alteración de Migraciones",
            description: "Los cambios en los patrones climáticos están afectando las rutas de migración de aves y otros animales. Esto puede llevar a la pérdida de especies que dependen de estos ciclos naturales.",
            data_labels: ["Cambio en Rutas de Migración (%)", "Riesgo para Especies Migratorias (%)"],
            data_calculator: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                const avgWind = data.reduce((sum, d) => sum + d.windSpeed, 0) / data.length;
                const migrationChange = Math.min(100, Math.max(0, (avgTemp - 20) * 5));
                const speciesRisk = Math.min(100, Math.max(0, migrationChange + (avgWind - 10) * 2));
                return [Math.round(migrationChange), Math.round(speciesRisk)];
            },
            conditions: (data) => {
                const avgTemp = data.reduce((sum, d) => sum + d.temperature, 0) / data.length;
                const avgWind = data.reduce((sum, d) => sum + d.windSpeed, 0) / data.length;
                return avgTemp > 22 && avgWind > 12;
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
        console.log('ClimateAnalysisService - Analyzing data for region:', region);
        console.log('ClimateAnalysisService - Data length:', data?.length);

        if (!data || data.length === 0) {
            console.log('ClimateAnalysisService - No data, using default analysis');
            return this.getDefaultAnalysis(region);
        }

        // Find the most relevant impact template
        const relevantImpact = this.impactTemplates.find(template => template.conditions(data))
            || this.impactTemplates[0]; // Fallback to first template

        console.log('ClimateAnalysisService - Selected impact:', relevantImpact.title);

        // Calculate impact data
        const impactData = relevantImpact.data_calculator(data);

        console.log('ClimateAnalysisService - Calculated impact data:', impactData);

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
        console.log('ClimateAnalysisService - Getting default analysis for region:', region);

        const defaults = {
            andes: {
                impact_title: "Estrés en los Páramos Andinos",
                impact_desc: "El aumento de la temperatura está causando que los ecosistemas de páramo, vitales para el suministro de agua de Colombia, se reduzcan. Especies únicas como el frailejón y el cóndor andino están perdiendo su hábitat natural.",
                impact_data: [25, 45],
                impact_labels: ["Impacto en Temporada Húmeda (%)", "Impacto en Temporada Seca (%)"],
                tip: "Usa el transporte público o la bicicleta. Reducir tu huella de carbono ayuda a frenar el calentamiento que amenaza nuestros páramos.",
                tip_icon: "🚲"
            },
            caribe: {
                impact_title: "Blanqueamiento de Corales",
                impact_desc: "Las temperaturas del mar inusualmente altas estresan a los corales, causando que expulsen las algas que viven en sus tejidos. Esto amenaza a especies como el pez loro y las tortugas marinas.",
                impact_data: [30, 65],
                impact_labels: ["Mortalidad de Coral Histórica (%)", "Riesgo de Mortalidad Actual (%)"],
                tip: "Reduce el uso de plásticos de un solo uso. La contaminación plástica daña los arrecifes de coral y la vida marina.",
                tip_icon: "🐢"
            },
            pacifico: {
                impact_title: "Alteración de Ciclos Hídricos",
                impact_desc: "La deforestación y el cambio climático alteran el ciclo del agua. Lluvias más intensas pueden causar erosión y afectar a especies como la rana dorada y los anfibios endémicos.",
                impact_data: [20, 50],
                impact_labels: ["Aumento de Escorrentía (%)", "Riesgo para Anfibios (%)"],
                tip: "Apoya la reforestación y protege los bosques locales. Los árboles son cruciales para regular el flujo de agua y prevenir la erosión.",
                tip_icon: "🌳"
            },
            amazonia: {
                impact_title: "Riesgo de Incendios Forestales",
                impact_desc: "Períodos secos más largos y vientos fuertes crean las condiciones perfectas para la propagación de incendios. Esto amenaza a especies como el jaguar, el delfín rosado y miles de especies de plantas.",
                impact_data: [35, 60],
                impact_labels: ["Humedad Relativa (%)", "Riesgo de Incendio Relativo (%)"],
                tip: "Reduce tu consumo de carne. La ganadería es uno de los principales motores de la deforestación en la Amazonía.",
                tip_icon: "🔥"
            },
            orinoquia: {
                impact_title: "Degradación del Suelo",
                impact_desc: "La disminución de la lluvia y la mayor evaporación reducen la humedad del suelo, vital para la agricultura y los ecosistemas de sabana. Esto afecta a especies como el venado de cola blanca y las aves migratorias.",
                impact_data: [25, 55],
                impact_labels: ["Humedad del Suelo Actual (%)", "Humedad del Suelo Óptima (%)"],
                tip: "Conserva el agua en casa. Cada gota cuenta, especialmente durante períodos de sequía. Repara las fugas y usa el agua de manera consciente.",
                tip_icon: "💧"
            }
        };

        const defaultData = defaults[region as keyof typeof defaults] || defaults.andes;

        return {
            ...defaultData,
            enso: "Neutral",
            enso_desc: "Condiciones climáticas promedio, pero la tendencia al calentamiento continúa.",
            risk_level: 'medium',
            recommendations: ["Reduce tu huella de carbono", "Conserva agua", "Protege la biodiversidad local", "Apoya iniciativas sostenibles"]
        };
    }
}

// Export singleton instance
export const climateAnalysisService = new ClimateAnalysisService();
