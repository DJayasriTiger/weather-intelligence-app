import React from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, Info, Lightbulb } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { generateSmartRecommendations } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface SmartRecommendationsProps {
  data: WeatherData;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ data }) => {
  const recommendations = generateSmartRecommendations(data);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'alert':
        return {
          cardBg: 'bg-rose-500/10 border-rose-500/30 text-rose-200',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          iconColor: 'text-rose-400',
          label: 'Weather Alert',
        };
      case 'warning':
        return {
          cardBg: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          iconColor: 'text-amber-400',
          label: 'Advisory',
        };
      case 'success':
        return {
          cardBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          iconColor: 'text-emerald-400',
          label: 'Optimal Conditions',
        };
      default:
        return {
          cardBg: 'bg-sky-500/10 border-sky-500/30 text-sky-200',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          iconColor: 'text-sky-400',
          label: 'Planning Insight',
        };
    }
  };

  return (
    <section className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 shrink-0">
            <Lightbulb className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Smart Planning Recommendations
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                AI Weather Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Actionable dress code, activity safety, and preparation tips based on live telemetry
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => {
          const style = getSeverityStyle(rec.severity);
          return (
            <div
              key={rec.id}
              className={`rounded-2xl p-4 border transition-all hover:border-white/20 flex flex-col justify-between backdrop-blur-md ${style.cardBg}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style.badgeBg}`}
                  >
                    {rec.severity === 'alert' && <ShieldAlert className="w-3 h-3 mr-1" />}
                    {rec.severity === 'success' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {rec.severity === 'info' && <Info className="w-3 h-3 mr-1" />}
                    {style.label}
                  </span>
                </div>

                <div className="flex items-start gap-3 mt-2">
                  <div className={`p-2 rounded-xl bg-slate-900/60 border border-white/10 ${style.iconColor} shrink-0`}>
                    <WeatherIcon name={rec.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed font-medium">
                      "{rec.description}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Specific mandatory guidelines callouts */}
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Category: <strong className="text-slate-200 capitalize">{rec.category}</strong></span>
                <span className="text-sky-400 font-semibold">Active Advice</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
