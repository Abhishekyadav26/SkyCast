import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

interface Cloud {
  id: number;
  top: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

const CLOUDS: Cloud[] = [
  {
    id: 1,
    top: height * 0.08,
    size: 120,
    opacity: 0.15,
    duration: 25000,
    delay: 0,
  },
  {
    id: 2,
    top: height * 0.15,
    size: 180,
    opacity: 0.1,
    duration: 35000,
    delay: 5000,
  },
  {
    id: 3,
    top: height * 0.25,
    size: 100,
    opacity: 0.12,
    duration: 28000,
    delay: 2000,
  },
  {
    id: 4,
    top: height * 0.05,
    size: 140,
    opacity: 0.08,
    duration: 40000,
    delay: 8000,
  },
];

interface CloudProps {
  cloud: Cloud;
}

function Cloud({ cloud }: CloudProps) {
  const translateX = useSharedValue(-cloud.size);

  useEffect(() => {
    translateX.value = withDelay(
      cloud.delay,
      withRepeat(
        withTiming(width + cloud.size, {
          duration: cloud.duration,
          easing: Easing.linear,
        }),
        -1,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.cloud,
        style,
        {
          top: cloud.top,
          width: cloud.size,
          height: cloud.size * 0.5,
          borderRadius: cloud.size * 0.25,
          opacity: cloud.opacity,
        },
      ]}
    />
  );
}

export default function CloudBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
      {CLOUDS.map((cloud) => (
        <Cloud key={cloud.id} cloud={cloud} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  cloud: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 50,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
});
