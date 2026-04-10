import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS } from '../constants/theme';
import { getWeatherIcon } from '../utils/weatherHelpers';

interface SearchResultCardProps {
  weather: any;
  onSelect: () => void;
}

export default function SearchResultCard({ weather, onSelect }: SearchResultCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(0, { damping: 14 });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const icon = getWeatherIcon(weather.weather[0].id);

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
        <BlurView intensity={20} tint="dark" style={styles.card}>
          <View style={styles.left}>
            <Text style={styles.icon}>{icon}</Text>
            <View>
              <Text style={styles.city}>{weather.name}</Text>
              <Text style={styles.country}>
                {weather.sys.country} · {weather.weather[0].description}
              </Text>
            </View>
          </View>
          <Text style={styles.temp}>
            {Math.round(weather.main.temp)}°
          </Text>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.whiteAlpha20,
    marginBottom: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: { fontSize: 28 },
  city: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  country: {
    fontSize: 13,
    color: COLORS.whiteAlpha60,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  temp: {
    fontSize: 28,
    fontWeight: '200',
    color: COLORS.white,
  },
});
