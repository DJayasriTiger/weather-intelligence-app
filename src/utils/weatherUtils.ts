import {
  WeatherConditionInfo,
  SmartRecommendation,
  TempUnit,
  WindUnit,
  WeatherData
} from '../types/weather';

/**
 * WMO Weather interpretation codes (WW)
 * https://open-meteo.com/en/docs
 */
export function getWeatherCondition(code: number, isDay: number = 1): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        iconName: isDay ? 'Sun' : 'Moon',
        bgGradient: isDay ? 'from-amber-400 via-orange-400 to-sky-500' : 'from-indigo-900 via-slate-900 to-purple-950',
        accentColor: 'text-amber-500',
        description: 'Sunlight in full glory with crisp clear visibility.'
      };
    case 1:
      return {
        label: 'Mainly Clear',
        iconName: isDay ? 'SunMedium' : 'MoonStar',
        bgGradient: 'from-amber-300 via-sky-400 to-blue-500',
        accentColor: 'text-amber-400',
        description: 'Mostly sunny with scattered gentle wisps of cloud.'
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        iconName: 'CloudSun',
        bgGradient: 'from-sky-400 via-blue-500 to-indigo-600',
        accentColor: 'text-sky-300',
        description: 'Pleasant mix of sunshine and drifting cloud cover.'
      };
    case 3:
      return {
        label: 'Overcast',
        iconName: 'Cloud',
        bgGradient: 'from-slate-500 via-slate-600 to-zinc-700',
        accentColor: 'text-slate-300',
        description: 'Dense cloud ceiling shielding direct sunlight.'
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        iconName: 'CloudFog',
        bgGradient: 'from-slate-400 via-zinc-500 to-slate-700',
        accentColor: 'text-slate-300',
        description: 'Reduced visibility due to mist and ground fog.'
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Light Drizzle',
        iconName: 'CloudDrizzle',
        bgGradient: 'from-sky-500 via-cyan-600 to-blue-700',
        accentColor: 'text-cyan-300',
        description: 'Light fine rain drops falling consistently.'
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        iconName: 'CloudHail',
        bgGradient: 'from-cyan-600 via-slate-700 to-blue-900',
        accentColor: 'text-cyan-200',
        description: 'Freezing moisture droplets forming thin ice layers.'
      };
    case 61:
    case 63:
      return {
        label: 'Moderate Rain',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-600 via-indigo-700 to-slate-800',
        accentColor: 'text-blue-300',
        description: 'Steady rain shower activity throughout the region.'
      };
    case 65:
      return {
        label: 'Heavy Rain',
        iconName: 'CloudRainWind',
        bgGradient: 'from-indigo-800 via-slate-800 to-blue-950',
        accentColor: 'text-indigo-300',
        description: 'Torrential downpour with high water accumulation.'
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        iconName: 'CloudHail',
        bgGradient: 'from-blue-800 via-slate-900 to-cyan-950',
        accentColor: 'text-cyan-300',
        description: 'Rain drops freezing immediately upon ground contact.'
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Snow Fall',
        iconName: 'Snowflake',
        bgGradient: 'from-sky-300 via-indigo-400 to-slate-600',
        accentColor: 'text-sky-200',
        description: 'Crisp snow flakes drifting down over the area.'
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-500 via-sky-600 to-indigo-800',
        accentColor: 'text-sky-300',
        description: 'Intermittent localized rain showers and cloud bursts.'
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        iconName: 'CloudSnow',
        bgGradient: 'from-cyan-500 via-blue-600 to-slate-800',
        accentColor: 'text-cyan-200',
        description: 'Brief heavy flurries of blowing snow showers.'
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        iconName: 'CloudLightning',
        bgGradient: 'from-purple-900 via-slate-900 to-indigo-950',
        accentColor: 'text-amber-300',
        description: 'Electrical thunder strikes accompanied by heavy precipitation.'
      };
    default:
      return {
        label: 'Variable Weather',
        iconName: 'CloudSun',
        bgGradient: 'from-blue-500 via-sky-500 to-indigo-600',
        accentColor: 'text-blue-300',
        description: 'Changing weather patterns throughout the day.'
      };
  }
}

/**
 * Temperature Unit Conversion
 */
export function convertTemp(celsius: number, unit: TempUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: TempUnit): string {
  const val = convertTemp(celsius, unit);
  return `${val}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

/**
 * Wind Speed Unit Conversion
 */
export function convertWindSpeed(kmh: number, unit: WindUnit): number {
  if (unit === 'mph') {
    return Math.round(kmh * 0.621371);
  }
  return Math.round(kmh);
}

export function formatWindSpeed(kmh: number, unit: WindUnit): string {
  const val = convertWindSpeed(kmh, unit);
  return `${val} ${unit === 'mph' ? 'mph' : 'km/h'}`;
}

/**
 * Compass direction conversion
 */
export function getWindDirectionLabel(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

/**
 * Date Formatting Utilities
 */
export function formatDayName(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Generate Smart Planning Recommendations
 * Based strictly on user criteria + extended actionable insights
 */
export function generateSmartRecommendations(data: WeatherData): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = [];
  const currentTemp = data.current_weather.temperature;
  const windSpeed = data.current_weather.windspeed;
  const weatherCode = data.current_weather.weathercode;
  
  // Calculate max daily precipitation in the 7-day forecast
  const todayPrecip = data.daily.precipitation_sum[0] || 0;
  const maxForecastPrecip = Math.max(...(data.daily.precipitation_sum || [0]));
  
  // High Precipitation / Rain rule
  const isRainingCurrently = [51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weatherCode);
  if (isRainingCurrently || todayPrecip > 2 || maxForecastPrecip > 5) {
    recommendations.push({
      id: 'rain-alert',
      category: 'rain',
      title: 'Rain & Moisture Gear',
      description: 'Carry an umbrella and wear waterproof gear.',
      severity: 'alert',
      icon: 'Umbrella'
    });
  }

  // High Wind Speed rule (>20 km/h)
  if (windSpeed > 20) {
    recommendations.push({
      id: 'wind-alert',
      category: 'wind',
      title: 'High Wind Warning',
      description: 'Caution for outdoor activities due to windy conditions.',
      severity: 'warning',
      icon: 'Wind'
    });
  }

  // Warm Weather rule (>30°C)
  if (currentTemp > 30) {
    recommendations.push({
      id: 'heat-alert',
      category: 'clothing',
      title: 'Warm Weather Comfort',
      description: 'Stay hydrated and wear lightweight clothing.',
      severity: 'warning',
      icon: 'Sun'
    });
  } else if (currentTemp < 15) { // Cold Weather rule (<15°C)
    recommendations.push({
      id: 'cold-alert',
      category: 'clothing',
      title: 'Cold Weather Layering',
      description: 'Dress warmly in layers.',
      severity: 'info',
      icon: 'Shirt'
    });
  } else {
    // Pleasant Weather
    recommendations.push({
      id: 'pleasant-weather',
      category: 'outdoor',
      title: 'Optimal Outdoor Conditions',
      description: 'Ideal weather for outdoor activities, walking, or sports.',
      severity: 'success',
      icon: 'Smile'
    });
  }

  // UV Index recommendation if hourly UV data is present
  const currentHourIdx = new Date().getHours();
  const uvIndex = data.hourly?.uv_index?.[currentHourIdx] || 0;
  if (uvIndex >= 6) {
    recommendations.push({
      id: 'uv-alert',
      category: 'health',
      title: 'High UV Index',
      description: `UV Index is high (${uvIndex.toFixed(1)}). Apply broad-spectrum SPF 30+ sunscreen and wear sunglasses.`,
      severity: 'warning',
      icon: 'Glasses'
    });
  }

  return recommendations;
}
