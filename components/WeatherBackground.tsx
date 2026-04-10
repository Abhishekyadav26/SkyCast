import SunBackground from './backgrounds/SunBackground';
import RainBackground from './backgrounds/RainBackground';
import CloudBackground from './backgrounds/CloudBackground';
import NightBackground from './backgrounds/NightBackground';
import StormBackground from './backgrounds/StormBackground';

interface WeatherBackgroundProps {
  theme: string;
}

export default function WeatherBackground({ theme }: WeatherBackgroundProps) {
  switch (theme) {
    case 'sunny':  return <SunBackground />;
    case 'rainy':  return <RainBackground />;
    case 'cloudy': return <CloudBackground />;
    case 'night':  return <NightBackground />;
    case 'stormy': return <StormBackground />;
    case 'snowy':  return <RainBackground />; // reuse rain, white tint
    default:       return null;
  }
}
