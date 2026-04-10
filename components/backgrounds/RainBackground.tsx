import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const RAIN_COUNT = 60;

interface RainDrop {
  id: number;
  x: number;
  delay: number;
  duration: number;
  opacity: number;
  height: number;
}

// Generate randomized drop properties once
const drops: RainDrop[] = Array.from({ length: RAIN_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * width,       // random horizontal position
  delay: Math.random() * 2000,    // random start delay
  duration: 800 + Math.random() * 600,  // random fall speed
  opacity: 0.2 + Math.random() * 0.4,  // random opacity
  height: 12 + Math.random() * 16,     // random length
}));

interface RainDropProps {
  drop: RainDrop;
}

function RainDrop({ drop }: RainDropProps) {
  const translateY = useSharedValue(-20);

  useEffect(() => {
    translateY.value = withDelay(
      drop.delay,
      withRepeat(
        withTiming(height + 20, {
          duration: drop.duration,
          easing: Easing.linear,
        }),
        -1
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.drop,
        style,
        {
          left: drop.x,
          opacity: drop.opacity,
          height: drop.height,
        },
      ]}
    />
  );
}

export default function RainBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
      {drops.map(drop => (
        <RainDrop key={drop.id} drop={drop} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  drop: {
    position: 'absolute',
    top: 0,
    width: 1.5,
    backgroundColor: 'rgba(180, 210, 255, 0.6)',
    borderRadius: 1,
  },
});
