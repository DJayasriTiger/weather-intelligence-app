import React from 'react';
import { AlertTriangle, Search, RefreshCw, Compass } from 'lucide-react';

interface ErrorCardProps {
  message?: string;
  onRetry?: () => void;
  onQuickSearch?: (cityName: string) => void;
}

const POPULAR_SUGGESTIONS = ['Chennai', 'Tokyo', 'London', 'New York', 'Paris', 'Sydney'];

export const ErrorCard: React.FC<ErrorCardProps> = ({
  message = 'City not found. Please check the spelling and try again.',
  onRetry,
  onQuickSearch,
}) => {
  return (
    <div className="bg-white/[0.03] border border-rose-500/30 backdrop-blur-xl rounded-3xl p-8 text-center max-w-xl mx-auto my-8 shadow-2xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4 animate-bounce">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight mb-2">
          Location Search Issue
        </h3>

        <p className="text-sm text-slate-300 max-w-md leading-relaxed mb-6 font-medium bg-white/5 p-3.5 rounded-xl border border-white/10">
          "{message}"
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Default Search</span>
            </button>
          )}
        </div>

        {/* Popular Cities Quick Suggestions */}
        {onQuickSearch && (
          <div className="w-full pt-4 border-t border-white/10">
            <p className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center justify-center gap-1">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              Try searching one of these popular cities instead:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_SUGGESTIONS.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => onQuickSearch(city)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium border border-white/10 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
