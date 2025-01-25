import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "./OnBoardingScreen";
import PhoneNumberEntry from "./PhoneNumberEntry";
import VerifyCodeScreen from "./OTPEntry";
import NameEntryScreen from "./NameEntryField";

const Stack = createStackNavigator();

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate some async tasks like loading fonts or data
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        // Hide the splash screen once the app is ready
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    // Optionally, return null or a custom loader if desired
    return null;
  }
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="PhoneNumberEntry" component={PhoneNumberEntry} />
      <Stack.Screen name="VerifyCodeScreen" component={VerifyCodeScreen}/>
      <Stack.Screen name="NameEntryScreen" component={NameEntryScreen}/>
    </Stack.Navigator>
  );
}
