import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import RainBackground from './RainBackground';

const { width, height } = Dimensions.get('window');

// Lightning flashes at random intervals
function Lightning() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    const flash = () => {
      opacity.value = withSequence(
        withTiming(0.6, { duration: 60 }),
        withTiming(0,   { duration: 80 }),
        withTiming(0.4, { duration: 50 }),
        withTiming(0,   { duration: 200 }),
      );
      // Schedule next flash randomly between 3-8 seconds
      setTimeout(flash, 3000 + Math.random() * 5000);
    };

    const timer = setTimeout(flash, 1000 + Math.random() * 2000);
    return () => clearTimeout(timer);
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, styles.lightning, style]} />
  );
}

export default function StormBackground() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <RainBackground />
      <Lightning />
    </View>
  );
}

const styles = StyleSheet.create({
  lightning: {
    backgroundColor: 'rgba(200, 220, 255, 0.9)',
  },
});
