import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0F172A',
          },
          headerTintColor: '#F8FAFC',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#0EA5E9',
          },
          contentStyle: {
            backgroundColor: '#0F172A',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="routes"
          options={{
            title: '🛣️ Safe Route Navigation',
            presentation: 'card',
          }}
        />
      </Stack>
    </>
  );
}
