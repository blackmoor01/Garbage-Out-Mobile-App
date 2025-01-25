import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // This hides the header for all screens
      }}
    />
  );
}
