import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { errorTap } from '../utils/haptics';

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  const iconScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useEffect(() => {
    errorTap();
    iconScale.value = withSpring(1, { damping: 8, stiffness: 80 });
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    buttonTranslateY.value = withDelay(
      500,
      withSpring(0, { damping: 14 })
    );
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonTranslateY.value }],
    opacity: contentOpacity.value,
  }));

  return (
    <View style={styles.container}>

      <Animated.Text style={[styles.icon, iconStyle]}>
        ?
      </Animated.Text>

      <Animated.View style={contentStyle}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>

      <Animated.View style={buttonStyle}>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            errorTap();
            onRetry();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  icon: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: COLORS.whiteAlpha60,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: COLORS.whiteAlpha20,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.whiteAlpha20,
    marginTop: 8,
  },
  retryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
