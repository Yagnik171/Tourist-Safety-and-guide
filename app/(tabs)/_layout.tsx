import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, Map, Bot, Bell, ShieldAlert } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#0F172A',
          borderBottomColor: '#1E293B',
          borderBottomWidth: 1,
        },
        headerTintColor: '#F8FAFC',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#0EA5E9',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerTitle: '🛡️ SafeWander',
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Live Map',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
          headerTitle: '🗺️ Live Safety Map',
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, size }) => <Bot color={color} size={size} />,
          headerTitle: '🤖 AI Assistant',
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
          headerTitle: '📡 Safety Alerts',
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergency',
          tabBarIcon: ({ color, size }) => <ShieldAlert color={color} size={20} />,
          headerTitle: '🚨 Emergency',
          tabBarActiveTintColor: '#EF4444',
        }}
      />
    </Tabs>
  );
}
