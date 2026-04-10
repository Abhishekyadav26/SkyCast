import * as Haptics from 'expo-haptics';

// Light tap - for selecting items, toggling
export const lightTap = (): Promise<void> =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium tap - for confirming actions
export const mediumTap = (): Promise<void> =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Success - for completing an action
export const successTap = (): Promise<void> =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Error - for failed actions
export const errorTap = (): Promise<void> =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
