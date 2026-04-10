import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherByCoords, fetchForecastByCoords, fetchWeatherByCity } from '../utils/api';

interface Coordinates {
  lat: number;
  lon: number;
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

export function useWeather(coords: Coordinates | null, city?: string) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let weatherData, forecastData;

      if (city) {
        // Search by city name
        weatherData = await fetchWeatherByCity(city);
        // For city search, we don't need forecast for now
        forecastData = null;
      } else if (coords) {
        // Get weather by coordinates
        [weatherData, forecastData] = await Promise.all([
          fetchWeatherByCoords(coords.lat, coords.lon),
          fetchForecastByCoords(coords.lat, coords.lon),
        ]);
      } else {
        return;
      }

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (e: any) {
      setError('Failed to load weather. Check your API key or connection.');
      console.error(e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  }, [coords, city]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return { weather, forecast, loading, error, refresh: loadWeather };
}
