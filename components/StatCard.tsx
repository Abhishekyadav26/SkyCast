import { View, Text, StyleSheet, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useSharedValue } from "react-native-reanimated";
import { COLORS } from "../constants/theme";
import { lightTap } from "../utils/haptics";

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  delay?: number;
  onPress?: () => void;
}

// Map stat types to icons
const getStatIcon = (iconType: string): string => {
  const iconMap: Record<string, string> = {
    humidity: "💧",
    wind: "💨",
    visibility: "🌫️",
  };

  // Use actual emoji icons for weather stats
  const emojiIcons: Record<string, string> = {
    humidity: "💧",
    wind: "💨",
    visibility: "🌫️",
  };

  // Real weather stat emojis
  const weatherIcons: Record<string, string> = {
    humidity: "💧",
    wind: "💨",
    visibility: "🌫️",
  };

  // Final mapping with proper emojis
  const finalIcons: Record<string, string> = {
    humidity: "💧",
    wind: "💨",
    visibility: "🌫️",
  };

  return finalIcons[iconType] || "??";
};

export default function StatCard({
  icon,
  value,
  label,
  delay = 0,
  onPress,
}: StatCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const displayIcon = getStatIcon(icon);

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Pressable
        onPressIn={() => {
          pressScale.value = withSpring(0.94, { damping: 10 });
          lightTap();
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1, { damping: 10 });
        }}
        onPress={onPress}
      >
        <Animated.View style={pressStyle}>
          <BlurView intensity={20} tint="light" style={styles.card}>
            <Text style={styles.icon}>{displayIcon}</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
          </BlurView>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
    overflow: "hidden", // required for BlurView border radius
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  icon: {
    fontSize: 22,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
  label: {
    fontSize: 11,
    color: COLORS.whiteAlpha60,
    marginTop: 2,
  },
});
