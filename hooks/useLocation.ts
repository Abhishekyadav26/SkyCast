import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface Coordinates {
  lat: number;
  lon: number;
}

export function useLocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      try {
        // Step 1: ask for permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setError('Location permission denied. Search for a city manually.');
          setLoading(false);
          return;
        }

        // Step 2: get current position
        // accuracy: Balanced is fast and good enough for weather
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setCoords({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        });
      } catch (e) {
        setError('Could not get location. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  return { coords, error, loading };
}
