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

const { width, height } = Dimensions.get('window');
const STAR_COUNT = 80;

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const stars: Star[] = Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * width,
  y: Math.random() * height * 0.7,
  size: 1 + Math.random() * 2.5,
  delay: Math.random() * 3000,
  duration: 1500 + Math.random() * 2000,
}));

interface StarProps {
  star: Star;
}

function Star({ star }: StarProps) {
  const opacity = useSharedValue(Math.random() * 0.5);

  useEffect(() => {
    opacity.value = withDelay(
      star.delay,
      withRepeat(
        withSequence(
          withTiming(0.9, { duration: star.duration }),
          withTiming(0.1, { duration: star.duration })
        ),
        -1
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.star,
        style,
        {
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
        },
      ]}
    />
  );
}

export default function NightBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
      {stars.map(star => (
        <Star key={star.id} star={star} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
});
