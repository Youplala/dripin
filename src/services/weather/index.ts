import * as Location from 'expo-location';
import { Weather } from '../../types/database';

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || '';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function getCurrentWeather(): Promise<Weather | null> {
  try {
    // Get location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission denied');
      return null;
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Fetch weather
    const response = await fetch(
      `${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=imperial`
    );

    if (!response.ok) {
      throw new Error('Weather API error');
    }

    const data = await response.json();

    return {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return getMockWeather();
  }
}

export function getMockWeather(): Weather {
  return {
    temp: 72,
    condition: 'Clear',
    description: 'clear sky',
    icon: '01d',
  };
}

export function getWeatherIcon(condition: string): string {
  const icons: Record<string, string> = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
  };

  return icons[condition] || '🌤️';
}

export function getOutfitGuidanceForWeather(weather: Weather): string {
  if (weather.temp < 40) {
    return 'Layer up! It\'s cold outside. Consider a warm jacket and pants.';
  } else if (weather.temp < 60) {
    return 'A bit chilly. A light jacket or sweater would be perfect.';
  } else if (weather.temp < 75) {
    return 'Perfect weather! Most outfits will work great.';
  } else if (weather.temp < 85) {
    return 'Getting warm! Light, breathable fabrics recommended.';
  } else {
    return 'It\'s hot! Stay cool with light colors and minimal layers.';
  }
}

export function getSeasonForWeather(weather: Weather): string[] {
  if (weather.temp < 45) return ['fall', 'winter'];
  if (weather.temp < 65) return ['spring', 'fall'];
  if (weather.temp < 80) return ['spring', 'summer'];
  return ['summer'];
}
