import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/colors";
import { Image, StyleSheet, View, Text, Platform } from "react-native";
import { LOGO_URL } from "@/constants/logo";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

// Fix for debugging overlay registry error
if (Platform.OS !== 'web') {
  // Safely handle potential debugging registry issues
  const ReactNative = require('react-native');
  if (ReactNative.DevSettings) {
    // Ensure DevSettings is properly initialized
    try {
      ReactNative.DevSettings.reload = ReactNative.DevSettings.reload || (() => console.log('Reload not available'));
    } catch (e) {
      console.warn('Failed to setup DevSettings:', e);
    }
  }
}

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RootLayoutNav />
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: colors.card,
            height: Platform.OS === 'ios' ? 64 : 56, // Adjusted height for different platforms
          },
          headerShadowVisible: false,
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: '600',
            color: colors.text,
            fontSize: Platform.OS === 'ios' ? 18 : 16, // Adjusted font size for different platforms
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerTitle: ({ children }) => {
            // Always show logo with title
            return (
              <View style={styles.headerTitleContainer}>
                <Image source={{ uri: LOGO_URL }} style={styles.logo} />
                {children ? (
                  <>
                    <View style={[styles.titleSeparator, { backgroundColor: colors.gray[300] }]} />
                    <Text style={[styles.headerText, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
                      {children}
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.headerText, { color: colors.text }]}>SimplePro</Text>
                )}
              </View>
            );
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="jobs/[id]" options={{ title: "Job Details" }} />
        <Stack.Screen name="quotes/[id]" options={{ title: "Quote Details" }} />
        <Stack.Screen name="customers/[id]" options={{ title: "Customer Details" }} />
        <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
        <Stack.Screen name="help" options={{ title: "Help & Support" }} />
        <Stack.Screen name="profile/billing" options={{ title: "Billing & Subscription" }} />
        <Stack.Screen name="profile/payment-methods" options={{ title: "Payment Methods" }} />
        <Stack.Screen name="profile/payment-methods/add" options={{ title: "Add Payment Method" }} />
        <Stack.Screen name="profile/billing/history" options={{ title: "Billing History" }} />
        <Stack.Screen name="profile/billing/upgrade" options={{ title: "Upgrade Plan" }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '80%', // Prevent title from overflowing
  },
  headerText: {
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    fontWeight: '700',
    flexShrink: 1, // Allow text to shrink if needed
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  titleSeparator: {
    width: 1,
    height: 16,
    marginHorizontal: 8,
  },
});