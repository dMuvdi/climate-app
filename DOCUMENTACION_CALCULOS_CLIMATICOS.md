# 📊 Documentación de Cálculos Climáticos
### Proyecto de Feria de Ciencias - 8vo Grado
### Análisis del Impacto del Cambio Climático en la Biodiversidad de Colombia

---

## 🌍 Introducción

Este documento explica las fórmulas matemáticas y cálculos utilizados en nuestro proyecto para analizar el impacto del cambio climático en los diferentes ecosistemas de Colombia. Utilizamos datos reales de temperatura, precipitación, humedad y velocidad del viento para calcular porcentajes que nos ayudan a entender cómo el clima afecta la biodiversidad.

---

## 📡 Variables Climáticas Obtenidas de la NASA

Nuestro proyecto utiliza datos de la **NASA POWER** (Prediction of Worldwide Energy Resources), que nos proporciona las siguientes variables:

### Variables Base:
- **🌡️ Temperatura (T2M)**: Medida en grados Celsius (°C)
- **💧 Humedad Relativa (RH2M)**: Medida como porcentaje (%)
- **💨 Velocidad del Viento (WS2M)**: Medida en kilómetros por hora (km/h)
- **🌧️ Precipitación (PRECTOTCORR)**: Medida en milímetros por día (mm/día)

---

## 🧮 Fórmulas y Cálculos por Región

### 🏔️ **REGIÓN ANDINA - Estrés en Páramos**

Los páramos son ecosistemas únicos que necesitan temperaturas frías y alta humedad para sobrevivir.

#### Fórmulas Utilizadas:

**1. Estrés por Temperatura (%):**
```
Estrés_Temperatura = min(100, max(0, (Temperatura_Promedio - 15) × 10))
```
- **Explicación**: Si la temperatura está por encima de 15°C, cada grado extra multiplica el estrés por 10
- **Ejemplo**: Si la temperatura promedio es 18°C → (18-15) × 10 = 30% de estrés

**2. Pérdida de Humedad (%):**
```
Pérdida_Humedad = min(100, max(0, (85 - Humedad_Promedio) × 2))
```
- **Explicación**: Los páramos necesitan al menos 85% de humedad. Cada punto menos se multiplica por 2
- **Ejemplo**: Si la humedad es 75% → (85-75) × 2 = 20% de pérdida

**3. Riesgo de Especies (%):**
```
Riesgo_Especies = (Estrés_Temperatura + Pérdida_Humedad) ÷ 2
```
- **Explicación**: Promedio de los dos factores anteriores
- **Ejemplo**: (30 + 20) ÷ 2 = 25% de riesgo

#### ¿Por qué usamos min() y max() aquí?
- **min(100, …)**: asegura que el porcentaje nunca pase de 100%.
- **max(0, …)**: evita valores negativos cuando la temperatura es baja o la humedad ya es alta.

#### Ejemplos rápidos
- Si Temperatura_Promedio = 12°C → (12-15)×10 = -30 → max(0, -30) = 0% (sin estrés por frío).
- Si Humedad_Promedio = 92% → (85-92)×2 = -14 → max(0, -14) = 0% (no hay pérdida por exceso de humedad).
- Si Estrés_Temperatura = 40% y Pérdida_Humedad = 0% → Riesgo_Especies = (40+0)/2 = 20%.

---

### 🌊 **REGIÓN CARIBE - Blanqueamiento de Corales**

Los corales son muy sensibles a los cambios de temperatura del agua marina.

#### Fórmulas Utilizadas:

**1. Riesgo de Coral (%):**
```
Riesgo_Coral = min(100, max(0, (Temperatura_Promedio - 28) × 15))
```
- **Explicación**: Los corales empiezan a estresarse a partir de 28°C
- **Ejemplo**: Si la temperatura es 30°C → (30-28) × 15 = 30% de riesgo

**2. Coral Saludable (%):**
```
Coral_Saludable = max(0, 100 - Riesgo_Coral - 25)
```
- **Explicación**: Se resta el riesgo calculado y un 25% base de mortalidad natural

**3. Coral Estresado (%):**
```
Coral_Estresado = min(50, Riesgo_Coral)
```
- **Explicación**: Máximo 50% puede estar estresado al mismo tiempo

**4. Coral Muerto (%):**
```
Coral_Muerto = min(25, Riesgo_Coral × 0.3)
```
- **Explicación**: El 30% del riesgo se convierte en mortalidad

#### ¿Por qué usamos min() y max() aquí?
- **Riesgo_Coral** usa min(100, max(0, …)) para limitar el porcentaje entre 0% y 100%.
- **Coral_Saludable** usa max(0, …) para evitar valores negativos cuando el riesgo y el 25% base superan 100.
- **Coral_Estresado** usa min(50, …) porque, aun con alto riesgo, no todo el coral está simultáneamente estresado.
- **Coral_Muerto** usa min(25, …) porque la mortalidad no crece indefinidamente con el riesgo en el corto plazo.

#### Ejemplos rápidos
- Temperatura_Promedio = 27°C → (27-28)×15 = -15 → Riesgo_Coral = 0% (no hay estrés por frío).
- Temperatura_Promedio = 30°C → (30-28)×15 = 30 → Coral_Estresado = min(50, 30) = 30%.
- Con Riesgo_Coral = 30% → Coral_Muerto = min(25, 30×0.3) = min(25, 9) = 9%.
- Con Riesgo_Coral = 80% → Coral_Saludable = max(0, 100 - 80 - 25) = max(0, -5) = 0%.

---

### 🌧️ **REGIÓN PACÍFICA - Alteración de Ciclos Hídricos**

Las lluvias excesivas pueden causar erosión y afectar los anfibios.

#### Fórmulas Utilizadas:

**1. Riesgo de Escorrentía (%):**
```
Riesgo_Escorrentía = min(100, max(0, Precipitación_Promedio × 3))
```
- **Explicación**: Cada mm de lluvia multiplica el riesgo por 3
- **Ejemplo**: Si llueve 10 mm/día → 10 × 3 = 30% de riesgo

**2. Escorrentía Normal (%):**
```
Escorrentía_Normal = max(0, 100 - Riesgo_Escorrentía)
```
- **Explicación**: Lo que queda después de restar el riesgo

**3. Escorrentía Alta (%):**
```
Escorrentía_Alta = min(60, Riesgo_Escorrentía)
```
- **Explicación**: Máximo 60% puede tener escorrentía alta

**4. Erosión del Suelo (%):**
```
Erosión_Suelo = min(40, Riesgo_Escorrentía × 0.5)
```
- **Explicación**: La mitad del riesgo se convierte en erosión

#### ¿Por qué usamos min() y max() aquí?
- **Riesgo_Escorrentía** con min(100, max(0, …)) evita riesgos negativos (lluvia 0) o >100.
- **Escorrentía_Normal = max(0, 100 - Riesgo)** evita porcentajes negativos si el riesgo supera 100 (antes de min).
- **Escorrentía_Alta = min(60, Riesgo)** limita la fracción de eventos realmente altos.
- **Erosión_Suelo = min(40, Riesgo×0.5)** limita la erosión a un tope razonable en el corto plazo.

#### Ejemplos rápidos
- Precipitación_Promedio = 10 mm/día → Riesgo = 10×3 = 30%.
  - Escorrentía_Normal = 100 - 30 = 70%.
  - Escorrentía_Alta = min(60, 30) = 30%.
  - Erosión_Suelo = min(40, 30×0.5=15) = 15%.
- Precipitación_Promedio = 0 mm/día → Riesgo = 0 → Normal = 100%, Alta = 0%, Erosión = 0%.

---

### 🔥 **REGIÓN AMAZÓNICA - Riesgo de Incendios Forestales**

Los incendios dependen de la temperatura, humedad y viento.

#### Fórmulas Utilizadas:

**1. Riesgo de Incendio (%):**
```
Riesgo_Incendio = min(100, max(0, (70 - Humedad_Promedio) + (Viento_Promedio - 10) × 2 + (Temperatura_Promedio - 25) × 3))
```

**Desglosando la fórmula:**
- **Factor Humedad**: (70 - Humedad) → Menos humedad = más riesgo
- **Factor Viento**: (Viento - 10) × 2 → Viento fuerte multiplica el riesgo
- **Factor Temperatura**: (Temperatura - 25) × 3 → Calor excesivo triplica el riesgo

**Ejemplo de cálculo:**
- Humedad: 60%, Viento: 15 km/h, Temperatura: 30°C
- Riesgo = (70-60) + (15-10)×2 + (30-25)×3
- Riesgo = 10 + 10 + 15 = 35% de riesgo de incendio

#### ¿Por qué usamos min() y max() aquí?
- **max(0, …)** evita riesgos negativos cuando hay alta humedad, poco viento o baja temperatura.
- **min(100, …)** limita el resultado a 100% cuando las condiciones son extremas.

#### Ejemplos rápidos
- (Humedad=85%, Viento=5, Temp=20) → (70-85)+(-10)+(-15) = -40 → max(0, -40)=0%.
- (Humedad=20%, Viento=35, Temp=40) → 50 + 50 + 45 = 145 → min(100, 145)=100%.

---

### 🌾 **ORINOQUÍA - Degradación del Suelo**

La salud del suelo depende de la humedad y la precipitación.

#### Fórmulas Utilizadas:

**1. Humedad del Suelo (%):**
```
Humedad_Suelo = min(100, max(0, Humedad_Promedio × 0.8 + Precipitación_Promedio × 5))
```
- **Explicación**: La humedad del aire aporta 80% y cada mm de lluvia aporta 5 puntos

**2. Fertilidad (%):**
```
Fertilidad = min(100, max(0, Humedad_Suelo × 0.9))
```
- **Explicación**: La fertilidad es el 90% de la humedad del suelo

**3. Erosión (%):**
```
Erosión = min(100, max(0, (100 - Humedad_Suelo) × 0.7))
```
- **Explicación**: La falta de humedad se convierte en erosión (70% del déficit)

**4. Productividad (%):**
```
Productividad = min(100, max(0, (Humedad_Suelo + Fertilidad) ÷ 2 - Erosión × 0.3))
```
- **Explicación**: Promedio de humedad y fertilidad, menos el 30% de la erosión

#### ¿Por qué usamos min() y max() aquí?
- **Humedad_Suelo = min(100, max(0, Humedad×0.8 + Lluvia×5))**: las sumas ponderadas pueden salir de 0–100; se acota.
- **Fertilidad = min(100, max(0, Humedad_Suelo×0.9))**: sigue el límite de la humedad del suelo.
- **Erosión = min(100, max(0, (100 - Humedad_Suelo)×0.7))**: el déficit de humedad genera erosión pero se limita.
- **Productividad** se acota para mantenerse en 0–100 y restar un efecto parcial de la erosión.

#### Ejemplos rápidos
- Humedad_Prom=60%, Lluvia_Prom=2 → Humedad_Suelo = 60×0.8 + 2×5 = 48 + 10 = 58%.
  - Fertilidad = 58×0.9 = 52.2% → 52% (aprox.).
  - Erosión = (100-58)×0.7 = 42×0.7 = 29.4% → 29% (aprox.).
  - Productividad = ((58+52)/2) - 29×0.3 = 55 - 8.7 ≈ 46%.
- Si Humedad_Prom=95% y Lluvia=10 → Humedad_Suelo teórica >100 → min(100, …) = 100%.

---

## 🎯 Cálculo del Nivel de Riesgo

Nuestro sistema calcula automáticamente el nivel de riesgo para cada región:

### Sistema de Puntuación:

```
Puntuación_Riesgo = 0

// Factor Temperatura
Si Temperatura > 30°C → +3 puntos
Si Temperatura > 25°C → +2 puntos  
Si Temperatura > 20°C → +1 punto

// Factor Humedad
Si Humedad < 60% → +2 puntos
Si Humedad > 90% → +1 punto

// Factor Precipitación
Si Precipitación > 15 mm/día → +2 puntos
Si Precipitación < 2 mm/día → +2 puntos

// Factor Viento
Si Viento > 20 km/h → +1 punto
```

### Clasificación del Riesgo:
- **🟢 Riesgo Bajo**: 0-2 puntos
- **🟡 Riesgo Medio**: 3-5 puntos  
- **🔴 Riesgo Alto**: 6+ puntos

#### ¿Cómo interpretar y calcular? (ejemplo)
- Datos: Temperatura=29°C (+2), Humedad=55% (+2), Precipitación=1.5 mm/día (+2), Viento=18 km/h (+0)
- Puntuación total = 2 + 2 + 2 + 0 = 6 → **Riesgo Alto**.
- Si la precipitación fuera 6 mm/día (0 pts) y humedad 70% (0 pts) → 2 + 0 + 0 + 0 = 2 → **Riesgo Bajo**.

---

## 🌡️ Detección de Fenómenos ENSO

El sistema identifica si estamos en período de El Niño, La Niña o condiciones normales:

### Valores Base por Región:
| Región | Temperatura Base | Precipitación Base |
|--------|------------------|-------------------|
| Andes | 17°C | 5 mm/día |
| Caribe | 31°C | 2 mm/día |
| Pacífico | 26°C | 15 mm/día |
| Amazonía | 28°C | 8 mm/día |
| Orinoquía | 27°C | 3 mm/día |

### Cálculos de Anomalías:
```
Anomalía_Temperatura = Temperatura_Actual - Temperatura_Base
Anomalía_Precipitación = Precipitación_Actual - Precipitación_Base
```

### Clasificación ENSO:
- **🔥 El Niño**: Anomalía_Temperatura > +2°C Y Anomalía_Precipitación < -2mm
- **❄️ La Niña**: Anomalía_Temperatura < -1°C Y Anomalía_Precipitación > +3mm  
- **⚖️ Neutral**: Cualquier otra combinación

#### Ejemplo de cálculo de anomalías
- Región: Andes (base: 17°C y 5 mm/día)
- Medidos: Temperatura=20°C, Precipitación=2 mm/día
- Anomalía_T = 20 - 17 = +3°C; Anomalía_P = 2 - 5 = -3 mm/día → **El Niño** (más calor y menos lluvia).

---

## 📈 Cómo se Calculan los Promedios

Para obtener valores representativos, calculamos promedios de todos los datos:

### Fórmula General de Promedio:
```
Promedio = (Valor₁ + Valor₂ + Valor₃ + ... + ValorN) ÷ N
```

**Donde N es el número total de días con datos**

### Ejemplo Práctico:
Si tenemos datos de temperatura para 5 días: [25°C, 27°C, 24°C, 26°C, 28°C]

```
Temperatura_Promedio = (25 + 27 + 24 + 26 + 28) ÷ 5 = 130 ÷ 5 = 26°C
```

---

## 🎨 Tipos de Gráficos por Región

Cada región utiliza un tipo de gráfico diferente para mostrar mejor sus datos:

- **🏔️ Andes**: Gráfico de Barras - Compara diferentes tipos de estrés
- **🌊 Caribe**: Gráfico Circular - Muestra la distribución del estado de los corales
- **🌧️ Pacífico**: Gráfico de Donut - Visualiza los ciclos hídricos
- **🔥 Amazonía**: Gráfico de Líneas - Muestra la tendencia del riesgo de incendios
- **🌾 Orinoquía**: Gráfico Radar - Compara múltiples factores del suelo

---

## 🔬 Validación de Resultados

### Rangos Válidos:
- **Temperatura**: -10°C a 50°C
- **Humedad**: 0% a 100%
- **Velocidad del Viento**: 0 a 200 km/h
- **Precipitación**: 0 a 500 mm/día

### Funciones de Validación:
```
min(100, max(0, valor))
```
Esta función asegura que todos los porcentajes estén entre 0% y 100%.

---

## 📚 Fuentes de Información

1. **NASA POWER**: Datos satelitales de clima global
2. **IDEAM**: Instituto de Hidrología, Meteorología y Estudios Ambientales de Colombia
3. **Literatura Científica**: Estudios sobre puntos de estrés de cada ecosistema

---

## 🎓 Conclusión

Este proyecto demuestra cómo las matemáticas y la programación pueden ayudarnos a entender problemas ambientales complejos. Cada fórmula tiene una base científica y nos permite convertir datos climáticos en información útil para la conservación de la biodiversidad colombiana.

### Aprendizajes Clave:
- Los ecosistemas tienen límites específicos de tolerancia climática
- Las matemáticas nos ayudan a cuantificar el riesgo ambiental
- Los datos satelitales nos permiten monitorear el planeta en tiempo real
- La programación facilita el análisis de grandes cantidades de información

---
