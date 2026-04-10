import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useRouter } from "expo-router";

import { useLocation } from "../hooks/useLocation";
import { useWeather } from "../hooks/useWeather";
import { useWeatherContext } from "../utils/WeatherContext";
import {
  getWeatherTheme,
  getWeatherIcon,
  formatTime,
} from "../utils/weatherHelpers";
import { GRADIENTS, COLORS, SIZES } from "../constants/theme";
import WeatherIcon from "../components/WeatherIcon";
import StatCard from "../components/StatCard";
import WeatherBackground from "../components/WeatherBackground";
import HourlyForecast from "../components/HourlyForecast";
import DailyForecast from "../components/DailyForecast";
import HomeSkeleton from "../components/SkeletonLoader";
import ErrorScreen from "../components/ErrorScreen";
import { lightTap } from "../utils/haptics";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { coords, loading: locationLoading } = useLocation();
  const { selectedLocation } = useWeatherContext();

  // Pass selectedLocation as second arg - it overrides GPS when set
  const {
    weather,
    forecast,
    loading: weatherLoading,
    error,
    refresh,
  } = useWeather(coords, selectedLocation);

  const isLoading = locationLoading || weatherLoading;

  // Screen transition animation
  const screenOpacity = useSharedValue(0);

  useEffect(() => {
    if (weather) {
      screenOpacity.value = withTiming(1, { duration: 600 });
    }
  }, [weather]);

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  // Entrance animations
  const tempOpacity = useSharedValue(0);
  const tempTranslateY = useSharedValue(30);
  const iconScale = useSharedValue(0);

  useEffect(() => {
    if (weather) {
      // Temp slides up and fades in
      tempOpacity.value = withTiming(1, { duration: 700 });
      tempTranslateY.value = withSpring(0, { damping: 12 });
      // Icon pops in with spring
      iconScale.value = withSpring(1, { damping: 8, stiffness: 80 });
    }
  }, [weather]);

  // Reset animations when weather reloads
  useEffect(() => {
    if (weatherLoading) {
      tempOpacity.value = 0;
      tempTranslateY.value = 30;
      iconScale.value = 0;
    }
  }, [weatherLoading]);

  const tempStyle = useAnimatedStyle(() => ({
    opacity: tempOpacity.value,
    transform: [{ translateY: tempTranslateY.value }],
  }));

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  // Determine gradient + icon
  const weatherCode = weather?.weather?.[0]?.id ?? 800;
  const theme = weather
    ? getWeatherTheme(
        weatherCode,
        weather.dt,
        weather.sys.sunrise,
        weather.sys.sunset,
      )
    : "default";
  const gradient = GRADIENTS[theme];
  const weatherIcon =
    weather && weatherCode
      ? getWeatherIcon(weatherCode, theme === "night")
      : "??";

  // Loading and error states
  if (isLoading) {
    return (
      <LinearGradient
        colors={
          GRADIENTS.default as unknown as readonly [string, string, ...string[]]
        }
        style={{ flex: 1 }}
      >
        <HomeSkeleton />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={
          GRADIENTS.default as unknown as readonly [string, string, ...string[]]
        }
        style={{ flex: 1 }}
      >
        <ErrorScreen message={error} onRetry={refresh} />
      </LinearGradient>
    );
  }

  return (
    <Animated.View style={[{ flex: 1 }, screenStyle]}>
      <LinearGradient
        colors={gradient as unknown as readonly [string, string, ...string[]]}
        style={styles.container}
      >
        {/* Animation layer — sits behind all UI */}
        <WeatherBackground theme={theme} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={weatherLoading}
              onRefresh={refresh}
              tintColor="#ffffff"
              colors={["#ffffff"]}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.cityName}>{weather?.name ?? "..."}</Text>
              <Text style={styles.dateText}>
                {weather
                  ? `Updated ${formatTime(weather.dt)}`
                  : "Fetching location..."}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => {
                lightTap();
                router.push("/search");
              }}
            >
              <Text style={styles.settingsIcon}>?</Text>
            </TouchableOpacity>
          </View>

          {/* Main weather display */}
          <View style={styles.mainWeather}>
            {/* Animated icon */}
            <Animated.View style={iconContainerStyle}>
              <WeatherIcon icon={weatherIcon} size={90} />
            </Animated.View>

            {/* Animated temperature */}
            <Animated.View style={tempStyle}>
              <Text style={styles.temperature}>
                {isLoading ? "--" : `${Math.round(weather?.main?.temp ?? 0)}°`}
              </Text>
            </Animated.View>

            <Text style={styles.condition}>
              {weather?.weather?.[0]?.description
                ?.split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ") ?? (isLoading ? "Loading..." : "No data")}
            </Text>

            <Text style={styles.feelsLike}>
              {weather
                ? `Feels like ${Math.round(weather.main.feels_like)}°  ·  H:${Math.round(weather.main.temp_max)}°  L:${Math.round(weather.main.temp_min)}°`
                : ""}
            </Text>
          </View>

          {/* Error state */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Stat cards */}
          {weather && (
            <View style={styles.statsRow}>
              <StatCard
                icon="humidity"
                value={`${weather.main.humidity}%`}
                label="Humidity"
                delay={0}
              />
              <StatCard
                icon="wind"
                value={`${Math.round(weather.wind.speed * 3.6)}km/h`}
                label="Wind"
                delay={100}
              />
              <StatCard
                icon="visibility"
                value={`${(weather.visibility / 1000).toFixed(1)}km`}
                label="Visibility"
                delay={200}
              />
            </View>
          )}

          {forecast && (
            <>
              <HourlyForecast
                forecastList={forecast.list}
                isNight={theme === "night"}
              />
              <DailyForecast forecastList={forecast.list} />
            </>
          )}
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
    minHeight: "100%",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  cityName: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.whiteAlpha60,
    marginTop: 2,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.whiteAlpha20,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsIcon: {
    fontSize: 20,
  },

  // Main weather
  mainWeather: {
    alignItems: "center",
    marginBottom: 48,
  },
  temperature: {
    fontSize: 96,
    fontWeight: "200", // thin weight - looks elegant for large temp display
    color: COLORS.white,
    letterSpacing: -4,
    marginTop: 8,
  },
  condition: {
    fontSize: 22,
    color: COLORS.whiteAlpha80,
    fontWeight: "500",
    marginTop: 4,
  },
  feelsLike: {
    fontSize: 14,
    color: COLORS.whiteAlpha60,
    marginTop: 8,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },

  // Error
  errorBanner: {
    backgroundColor: "rgba(255,100,100,0.2)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,100,100,0.4)",
  },
  errorText: {
    color: "#ffaaaa",
    fontSize: 14,
    textAlign: "center",
  },
});
