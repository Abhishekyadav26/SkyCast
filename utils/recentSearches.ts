import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'recent_searches';
const MAX = 5;

export const getRecentSearches = async (): Promise<string[]> => {
  try {
    const stored = await AsyncStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveRecentSearch = async (city: string): Promise<void> => {
  try {
    const current = await getRecentSearches();
    // Remove duplicates, add to front, cap at MAX
    const updated = [
      city,
      ...current.filter(c => c.toLowerCase() !== city.toLowerCase()),
    ].slice(0, MAX);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
};

export const clearRecentSearches = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {}
};
