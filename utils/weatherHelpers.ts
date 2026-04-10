import dayjs from 'dayjs';

// Map OpenWeatherMap condition codes to our gradient keys
export const getWeatherTheme = (weatherCode: number, dt: number, sunrise: number, sunset: number): string => {
  const isNight = dt < sunrise || dt > sunset;
  if (isNight) return 'night';

  // OWM condition codes: https://openweathermap.org/weather-conditions
  if (weatherCode >= 200 && weatherCode < 300) return 'stormy';  // thunderstorm
  if (weatherCode >= 300 && weatherCode < 600) return 'rainy';   // drizzle + rain
  if (weatherCode >= 600 && weatherCode < 700) return 'snowy';   // snow
  if (weatherCode >= 700 && weatherCode < 800) return 'cloudy';  // atmosphere (fog etc)
  if (weatherCode === 800) return 'sunny';                        // clear sky
  if (weatherCode > 800) return 'cloudy';                        // clouds

  return 'default';
};

// Weather condition to emoji icon
export const getWeatherIcon = (weatherCode: number, isNight: boolean = false): string => {
  if (weatherCode >= 200 && weatherCode < 300) return '⛈️';
  if (weatherCode >= 300 && weatherCode < 400) return '🌦️';
  if (weatherCode >= 500 && weatherCode < 600) return '🌧️';
  if (weatherCode >= 600 && weatherCode < 700) return '❄️';
  if (weatherCode >= 700 && weatherCode < 800) {
    // Handle specific atmospheric conditions
    switch (weatherCode) {
      case 711: return '🌫️'; // haze
      case 721: return '🌫️'; // haze
      case 731: return '🌫️'; // sand/dust whirls
      case 741: return '🌫️'; // haze
      case 751: return '🌫️'; // sand
      case 761: return '🌫️'; // dust
      case 762: return '🌋️'; // volcanic ash
      case 771: return '🌋️'; // squalls
      case 781: return '🌋️'; // tornado
      default: return '🌫️'; // default fog/mist
    }
  }
  if (weatherCode === 800) return isNight ? '🌙' : '☀️';
  if (weatherCode === 801) return '🌤️';
  if (weatherCode > 801) return '☁️';
  return '🌡️';
};

export const formatTime = (timestamp: number): string =>
  dayjs.unix(timestamp).format('h:mm A');

export const formatDay = (timestamp: number): string =>
  dayjs.unix(timestamp).format('ddd');

export const formatDate = (timestamp: number): string =>
  dayjs.unix(timestamp).format('MMM D, YYYY');

// Get first 8 forecast entries = next 24 hours (3hr intervals)
export const getHourlyForecast = (forecastList: any[]) => {
  return forecastList.slice(0, 8);
};

interface ForecastDay {
  dt: number;
  temps: number[];
  weatherId: number;
  description: string;
}

interface DailyForecastItem extends ForecastDay {
  maxTemp: number;
  minTemp: number;
}

// Group forecast by day and extract daily high/low
export const getDailyForecast = (forecastList: any[]): DailyForecastItem[] => {
  const grouped: Record<string, ForecastDay> = {};

  forecastList.forEach(item => {
    const day = dayjs.unix(item.dt).format('YYYY-MM-DD');

    if (!grouped[day]) {
      grouped[day] = {
        dt: item.dt,
        temps: [],
        weatherId: item.weather[0].id,
        description: item.weather[0].description,
      };
    }

    grouped[day].temps.push(item.main.temp);

    // Use midday entry for the icon (most representative)
    const hour = dayjs.unix(item.dt).hour();
    if (hour >= 12 && hour <= 15) {
      grouped[day].weatherId = item.weather[0].id;
    }
  });

  return Object.values(grouped)
    .slice(0, 7) // max 7 days
    .map(day => ({
      ...day,
      maxTemp: Math.round(Math.max(...day.temps)),
      minTemp: Math.round(Math.min(...day.temps)),
    }));
};

// Temperature range bar width (for the visual bar in daily forecast)
export const getTempBarWidth = (temp: number, minTemp: number, maxTemp: number): number => {
  if (maxTemp === minTemp) return 50;
  return ((temp - minTemp) / (maxTemp - minTemp)) * 100;
};
