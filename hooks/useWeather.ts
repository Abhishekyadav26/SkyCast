import { useState, useEffect, useCallback } from 'react';
import { 
  fetchWeatherByCoords, 
  fetchForecastByCoords, 
  fetchWeatherByCity, 
  fetchForecastByCity 
} from '../utils/api';

interface Coordinates {
  lat: number;
  lon: number;
}

interface LocationData {
  lat?: number;
  lon?: number;
  city?: string;
}

interface Weather {
  dt: number;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    temp_max: number;
    temp_min: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    id: number;
    description: string;
  }>;
  sys: {
    sunrise: number;
    sunset: number;
  };
  name: string;
  visibility: number;
}

interface Forecast {
  list: Array<{
    dt: number;
    main: {
      temp: number;
    };
    weather: Array<{
      id: number;
    }>;
  }>;
}

export function useWeather(coords: Coordinates | null, selectedLocation?: LocationData | null) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    // Priority: selected city > selected coords > GPS coords
    const source = selectedLocation || coords;
    if (!source) return;

    setLoading(true);
    setError(null);

    try {
      let weatherData, forecastData;

      if ('city' in source && source.city) {
        // City name search
        [weatherData, forecastData] = await Promise.all([
          fetchWeatherByCity(source.city),
          fetchForecastByCity(source.city),
        ]);
      } else if ('lat' in source && 'lon' in source && source.lat && source.lon) {
        // Coordinates
        [weatherData, forecastData] = await Promise.all([
          fetchWeatherByCoords(source.lat, source.lon),
          fetchForecastByCoords(source.lat, source.lon),
        ]);
      } else {
        return;
      }

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (e: any) {
      setError(
        e.response?.status === 404
          ? 'City not found. Check the spelling and try again.'
          : 'Failed to load weather. Check your connection.'
      );
      console.error(e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  }, [coords, selectedLocation]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return { weather, forecast, loading, error, refresh: loadWeather };
}
