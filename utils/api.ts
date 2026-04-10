import axios from 'axios';
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.WEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Current weather by coordinates
export const fetchWeatherByCoords = async (lat: number, lon: number) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric', // Celsius — change to 'imperial' for Fahrenheit
    },
  });
  return response.data;
};

// Current weather by city name (for search)
export const fetchWeatherByCity = async (city: string) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return response.data;
};

// 5-day forecast by city name
export const fetchForecastByCity = async (city: string) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return response.data;
};

// 5-day / 3-hour forecast by coordinates
export const fetchForecastByCoords = async (lat: number, lon: number) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
    },
  });
  return response.data;
};
