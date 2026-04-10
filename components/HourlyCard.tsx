import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS } from '../constants/theme';
import { getWeatherIcon, formatTime } from '../utils/weatherHelpers';
import dayjs from 'dayjs';

interface HourlyCardProps {
  item: any;
  index: number;
  isNight: boolean;
}

export default function HourlyCard({ item, index, isNight }: HourlyCardProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(30);

  useEffect(() => {
    // Stagger each card sliding in from the right
    opacity.value = withDelay(index * 80, withSpring(1));
    translateX.value = withDelay(
      index * 80,
      withSpring(0, { damping: 14, stiffness: 100 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const isNow = index === 0;
  const icon = getWeatherIcon(item.weather[0].id, isNight);
  const time = isNow ? 'Now' : dayjs.unix(item.dt).format('h A');

  return (
    <Animated.View style={animStyle}>
      <BlurView
        intensity={15}
        tint="light"
        style={[styles.card, isNow && styles.cardActive]}
      >
        <Text style={[styles.time, isNow && styles.timeActive]}>{time}</Text>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.temp}>
          {Math.round(item.main.temp)}°
        </Text>
        {item.pop > 0 && (
          <Text style={styles.rain}>
            {Math.round(item.pop * 100)}%
          </Text>
        )}
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.whiteAlpha20,
    minWidth: 72,
    gap: 6,
  },
  cardActive: {
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  time: {
    fontSize: 12,
    color: COLORS.whiteAlpha60,
    fontWeight: '500',
  },
  timeActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 24,
  },
  temp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  rain: {
    fontSize: 10,
    color: COLORS.whiteAlpha60,
  },
});
