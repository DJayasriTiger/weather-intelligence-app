import React from 'react';
import { MapPin, Wind, Droplets, Thermometer, Sun, Compass, RefreshCw, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { WeatherData, TempUnit, WindUnit } from '../types/weather';
import {
  getWeatherCondition,
  formatTemp,
  formatWindSpeed,
  getWindDirectionLabel
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  data: WeatherData;
  tempUnit: TempUnit;
  windUnit: WindUnit;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  data,
  tempUnit,
  windUnit,
  onRefresh,
  isRefreshing = false,
}) => {
  const { location, current_weather, daily, hourly } = data;
  const condition = getWeatherCondition(current_weather.weathercode, current_weather.is_day ?? 1);

  // Get current hour index
  const currentHourIdx = new Date().getHours();
  const apparentTemp = hourly?.apparent_temperature?.[currentHourIdx] ?? current_weather.temperature;
  const humidity = hourly?.relative_humidity_2m?.[currentHourIdx] ?? 65;
  const uvIndex = hourly?.uv_index?.[currentHourIdx] ?? 0;

  // Max / Min for today
  const maxTempToday = daily.temperature_2m_max[0] ?? current_weather.temperature;
  const minTempToday = daily.temperature_2m_min[0] ?? current_weather.temperature;
  const precipToday = daily.precipitation_sum[0] ?? 0;

  const windDirLabel = getWindDirectionLabel(current_weather.winddirection);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 sm:p-8 text-slate-100 shadow-2xl transition-all duration-500">
      {/* Decorative background ambient glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        
        {/* Location Header & Refresh Action */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-1">
              <MapPin className="w-4 h-4 text-sky-400 animate-bounce" />
              <span>
                {location.name}
                {location.admin1 ? `, ${location.admin1}` : ''}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-wider border border-sky-500/20">
                Live
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {location.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{location.country}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-xs font-medium text-slate-200 border border-white/10 transition-all flex items-center gap-1.5"
                title="Refresh Weather Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Temperature & Visual Condition Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-6">
          
          {/* Temperature Big Display */}
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg flex items-center justify-center">
              <WeatherIcon name={condition.iconName} className="w-16 h-16 sm:w-20 sm:h-20 text-sky-400 drop-shadow-md animate-pulse" />
            </div>

            <div>
              <div className="flex items-baseline">
                <span className="text-6xl sm:text-7xl font-light tracking-tighter text-white drop-shadow-md">
                  {formatTemp(current_weather.temperature, tempUnit).replace(/°[CF]/, '')}°
                </span>
                <span className="text-3xl sm:text-4xl font-light text-slate-500 ml-1">
                  {tempUnit === 'fahrenheit' ? 'F' : 'C'}
                </span>
              </div>
              <p className="text-lg font-medium text-sky-300 mt-1 flex items-center gap-2">
                <span>{condition.label}</span>
              </p>
              <p className="text-xs text-slate-400 max-w-xs mt-0.5 line-clamp-2">
                {condition.description}
              </p>
            </div>
          </div>

          {/* Today's High/Low & Quick Snapshot */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <ArrowUp className="w-3.5 h-3.5 text-rose-400" /> High Today
              </span>
              <p className="text-2xl font-bold text-white">
                {formatTemp(maxTempToday, tempUnit)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5 text-sky-400" /> Low Today
              </span>
              <p className="text-2xl font-bold text-white">
                {formatTemp(minTempToday, tempUnit)}
              </p>
            </div>

            <div className="space-y-1 border-t border-white/5 pt-2">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Feels Like
              </span>
              <p className="text-lg font-semibold text-slate-200">
                {formatTemp(apparentTemp, tempUnit)}
              </p>
            </div>

            <div className="space-y-1 border-t border-white/5 pt-2">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-indigo-400" /> Precip Today
              </span>
              <p className="text-lg font-semibold text-slate-200">
                {precipToday} mm
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Footer Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/5">
          
          {/* Wind Speed */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-3.5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <Wind className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Wind Speed</p>
              <p className="text-sm font-medium text-white">{formatWindSpeed(current_weather.windspeed, windUnit)}</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Compass className="w-2.5 h-2.5 text-slate-500" /> {windDirLabel} ({current_weather.winddirection}°)
              </p>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-3.5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Humidity</p>
              <p className="text-sm font-medium text-white">{humidity}%</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {humidity > 70 ? 'High Moisture' : humidity < 30 ? 'Dry Air' : 'Comfortable'}
              </p>
            </div>
          </div>

          {/* UV Index */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-3.5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">UV Index</p>
              <p className="text-sm font-medium text-white">{uvIndex.toFixed(1)}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {uvIndex >= 6 ? 'High Exposure' : uvIndex >= 3 ? 'Moderate' : 'Low Exposure'}
              </p>
            </div>
          </div>

          {/* Coordinates / Time Zone */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-3.5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Geo Target</p>
              <p className="text-sm font-medium text-white truncate max-w-[120px]" title={`${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}°`}>
                {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                TZ: {location.timezone || 'Auto'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
