import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import HourlyCard from './HourlyCard';
import { getHourlyForecast } from '../utils/weatherHelpers';

interface HourlyForecastProps {
  forecastList: any[];
  isNight: boolean;
}

export default function HourlyForecast({ forecastList, isNight }: HourlyForecastProps) {
  const hourly = getHourlyForecast(forecastList);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Today's Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourly.map((item, index) => (
          <HourlyCard
            key={item.dt}
            item={item}
            index={index}
            isNight={isNight}
          />
        ))}
      </ScrollView>
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
  scrollContent: {
    paddingRight: SIZES.padding,
  },
});
