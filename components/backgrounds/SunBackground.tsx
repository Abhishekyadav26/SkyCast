import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SunBackground() {
  const rotation = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    // Slow continuous rotation
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 20000,
        easing: Easing.linear, // constant speed, no easing
      }),
      -1
    );

    // Pulsing glow
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 2500 }),
        withTiming(1.0, { duration: 2500 })
      ),
      -1
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2500 }),
        withTiming(0.2, { duration: 2500 })
      ),
      -1
    );
  }, []);

  const raysStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Outer glow */}
      <Animated.View style={[styles.glow, glowStyle]} />

      {/* Rotating rays */}
      <Animated.View style={[styles.raysContainer, raysStyle]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.ray,
              { transform: [{ rotate: `${i * 30}deg` }] },
            ]}
          />
        ))}
      </Animated.View>

      {/* Sun core */}
      <View style={styles.sunCore} />
    </View>
  );
}

const SUN_SIZE = 160;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    top: -height * 0.1, // push sun up slightly
  },
  glow: {
    position: 'absolute',
    width: SUN_SIZE * 2,
    height: SUN_SIZE * 2,
    borderRadius: SUN_SIZE,
    backgroundColor: 'rgba(255, 200, 50, 0.15)',
  },
  raysContainer: {
    position: 'absolute',
    width: SUN_SIZE * 2.5,
    height: SUN_SIZE * 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ray: {
    position: 'absolute',
    width: 3,
    height: SUN_SIZE * 1.2,
    backgroundColor: 'rgba(255, 220, 80, 0.25)',
    borderRadius: 4,
  },
  sunCore: {
    width: SUN_SIZE * 0.6,
    height: SUN_SIZE * 0.6,
    borderRadius: SUN_SIZE,
    backgroundColor: 'rgba(255, 220, 80, 0.2)',
  },
});
