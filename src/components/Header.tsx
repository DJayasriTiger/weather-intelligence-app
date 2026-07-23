import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Sparkles, Loader2, X, Compass, History } from 'lucide-react';
import { GeoLocation, TempUnit, WindUnit } from '../types/weather';
import { searchCities } from '../services/weatherApi';

interface HeaderProps {
  onSelectCity: (location: GeoLocation) => void;
  onSearchSubmit: (cityName: string) => void;
  isLoading: boolean;
  tempUnit: TempUnit;
  windUnit: WindUnit;
  onToggleTempUnit: (unit: TempUnit) => void;
  onToggleWindUnit: (unit: WindUnit) => void;
  currentCityName?: string;
}

const PRESET_CITIES = [
  { name: 'Chennai', country: 'India' },
  { name: 'Tokyo', country: 'Japan' },
  { name: 'New York', country: 'USA' },
  { name: 'London', country: 'UK' },
  { name: 'Paris', country: 'France' },
  { name: 'Sydney', country: 'Australia' },
];

export const Header: React.FC<HeaderProps> = ({
  onSelectCity,
  onSearchSubmit,
  isLoading,
  tempUnit,
  windUnit,
  onToggleTempUnit,
  onToggleWindUnit,
  currentCityName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('weather_search_history');
      return saved ? JSON.parse(saved) : ['Chennai', 'Tokyo', 'London'];
    } catch {
      return ['Chennai', 'Tokyo', 'London'];
    }
  });

  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search for suggestions as user types
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearchingSuggestions(false);
      return;
    }

    setIsSearchingSuggestions(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed);
        setSuggestions(results);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside listener to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    // Save to search history
    const trimmed = searchTerm.trim();
    updateHistory(trimmed);
    
    onSearchSubmit(trimmed);
    setShowDropdown(false);
  };

  const handleSelectSuggestion = (location: GeoLocation) => {
    setSearchTerm(`${location.name}${location.country ? `, ${location.country}` : ''}`);
    updateHistory(location.name);
    onSelectCity(location);
    setShowDropdown(false);
  };

  const updateHistory = (city: string) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== city.toLowerCase());
      const next = [city, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('weather_search_history', JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/30 backdrop-blur-xl border-b border-white/5 text-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onSearchSubmit('Chennai')}>
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight">
                    WEATHER<span className="text-sky-400">INTEL</span>
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
                    <Sparkles className="w-2.5 h-2.5 mr-1" />
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] hidden sm:block">
                  Precision Weather OS
                </p>
              </div>
            </div>

            {/* Mobile Units Selector Toggle */}
            <div className="flex items-center gap-1 sm:hidden">
              <button
                type="button"
                onClick={() => onToggleTempUnit(tempUnit === 'celsius' ? 'fahrenheit' : 'celsius')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-sky-400"
              >
                °{tempUnit === 'celsius' ? 'C' : 'F'}
              </button>
            </div>
          </div>

          {/* Search Bar & Auto-suggestions */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={handleFormSubmit} className="relative flex items-center">
              <div className="relative w-full group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center bg-slate-900/90 border border-white/10 rounded-xl pl-3.5 pr-24 py-2 w-full">
                  <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search city (e.g., Chennai, Tokyo, New York)..."
                    className="w-full bg-transparent border-none text-sm focus:ring-0 text-slate-200 placeholder-slate-500 outline-none"
                  />
                  
                  {/* Clear search button */}
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setSuggestions([]);
                      }}
                      className="absolute right-20 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Submit Search Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-1 top-1 bottom-1 px-3.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-medium transition-all shadow-lg shadow-sky-500/20 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Search</span>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Suggestions & History Dropdown */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl divide-y divide-white/5">
                {isSearchingSuggestions ? (
                  <div className="px-4 py-3 flex items-center gap-2 text-xs text-slate-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                    Searching cities...
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="py-1">
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      Search Results
                    </div>
                    {suggestions.map((loc) => (
                      <button
                        key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                        type="button"
                        onClick={() => handleSelectSuggestion(loc)}
                        className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-white/5 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                          <span className="font-medium text-slate-200 group-hover:text-white">
                            {loc.name}
                          </span>
                          {loc.admin1 && (
                            <span className="text-slate-400 text-[11px] font-normal">
                              {loc.admin1}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          {loc.country}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : searchTerm.trim().length >= 2 ? (
                  <div className="px-4 py-3 text-xs text-slate-400">
                    No matching cities found. Press enter to search anyway.
                  </div>
                ) : null}

                {/* Recent search history */}
                {searchHistory.length > 0 && (
                  <div className="py-2 px-3 bg-slate-950/40">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      <History className="w-3 h-3 text-slate-500" />
                      Recent Searches
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {searchHistory.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setSearchTerm(city);
                            onSearchSubmit(city);
                            setShowDropdown(false);
                          }}
                          className="px-2.5 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preset Cities Chips & Unit Controls (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Temperature & Wind Unit Toggles */}
            <div className="flex items-center bg-slate-900 border border-white/10 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => onToggleTempUnit('celsius')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  tempUnit === 'celsius'
                    ? 'bg-sky-500 text-white shadow shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => onToggleTempUnit('fahrenheit')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  tempUnit === 'fahrenheit'
                    ? 'bg-sky-500 text-white shadow shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °F
              </button>
            </div>

            <div className="flex items-center bg-slate-900 border border-white/10 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => onToggleWindUnit('kmh')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  windUnit === 'kmh'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                km/h
              </button>
              <button
                type="button"
                onClick={() => onToggleWindUnit('mph')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  windUnit === 'mph'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                mph
              </button>
            </div>
          </div>
        </div>

        {/* Quick Popular Cities Bar */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap uppercase tracking-widest">
            POPULAR CITIES:
          </span>
          <div className="flex items-center gap-1.5">
            {PRESET_CITIES.map((city) => {
              const isCurrent = currentCityName?.toLowerCase() === city.name.toLowerCase();
              return (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => onSearchSubmit(city.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                    isCurrent
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-sm'
                      : 'bg-white/[0.03] hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                  }`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
