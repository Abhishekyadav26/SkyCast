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
