import React, { useState, useEffect, useCallback } from 'react';
import { GeoLocation, WeatherData, TempUnit, WindUnit } from './types/weather';
import { getWeatherForCityName, fetchForecast } from './services/weatherApi';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { SmartRecommendations } from './components/SmartRecommendations';
import { ForecastSection } from './components/ForecastSection';
import { ErrorCard } from './components/ErrorCard';
import { SkeletonLoader } from './components/SkeletonLoader';
import { CloudSun, Info, ShieldCheck } from 'lucide-react';

export default function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Unit settings
  const [tempUnit, setTempUnit] = useState<TempUnit>('celsius');
  const [windUnit, setWindUnit] = useState<WindUnit>('kmh');

  // Load weather for a given city name
  const loadWeatherByName = useCallback(async (cityName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherForCityName(cityName);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Error in search:', err);
      if (err.message === 'CITY_NOT_FOUND') {
        setError('City not found. Please check the spelling and try again.');
      } else {
        setError('City not found. Please check the spelling and try again.');
      }
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load weather for a specific GeoLocation item
  const handleSelectLocation = async (location: GeoLocation) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchForecast(location);
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching selected location:', err);
      setError('City not found. Please check the spelling and try again.');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial default city search on load ("Chennai")
  useEffect(() => {
    loadWeatherByName('Chennai');
  }, [loadWeatherByName]);

  // Refresh current data
  const handleRefresh = async () => {
    if (!weatherData) return;
    setIsRefreshing(true);
    try {
      const updated = await fetchForecast(weatherData.location);
      setWeatherData(updated);
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      {/* Atmospheric Background Glows from Immersive UI */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header & Search Bar */}
      <Header
        onSelectCity={handleSelectLocation}
        onSearchSubmit={loadWeatherByName}
        isLoading={isLoading}
        tempUnit={tempUnit}
        windUnit={windUnit}
        onToggleTempUnit={setTempUnit}
        onToggleWindUnit={setWindUnit}
        currentCityName={weatherData?.location.name}
      />

      {/* Main Content Stage */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Loading Skeleton */}
        {isLoading && <SkeletonLoader />}

        {/* Error Card */}
        {!isLoading && error && (
          <ErrorCard
            message={error}
            onRetry={() => loadWeatherByName('Chennai')}
            onQuickSearch={loadWeatherByName}
          />
        )}

        {/* Weather Data Display */}
        {!isLoading && !error && weatherData && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Current Weather Hero Card */}
            <CurrentWeatherCard
              data={weatherData}
              tempUnit={tempUnit}
              windUnit={windUnit}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />

            {/* Smart Planning Recommendations */}
            <SmartRecommendations data={weatherData} />

            {/* 7-Day Forecast & Interactive Charts */}
            <ForecastSection data={weatherData} tempUnit={tempUnit} />

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 bg-slate-950/40 border-t border-white/5 py-4 text-xs text-slate-500 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Open-Meteo API Connected</span>
            <span className="text-slate-600">•</span>
            <span className="font-medium text-slate-400">Precision Weather OS</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              Live Telemetry & Geocoding
            </span>
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              Auto-TZ Sync
            </span>
            <span className="text-slate-600">v2.4.0</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
