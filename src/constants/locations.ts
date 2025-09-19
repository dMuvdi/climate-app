import { LocationCoordinates, LocationData } from '@/types/climate';

// Location coordinates for NASA POWER API calls
export const LOCATION_COORDINATES: LocationCoordinates[] = [
    {
        latitude: 4.7110,
        longitude: -74.0721,
        name: 'Región Andina (Ej. Bogotá, Medellín)',
        region: 'andes'
    },
    {
        latitude: 10.3932,
        longitude: -75.4792,
        name: 'Región Caribe (Ej. Cartagena, Barranquilla)',
        region: 'caribe'
    },
    {
        latitude: 5.6900,
        longitude: -76.6600,
        name: 'Región Pacífica (Ej. Quibdó, Buenaventura)',
        region: 'pacifico'
    },
    {
        latitude: -4.2153,
        longitude: -69.9405,
        name: 'Región Amazónica (Ej. Leticia, Mitú)',
        region: 'amazonia'
    },
    {
        latitude: 4.1420,
        longitude: -73.6266,
        name: 'Orinoquía (Ej. Villavicencio, Yopal)',
        region: 'orinoquia'
    }
];

// Static climate data (fallback when API is not available)
export const STATIC_CLIMATE_DATA: LocationData = {
    andes: {
        temp: 17,
        temp_anomaly: "+1.5°C",
        wind: 12,
        humidity: 75,
        precip: 5,
        enso: "Neutral",
        enso_desc: "Condiciones climáticas promedio, pero la tendencia al calentamiento continúa.",
        impact_title: "Estrés en los Páramos Andinos",
        impact_desc: "El aumento de la temperatura está causando que los ecosistemas de páramo, vitales para el suministro de agua de Colombia, se reduzcan. Especies únicas de plantas y animales que dependen de estas condiciones frías están perdiendo su hábitat.",
        impact_data: [25, 35, 30],
        impact_labels: ["Estrés por Temperatura (%)", "Pérdida de Humedad (%)", "Riesgo de Especies (%)"],
        tip: "Usa el transporte público o la bicicleta. Reducir tu huella de carbono ayuda a frenar el calentamiento que amenaza nuestros páramos.",
        tip_icon: "🚲"
    },
    caribe: {
        temp: 31,
        temp_anomaly: "+2.1°C",
        wind: 25,
        humidity: 85,
        precip: 2,
        enso: "El Niño (Fase Cálida)",
        enso_desc: "Se esperan condiciones más secas y calurosas, aumentando el estrés en los ecosistemas marinos.",
        impact_title: "Blanqueamiento de Corales",
        impact_desc: "Las temperaturas del mar inusualmente altas estresan a los corales, causando que expulsen las algas que viven en sus tejidos y les dan color. Este 'blanqueamiento' puede llevar a la muerte del coral y la pérdida de biodiversidad marina.",
        impact_data: [40, 35, 15, 10],
        impact_labels: ["Coral Saludable (%)", "Coral Estresado (%)", "Coral Muerto (%)", "Recuperación (%)"],
        tip: "Reduce el uso de plásticos de un solo uso. La contaminación plástica daña los arrecifes de coral y la vida marina.",
        tip_icon: "🐢"
    },
    pacifico: {
        temp: 26,
        temp_anomaly: "+1.2°C",
        wind: 10,
        humidity: 90,
        precip: 15,
        enso: "La Niña (Fase Fría)",
        enso_desc: "Se esperan precipitaciones superiores a la media, lo que aumenta el riesgo de inundaciones y deslizamientos de tierra.",
        impact_title: "Alteración de Ciclos Hídricos",
        impact_desc: "La deforestación y el cambio climático alteran el ciclo del agua. Lluvias más intensas en periodos cortos pueden causar erosión y afectar a los anfibios, que son muy sensibles a los cambios de humedad y calidad del agua.",
        impact_data: [55, 30, 15],
        impact_labels: ["Escorrentía Normal (%)", "Escorrentía Alta (%)", "Erosión del Suelo (%)"],
        tip: "Apoya la reforestación y protege los bosques locales. Los árboles son cruciales para regular el flujo de agua y prevenir la erosión.",
        tip_icon: "🌳"
    },
    amazonia: {
        temp: 28,
        temp_anomaly: "+1.8°C",
        wind: 15,
        humidity: 88,
        precip: 8,
        enso: "Neutral",
        enso_desc: "El aumento de la temperatura y los cambios en los patrones de lluvia aumentan la frecuencia de los incendios forestales.",
        impact_title: "Riesgo de Incendios Forestales",
        impact_desc: "Períodos secos más largos y vientos fuertes crean las condiciones perfectas para la propagación de incendios. Estos destruyen vastas áreas de selva, liberan carbono y amenazan a innumerables especies.",
        impact_data: [28, 88, 15, 35],
        impact_labels: ["Temperatura (°C)", "Humedad (%)", "Viento (km/h)", "Riesgo de Incendio (%)"],
        tip: "Reduce tu consumo de carne. La ganadería es uno de los principales motores de la deforestación en la Amazonía.",
        tip_icon: "🔥"
    },
    orinoquia: {
        temp: 27,
        temp_anomaly: "+1.6°C",
        wind: 20,
        humidity: 70,
        precip: 3,
        enso: "El Niño (Fase Cálida)",
        enso_desc: "La fase cálida de El Niño intensifica las sequías, afectando la humedad del suelo y la disponibilidad de agua.",
        impact_title: "Degradación del Suelo",
        impact_desc: "La disminución de la lluvia y la mayor evaporación reducen la humedad del suelo, vital para la agricultura y los ecosistemas de sabana. Esto puede llevar a la desertificación y a la pérdida de tierras productivas.",
        impact_data: [45, 40, 25, 60],
        impact_labels: ["Humedad del Suelo (%)", "Fertilidad (%)", "Erosión (%)", "Productividad (%)"],
        tip: "Conserva el agua en casa. Cada gota cuenta, especialmente durante períodos de sequía. Repara las fugas y usa el agua de manera consciente.",
        tip_icon: "💧"
    }
};

// NASA POWER API configuration
export const NASA_POWER_CONFIG = {
    baseUrl: 'https://power.larc.nasa.gov/api/temporal/hourly/point',
    community: 'RE',
    format: 'JSON',
    parameters: ['T2M', 'RH2M', 'WS2M', 'PRECTOTCORR'],
    units: 'metric'
};
