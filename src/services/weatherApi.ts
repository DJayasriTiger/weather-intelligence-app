import { GeoLocation, WeatherData } from '../types/weather';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search cities by name using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding HTTP error: ${response.status}`);
    }
    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      country_code: item.country_code || '',
      admin1: item.admin1 || '',
      timezone: item.timezone || 'auto',
    }));
  } catch (error) {
    console.error('Error fetching city search:', error);
    throw error;
  }
}

/**
 * Fetch 7-day forecast & current weather from Open-Meteo API
 */
export async function fetchForecast(location: GeoLocation): Promise<WeatherData> {
  const { latitude, longitude } = location;
  const url = `${FORECAST_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weathercode,windspeed_10m,uv_index&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Forecast HTTP error: ${response.status}`);
    }
    const data = await response.json();

    if (!data.current_weather || !data.daily) {
      throw new Error('Invalid forecast data structure returned');
    }

    return {
      location,
      current_weather: data.current_weather,
      daily: data.daily,
      hourly: data.hourly,
      elevation: data.elevation,
    };
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
}

/**
 * Convenience function to search for a city and return its weather in a single flow
 */
export async function getWeatherForCityName(cityName: string): Promise<WeatherData> {
  const locations = await searchCities(cityName);
  if (!locations || locations.length === 0) {
    throw new Error('CITY_NOT_FOUND');
  }
  // Select the top search match
  const bestMatch = locations[0];
  return await fetchForecast(bestMatch);
}
