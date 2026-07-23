import React, { useState } from 'react';
import {
  Calendar,
  TrendingUp,
  BarChart3,
  Clock,
  Droplets,
  ArrowUp,
  ArrowDown,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { WeatherData, TempUnit } from '../types/weather';
import {
  getWeatherCondition,
  formatTemp,
  formatDayName,
  formatDateShort,
  convertTemp,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface ForecastSectionProps {
  data: WeatherData;
  tempUnit: TempUnit;
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({ data, tempUnit }) => {
  const { daily, hourly } = data;
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'temp-chart' | 'precip-chart' | 'hourly-chart'>('temp-chart');

  // Prepare 7-day forecast dataset for recharts
  const dailyChartData = daily.time.map((timeStr, idx) => {
    const maxC = daily.temperature_2m_max[idx];
    const minC = daily.temperature_2m_min[idx];
    const precip = daily.precipitation_sum[idx] ?? 0;
    const code = daily.weathercode[idx];

    return {
      dayName: formatDayName(timeStr, idx),
      dateShort: formatDateShort(timeStr),
      maxTemp: convertTemp(maxC, tempUnit),
      minTemp: convertTemp(minC, tempUnit),
      precip: Math.round(precip * 10) / 10,
      weatherCode: code,
      rawDate: timeStr,
      isDaySelected: idx === selectedDayIndex,
    };
  });

  // Prepare 24-hour hourly dataset for selected day (24 hours window)
  const hourlyChartData = React.useMemo(() => {
    if (!hourly || !hourly.time) return [];
    
    // Calculate start index for selected day (each day has 24 hours)
    const startIndex = selectedDayIndex * 24;
    const endIndex = Math.min(startIndex + 24, hourly.time.length);
    
    return hourly.time.slice(startIndex, endIndex).map((tStr, i) => {
      const absoluteIdx = startIndex + i;
      const hourStr = new Date(tStr).toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true,
      });
      
      const tempC = hourly.temperature_2m[absoluteIdx] ?? 0;
      const humidity = hourly.relative_humidity_2m?.[absoluteIdx] ?? 0;
      const precip = hourly.precipitation?.[absoluteIdx] ?? 0;

      return {
        timeLabel: hourStr,
        temp: convertTemp(tempC, tempUnit),
        humidity,
        precip,
      };
    });
  }, [hourly, selectedDayIndex, tempUnit]);

  return (
    <section className="space-y-6">
      
      {/* 7-Day Forecast Grid */}
      <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                7-Day Weather Forecast
              </h3>
              <p className="text-xs text-slate-400">
                Daily max/min temperatures, weather conditions, and total rainfall
              </p>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto font-medium">
            Select a day card to inspect hourly curves
          </div>
        </div>

        {/* 7 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {dailyChartData.map((dayItem, idx) => {
            const condition = getWeatherCondition(dayItem.weatherCode, 1);
            const isSelected = idx === selectedDayIndex;

            return (
              <button
                key={dayItem.rawDate}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-sky-500/20 border-sky-400/80 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400/50'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-sky-400' : 'text-slate-200'}`}>
                      {dayItem.dayName}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {dayItem.dateShort}
                    </span>
                  </div>

                  <div className="my-3 flex items-center justify-center py-2 bg-white/5 rounded-xl border border-white/5 group-hover:scale-105 transition-transform">
                    <WeatherIcon name={condition.iconName} className={`w-8 h-8 ${condition.accentColor}`} />
                  </div>

                  <p className="text-[11px] font-medium text-center text-slate-300 truncate" title={condition.label}>
                    {condition.label}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-0.5">
                      <ArrowUp className="w-3 h-3 text-rose-400" />
                      {dayItem.maxTemp}°
                    </span>
                    <span className="text-slate-400 flex items-center gap-0.5 font-medium">
                      <ArrowDown className="w-3 h-3 text-sky-400" />
                      {dayItem.minTemp}°
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-sky-400" />
                      Precip
                    </span>
                    <span className="font-medium text-sky-300">
                      {dayItem.precip} mm
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Forecast Trends & Interactive Charts Section */}
      <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Header with View Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Visual Weather Analytics & Trends
              </h3>
              <p className="text-xs text-slate-400">
                Interactive curves comparing 7-day temperature shifts and rainfall profiles
              </p>
            </div>
          </div>

          {/* Chart View Switcher Tabs */}
          <div className="flex items-center p-1 bg-slate-900 border border-white/10 rounded-2xl text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('temp-chart')}
              className={`px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'temp-chart'
                  ? 'bg-sky-500 text-white shadow shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>7-Day Temp</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('precip-chart')}
              className={`px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'precip-chart'
                  ? 'bg-sky-500 text-white shadow shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Rainfall Sum</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hourly-chart')}
              className={`px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'hourly-chart'
                  ? 'bg-sky-500 text-white shadow shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>24h Intraday ({dailyChartData[selectedDayIndex]?.dayName || 'Selected'})</span>
            </button>
          </div>
        </div>

        {/* Chart Render Container */}
        <div className="h-72 w-full pt-2">
          {activeTab === 'temp-chart' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="maxTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="minTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit={`°${tempUnit === 'fahrenheit' ? 'F' : 'C'}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any, name: any) => [
                    `${value}°${tempUnit === 'fahrenheit' ? 'F' : 'C'}`,
                    name === 'maxTemp' ? 'Max Temp' : 'Min Temp',
                  ]}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="maxTemp"
                  name="Max Temp"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#maxTempGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="minTemp"
                  name="Min Temp"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#minTempGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'precip-chart' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit=" mm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any) => [`${value} mm`, 'Precipitation Sum']}
                />
                <Bar dataKey="precip" name="Precipitation (mm)" fill="#0284c7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'hourly-chart' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hourlyTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} interval={2} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit={`°${tempUnit === 'fahrenheit' ? 'F' : 'C'}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(value: any) => [`${value}°${tempUnit === 'fahrenheit' ? 'F' : 'C'}`, 'Temperature']}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  name="Temperature"
                  stroke="#818cf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#hourlyTempGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

    </section>
  );
};
