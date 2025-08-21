# Eco-Colombia Insights - Climate App

A Next.js application that provides climate insights for Colombia using NASA POWER API data with clean architecture principles.

## 🏗️ Architecture Overview

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── app/                    # Next.js App Router
├── components/             # UI Components (Presentation Layer)
│   ├── ui/                # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   ├── impacts/           # Impact analysis components
│   ├── action/            # Action tab components
│   └── layout/            # Layout components
├── hooks/                 # Custom React hooks (Application Layer)
├── services/              # External services (Infrastructure Layer)
│   └── api/              # API services
├── types/                 # TypeScript type definitions
├── constants/             # Application constants
└── utils/                 # Utility functions
```

## 🚀 Features

- **Real-time Climate Data**: Integration with NASA POWER API
- **Regional Analysis**: Climate data for 5 Colombian regions
- **Interactive Dashboard**: Temperature, humidity, wind, and precipitation data
- **Impact Analysis**: Biodiversity impact charts and analysis
- **Action Recommendations**: Personalized eco-tips and actions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Charts**: Chart.js
- **Date Handling**: date-fns
- **API**: NASA POWER API

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd climate-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏛️ Clean Architecture Implementation

### 1. **Domain Layer** (`types/`)
- Contains business entities and interfaces
- Defines data structures for climate data, API responses, and application state

### 2. **Application Layer** (`hooks/`)
- Custom React hooks for data management
- Business logic and state management
- Integration between UI and data services

### 3. **Infrastructure Layer** (`services/`)
- External API integrations (NASA POWER API)
- Data fetching and processing
- Error handling and data transformation

### 4. **Presentation Layer** (`components/`)
- Reusable UI components
- Page-specific components
- Layout and navigation components

## 🔌 NASA POWER API Integration

The application integrates with NASA's POWER (Prediction Of Worldwide Energy Resources) API to fetch real-time climate data:

- **Base URL**: `https://power.larc.nasa.gov/api/temporal/daily/regional`
- **Parameters**: Temperature (T2M_MAX), Humidity (RH2M), Wind Speed (WS2M), Precipitation (PRECTOTCORR)
- **Data Range**: 1981-2023 (historical data)
- **Fallback**: Static data when API is unavailable

### API Service Features:
- Automatic data conversion (Kelvin to Celsius, m/s to km/h)
- Error handling and retry logic
- Caching with React Query
- Data validation and processing

## 🗺️ Colombian Regions

The application covers 5 main Colombian regions:

1. **Región Andina** (Bogotá, Medellín) - Mountain ecosystems
2. **Región Caribe** (Cartagena, Barranquilla) - Coastal ecosystems
3. **Región Pacífica** (Quibdó, Buenaventura) - Rainforest ecosystems
4. **Región Amazónica** (Leticia, Mitú) - Amazon rainforest
5. **Orinoquía** (Villavicencio, Yopal) - Plains ecosystems

## 🎨 Component Structure

### UI Components (`components/ui/`)
- `LocationSelector`: Region selection dropdown
- `DateRangeSelector`: Date range picker with validation
- `TabNavigation`: Tab navigation component
- `ClimateCard`: Reusable climate data display card

### Feature Components
- `DashboardTab`: Main dashboard with climate metrics
- `ImpactsChart`: Biodiversity impact visualization
- `ActionTab`: Eco-action recommendations

### Layout Components
- `Header`: Application header
- `DataSourceIndicator`: Shows data source status

## 🔄 Data Flow

1. **User Interaction** → Component triggers state change
2. **Hook Layer** → `useClimateData` manages data fetching
3. **Service Layer** → `nasaPowerService` calls NASA API
4. **Data Processing** → Raw API data converted to application format
5. **UI Update** → Components re-render with new data

## 🎯 Key Features

### Real-time Data Integration
- Automatic API calls when location or date range changes
- Intelligent caching to reduce API calls
- Graceful fallback to static data on API errors

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface

### Performance Optimization
- React Query for efficient data caching
- Component memoization where appropriate
- Lazy loading of chart components

## 🚀 Deployment

The application is ready for deployment on Vercel, Netlify, or any Next.js-compatible platform:

```bash
npm run build
npm start
```

## 📝 Environment Variables

No environment variables are required for basic functionality. The NASA POWER API is publicly accessible.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the clean architecture principles
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **NASA POWER Project** for providing climate data
- **Next.js Team** for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework
- **Chart.js** for data visualization capabilities
