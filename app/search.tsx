import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { fetchWeatherByCity } from "../utils/api";
import { useWeatherContext } from "../utils/WeatherContext";
import { useDebounce } from "../hooks/useDebounce";
import {
  getRecentSearches,
  saveRecentSearch,
  clearRecentSearches,
} from "../utils/recentSearches";
import SearchResultCard from "../components/SearchResultCard";
import { COLORS, GRADIENTS, SIZES } from "../constants/theme";
import { lightTap, successTap } from "../utils/haptics";

export default function SearchScreen() {
  const router = useRouter();
  const { setSelectedLocation } = useWeatherContext();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, 500);

  // Animate the input in on mount
  const inputOpacity = useSharedValue(0);
  const inputTranslateY = useSharedValue(-10);

  useEffect(() => {
    inputOpacity.value = withTiming(1, { duration: 400 });
    inputTranslateY.value = withTiming(0, { duration: 400 });
    // Autofocus after animation
    setTimeout(() => inputRef.current?.focus(), 400);
    // Load recent searches
    getRecentSearches().then(setRecentSearches);
  }, []);

  const inputStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
    transform: [{ translateY: inputTranslateY.value }],
  }));

  // Fire search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResult(null);
      setSearchError("");
      return;
    }
    searchCity(debouncedQuery.trim());
  }, [debouncedQuery]);

  const searchCity = async (city: string) => {
    setSearching(true);
    setSearchError("");
    setResult(null);
    try {
      const data = await fetchWeatherByCity(city);
      setResult(data);
    } catch (e: any) {
      setSearchError(
        e.response?.status === 404
          ? `"${city}" not found. Try a different spelling.`
          : "Search failed. Check your connection.",
      );
    } finally {
      setSearching(false);
    }
  };

  const selectCity = async (cityName: string) => {
    await successTap(); // feels satisfying when city loads
    Keyboard.dismiss();
    await saveRecentSearch(cityName);
    setSelectedLocation({ city: cityName });
    router.back(); // go back to home with new city loaded
  };

  const clearRecent = async () => {
    await clearRecentSearches();
    setRecentSearches([]);
  };

  const showRecents = !query && recentSearches.length > 0;
  const showResult = result && query;

  return (
    <LinearGradient
      colors={
        GRADIENTS.default as unknown as readonly [string, string, ...string[]]
      }
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search City</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search input */}
      <Animated.View style={[styles.inputWrapper, inputStyle]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="City name..."
          placeholderTextColor={COLORS.whiteAlpha60}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={() => query.trim() && searchCity(query.trim())}
          autoCapitalize="words"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setResult(null);
            }}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Loading indicator */}
        {searching && (
          <View style={styles.centered}>
            <ActivityIndicator color={COLORS.white} size="small" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {/* Error */}
        {searchError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{searchError}</Text>
          </View>
        ) : null}

        {/* Search result */}
        {showResult && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Result</Text>
            <SearchResultCard
              weather={result}
              onSelect={() => selectCity(result.name)}
            />
          </View>
        )}

        {/* Recent searches */}
        {showRecents && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearRecent}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((city, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentRow}
                onPress={() => {
                  lightTap();
                  setQuery(city);
                  searchCity(city);
                }}
              >
                <Text style={styles.recentIcon}>🕐</Text>
                <Text style={styles.recentCity}>{city}</Text>
                <Text style={styles.recentChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty state */}
        {!query && recentSearches.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🌍</Text>
            <Text style={styles.emptyTitle}>Search any city</Text>
            <Text style={styles.emptySubtitle}>
              Type a city name above to get current weather
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.whiteAlpha20,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },

  // Input
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.whiteAlpha20,
    marginHorizontal: SIZES.padding,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.whiteAlpha20,
    marginBottom: 24,
    gap: 10,
  },
  searchIcon: { fontSize: 18 },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.white,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.whiteAlpha60,
    padding: 4,
  },

  scroll: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },

  // Sections
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.whiteAlpha60,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  clearText: {
    fontSize: 14,
    color: COLORS.whiteAlpha60,
    marginBottom: 12,
  },

  // Recent row
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.whiteAlpha10,
    gap: 12,
  },
  recentIcon: { fontSize: 16 },
  recentCity: {
    flex: 1,
    fontSize: 16,
    color: COLORS.white,
  },
  recentChevron: {
    fontSize: 20,
    color: COLORS.whiteAlpha60,
  },

  // States
  centered: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    color: COLORS.whiteAlpha60,
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: "rgba(255,100,100,0.15)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,100,100,0.3)",
    marginBottom: 16,
  },
  errorText: {
    color: "#ffaaaa",
    fontSize: 14,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.white,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.whiteAlpha60,
    textAlign: "center",
  },
});
