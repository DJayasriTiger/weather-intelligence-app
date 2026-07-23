export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string; // State or province
  timezone?: string;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
  is_day?: number;
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation: number[];
  weathercode: number[];
  windspeed_10m: number[];
  uv_index: number[];
}

export interface WeatherData {
  location: GeoLocation;
  current_weather: CurrentWeather;
  daily: DailyForecast;
  hourly?: HourlyForecast;
  elevation?: number;
}

export type TempUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kmh' | 'mph';

export interface WeatherConditionInfo {
  label: string;
  iconName: string;
  bgGradient: string;
  accentColor: string;
  description: string;
}

export interface SmartRecommendation {
  id: string;
  category: 'clothing' | 'outdoor' | 'health' | 'wind' | 'rain' | 'sun';
  title: string;
  description: string;
  severity: 'normal' | 'info' | 'warning' | 'alert' | 'success';
  icon: string;
}
