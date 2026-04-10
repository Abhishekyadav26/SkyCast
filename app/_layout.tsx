import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WeatherProvider } from "../utils/WeatherContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WeatherProvider>
        <StatusBar
          barStyle="light-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <Stack screenOptions={{ headerShown: false as any }} />
      </WeatherProvider>
    </GestureHandlerRootView>
  );
}
