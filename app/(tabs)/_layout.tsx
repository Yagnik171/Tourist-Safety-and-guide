import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, color, size }: { name: IoniconName; color: string; size: number }) {
  return <Ionicons name={name} size={size} color={color} />;
}

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
          tabBarIcon: ({ color, size }) => <TabIcon name="shield-checkmark" color={color} size={size} />,
          headerTitle: '🛡️ SafeWander',
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Live Map',
          tabBarIcon: ({ color, size }) => <TabIcon name="map" color={color} size={size} />,
          headerTitle: '🗺️ Live Safety Map',
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, size }) => <TabIcon name="chatbubble-ellipses" color={color} size={size} />,
          headerTitle: '🤖 AI Assistant',
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <TabIcon name="notifications" color={color} size={size} />,
          headerTitle: '📡 Safety Alerts',
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergency',
          tabBarIcon: ({ color, size }) => <TabIcon name="warning" color={color} size={size} />,
          headerTitle: '🚨 Emergency',
          tabBarActiveTintColor: '#EF4444',
        }}
      />
    </Tabs>
  );
}
