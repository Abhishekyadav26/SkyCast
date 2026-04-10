import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WeatherIconProps {
  icon: string;
  size?: number;
}

// Map weather conditions to Ionicons
const getWeatherIconName = (icon: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    "⛈️": "thunderstorm-outline",
    "🌦️": "rainy-outline",
    "🌧️": "water-outline",
    "❄️": "snow-outline",
    "🌫️": "cloud-outline",
    "☀️": "sunny-outline",
    "🌙": "moon-outline",
    "🌤️": "partly-sunny-outline",
    "☁️": "cloud-outline",
    "🌡️": "thermometer-outline",
  };

  return iconMap[icon] || "thermometer-outline";
};

export default function WeatherIcon({ icon, size = 80 }: WeatherIconProps) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Gentle floating up-down loop
    translateY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, // -1 = infinite
      false,
    );

    // Subtle pulse
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2000 }),
        withTiming(1.0, { duration: 2000 }),
      ),
      -1,
      false,
    );
  }, [icon]); // restart animation when icon changes

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const iconName = getWeatherIconName(icon);

  return (
    <View
      style={{ height: 110, alignItems: "center", justifyContent: "center" }}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons name={iconName} size={size} color="white" />
      </Animated.View>
    </View>
  );
}
