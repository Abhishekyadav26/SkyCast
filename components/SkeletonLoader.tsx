import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

interface SkeletonBlockProps {
  width: string | number;
  height: number;
  borderRadius?: number;
  style?: any;
}

function SkeletonBlock({ width, height, borderRadius = 8, style }: SkeletonBlockProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius },
        animStyle,
        style,
      ]}
    />
  );
}

// Full home screen skeleton layout
export default function HomeSkeleton() {
  return (
    <View style={styles.container}>

      {/* City name + date */}
      <View style={styles.header}>
        <View>
          <SkeletonBlock width={140} height={28} borderRadius={8} />
          <SkeletonBlock width={90} height={14} borderRadius={6} style={{ marginTop: 8 }} />
        </View>
        <SkeletonBlock width={44} height={44} borderRadius={22} />
      </View>

      {/* Main weather icon */}
      <View style={styles.mainSection}>
        <SkeletonBlock width={90} height={90} borderRadius={45} />
        <SkeletonBlock width={120} height={80} borderRadius={16} style={{ marginTop: 16 }} />
        <SkeletonBlock width={160} height={22} borderRadius={8} style={{ marginTop: 12 }} />
        <SkeletonBlock width={200} height={16} borderRadius={6} style={{ marginTop: 8 }} />
      </View>

      {/* Stat cards */}
      <View style={styles.statsRow}>
        <SkeletonBlock width="31%" height={100} borderRadius={20} />
        <SkeletonBlock width="31%" height={100} borderRadius={20} />
        <SkeletonBlock width="31%" height={100} borderRadius={20} />
      </View>

      {/* Hourly strip label */}
      <SkeletonBlock width={140} height={16} borderRadius={6} style={{ marginBottom: 14 }} />

      {/* Hourly cards */}
      <View style={styles.hourlyRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} width={72} height={110} borderRadius={20} />
        ))}
      </View>

      {/* Daily label */}
      <SkeletonBlock width={100} height={16} borderRadius={6} style={{ marginTop: 24, marginBottom: 14 }} />

      {/* Daily rows */}
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} style={styles.dailyRow}>
          <SkeletonBlock width={52} height={16} borderRadius={6} />
          <SkeletonBlock width={28} height={28} borderRadius={14} />
          <SkeletonBlock width="55%" height={8} borderRadius={4} />
          <SkeletonBlock width={36} height={16} borderRadius={6} />
        </View>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  block: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  mainSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  hourlyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
});
