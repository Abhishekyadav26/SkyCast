import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { getWeatherIcon, formatDay, getTempBarWidth } from '../utils/weatherHelpers';

interface DailyRowProps {
  item: any;
  index: number;
  overallMin: number;
  overallMax: number;
}

export default function DailyRow({ item, index, overallMin, overallMax }: DailyRowProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);
  const barWidth = useSharedValue(0);

  useEffect(() => {
    const delay = index * 100;

    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateX.value = withDelay(delay, withSpring(0, { damping: 14 }));

    // Bar animates to its target width after the row appears
    const targetWidth = getTempBarWidth(
      item.maxTemp, overallMin, overallMax
    );
    barWidth.value = withDelay(
      delay + 300,
      withTiming(targetWidth, { duration: 600 })
    );
  }, []);

  const rowStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%`,
  }));

  const icon = getWeatherIcon(item.weatherId);
  const isToday = index === 0;

  return (
    <Animated.View style={[styles.row, rowStyle]}>
      {/* Day label */}
      <Text style={[styles.day, isToday && styles.dayActive]}>
        {isToday ? 'Today' : formatDay(item.dt)}
      </Text>

      {/* Weather icon */}
      <Text style={styles.icon}>{icon}</Text>

      {/* Temp range */}
      <View style={styles.tempRange}>
        <Text style={styles.tempMin}>{item.minTemp}°</Text>

        {/* Animated temperature bar */}
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, barStyle]} />
        </View>

        <Text style={styles.tempMax}>{item.maxTemp}°</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.whiteAlpha10,
    gap: 12,
  },
  day: {
    width: 52,
    fontSize: 15,
    color: COLORS.whiteAlpha60,
    fontWeight: '500',
  },
  dayActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  tempRange: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tempMin: {
    fontSize: 14,
    color: COLORS.whiteAlpha60,
    width: 32,
    textAlign: 'right',
  },
  tempMax: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
    width: 32,
  },
  barTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.whiteAlpha20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.whiteAlpha80,
    borderRadius: 2,
  },
});
