import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ 
            title: "Pawplay Feeder", 
            headerShown: false,
            orientation: "default",
            gestureEnabled: false, // Prevenir gestos accidentales
          }}
        />
      </Stack>
      <StatusBar 
        style="light" 
        hidden={Platform.OS === 'android'} 
        backgroundColor="transparent"
        translucent
      />
    </>
  );
}
