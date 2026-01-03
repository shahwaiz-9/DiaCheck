import { UserProvider } from "@/context/UserContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    "FunnelDisplay-Regular": require("../assets/fonts/FunnelDisplay-Regular.ttf"),
    "FunnelDisplay-Bold": require("../assets/fonts/FunnelDisplay-Bold.ttf"),
    "FunnelDisplay-SemiBold": require("../assets/fonts/FunnelDisplay-SemiBold.ttf"),
    "FunnelDisplay-Medium": require("../assets/fonts/FunnelDisplay-Medium.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: colorScheme === "dark" ? "#000" : "#F2F2F7",
            }}
          >
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                gestureEnabled: true,
                animationTypeForReplace: "push",
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="patient/[id]"
                options={{ title: "Patient" }}
              />
              <Stack.Screen
                name="patient/testInput"
                options={{ title: "Test Input" }}
              />
              <Stack.Screen
                name="patient/insight"
                options={{ title: "Insight" }}
              />
              <Stack.Screen name="results" options={{ title: "Test Result" }} />
            </Stack>
            <StatusBar style="auto" />
          </SafeAreaView>
        </ThemeProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
