"use client"

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Components
import { Header } from '@/components/layout/Header';
import { LocationSelector } from '@/components/ui/LocationSelector';
import { DateRangeSelector } from '@/components/ui/DateRangeSelector';
import { TabNavigation } from '@/components/ui/TabNavigation';
import { DashboardTab } from '@/components/dashboard/DashboardTab';
import { ImpactsChart } from '@/components/impacts/ImpactsChart';
import { ActionTab } from '@/components/action/ActionTab';
import { TimeSeriesTab } from '@/components/charts/TimeSeriesTab';
import { DataSourceIndicator } from '@/components/layout/DataSourceIndicator';

// Hooks
import { useClimateData } from '@/hooks/useClimateData';

// Utils
import { getDefaultStartDate, getDefaultEndDate } from '@/utils/dateUtils';

// Create a client
const queryClient = new QueryClient();

// Tab configuration
const TABS = [
  { id: 'dashboard', label: 'Mi Dashboard' },
  { id: 'timeSeries', label: '📊 Series Temporales' },
  { id: 'impacts', label: 'Impactos en Biodiversidad' },
  { id: 'action', label: '¡Actúa Ahora!' }
];

// Main App Component
function ClimateApp() {
  const [selectedLocation, setSelectedLocation] = useState('andes');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());

  // Use the climate data hook
  const { data, timeSeriesData, isLoading, error, isStaticData } = useClimateData({
    location: selectedLocation,
    startDate,
    endDate,
    useStaticData: false // Set to true to force static data
  });

  // Render content based on active tab
  const renderTabContent = () => {
    if (!data) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay datos disponibles para la región seleccionada.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab data={data} isLoading={isLoading} />;
      case 'timeSeries':
        return <TimeSeriesTab data={timeSeriesData || []} isLoading={isLoading} />;
      case 'impacts':
        return <ImpactsChart data={data} isLoading={isLoading} region={selectedLocation} />;
      case 'action':
        return <ActionTab data={data} isLoading={isLoading} region={selectedLocation} />;
      default:
        return <DashboardTab data={data} isLoading={isLoading} />;
    }
  };

  return (
    <div className="text-gray-800 font-inter bg-[#F9F9F7] min-h-screen overflow-x-hidden">
      <div className="container mx-auto max-w-7xl">
        <Header />

        {/* Location and Date Selectors */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-8 mx-5">
          <LocationSelector
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />

          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          <DataSourceIndicator
            isStaticData={isStaticData}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-8 mx-5"
        />

        {/* Content Area */}
        <main id="content-area" className="bg-white p-4 rounded-xl shadow-md mx-5">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

// Wrapper component with QueryClientProvider
export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClimateApp />
    </QueryClientProvider>
  );
}