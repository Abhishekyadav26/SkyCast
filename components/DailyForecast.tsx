import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import DailyRow from './DailyRow';
import { getDailyForecast } from '../utils/weatherHelpers';
import { BlurView } from 'expo-blur';

interface DailyForecastProps {
  forecastList: any[];
}

export default function DailyForecast({ forecastList }: DailyForecastProps) {
  const daily = getDailyForecast(forecastList);

  // Calculate overall min/max for consistent bar scaling across all rows
  const allTemps = daily.flatMap(d => [d.minTemp, d.maxTemp]);
  const overallMin = Math.min(...allTemps);
  const overallMax = Math.max(...allTemps);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Next 7 Days</Text>
      <BlurView intensity={15} tint="light" style={styles.card}>
        {daily.map((item, index) => (
          <DailyRow
            key={item.dt}
            item={item}
            index={index}
            overallMin={overallMin}
            overallMax={overallMax}
          />
        ))}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.whiteAlpha80,
    marginBottom: 14,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.whiteAlpha20,
  },
});
