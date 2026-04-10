import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useWeather } from '../hooks/useWeather';
import { COLORS, SIZES } from '../constants/theme';

export default function SearchScreen() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const { weather, loading, error, refresh } = useWeather(null);

  const handleSearch = () => {
    if (city.trim()) {
      // Navigate back to home with city search
      router.replace({
        pathname: '/',
        params: { city: city.trim() }
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Search City</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter city name..."
          placeholderTextColor={COLORS.whiteAlpha60}
          selectionColor={COLORS.white}
          autoFocus
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {weather && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultCity}>{weather.name}</Text>
          <Text style={styles.resultTemp}>
            {Math.round(weather.main.temp)}°
          </Text>
          <Text style={styles.resultCondition}>
            {weather.weather[0].description}
          </Text>
          <TouchableOpacity onPress={() => router.replace('/')} style={styles.useButton}>
            <Text style={styles.useButtonText}>Use This Weather</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.whiteAlpha20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.whiteAlpha10,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.whiteAlpha20,
  },
  searchButton: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.whiteAlpha20,
    borderRadius: SIZES.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  searchIcon: {
    fontSize: 20,
  },
  resultContainer: {
    margin: SIZES.padding,
    padding: 20,
    backgroundColor: COLORS.whiteAlpha10,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.whiteAlpha20,
  },
  resultCity: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  resultTemp: {
    fontSize: 48,
    fontWeight: '200',
    color: COLORS.white,
    marginBottom: 8,
  },
  resultCondition: {
    fontSize: 16,
    color: COLORS.whiteAlpha80,
    marginBottom: 16,
  },
  useButton: {
    backgroundColor: COLORS.whiteAlpha20,
    borderRadius: SIZES.radiusSm,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  useButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    margin: SIZES.padding,
    padding: 20,
    backgroundColor: 'rgba(255,100,100,0.2)',
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: 'rgba(255,100,100,0.4)',
  },
  errorText: {
    color: '#ffaaaa',
    fontSize: 14,
    textAlign: 'center',
  },
});
