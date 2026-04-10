import { createContext, useContext, useState } from 'react';

interface LocationData {
  lat?: number;
  lon?: number;
  city?: string;
}

interface WeatherContextType {
  selectedLocation: LocationData | null;
  setSelectedLocation: (location: LocationData | null) => void;
}

const WeatherContext = createContext<WeatherContextType | null>(null);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  // null = use GPS, { lat, lon } = use these coords, { city } = use city name
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  return (
    <WeatherContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext(): WeatherContextType {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeatherContext must be used inside WeatherProvider');
  return ctx;
}
