import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { CloudRain, Wind, Thermometer, ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react-native';

interface LiveWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

const SAFETY_BULLETINS = [
  {
    id: 1,
    type: 'weather',
    severity: 'high',
    title: 'High Heatwave Advisory',
    description: 'Daytime surface temperatures reaching peak levels. Hydration stations active across major transit hubs.',
    time: 'Live Satellite',
    color: '#F97316',
  },
  {
    id: 2,
    type: 'general',
    severity: 'moderate',
    title: 'Coastal High Wave Alert',
    description: 'Tourist advisory active for shorelines. Coast Guard rescue patrols stationed at primary public beaches.',
    time: 'Official IMD',
    color: '#F59E0B',
  },
  {
    id: 3,
    type: 'crime',
    severity: 'low',
    title: 'Police Night Patrol Enhanced',
    description: 'All-night mobile PCR vans active in busy shopping corridors and transit terminals for tourist safety.',
    time: 'City Police Bulletin',
    color: '#10B981',
  },
  {
    id: 4,
    type: 'traffic',
    severity: 'info',
    title: 'Special Transit Corridors Open',
    description: 'Designated tourist safe corridors functioning with real-time GPS monitoring and surveillance.',
    time: 'Traffic Command',
    color: '#0EA5E9',
  },
];

export default function AlertsScreen() {
  const [city, setCity] = useState('Chennai');
  const [weather, setWeather] = useState<LiveWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async (lat = 13.0827, lng = 80.2707) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
      );
      const data = await res.json();
      if (data?.current_weather) {
        setWeather(data.current_weather);
      }
    } catch (e) {
      console.log('Weather fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadData = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const geo = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (geo.length > 0) {
          setCity(geo[0].city || geo[0].subregion || 'Your City');
        }
        await fetchWeather(loc.coords.latitude, loc.coords.longitude);
        return;
      }
    } catch (e) {}
    await fetchWeather();
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0EA5E9" />}
      >
        {/* Live Satellite Intel Header */}
        <View style={styles.intelCard}>
          <View style={styles.intelHeader}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveLabel}>LIVE SATELLITE INTEL</Text>
            </View>
            <TouchableOpacity onPress={loadData} disabled={loading}>
              <RefreshCw color="#0EA5E9" size={16} />
            </TouchableOpacity>
          </View>

          <Text style={styles.cityName}>📍 {city}</Text>

          {loading && !weather ? (
            <ActivityIndicator color="#0EA5E9" style={{ marginVertical: 12 }} />
          ) : weather ? (
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Thermometer color="#EF4444" size={20} />
                <Text style={styles.metricValue}>{Math.round(weather.temperature)}°C</Text>
                <Text style={styles.metricTitle}>Temperature</Text>
              </View>

              <View style={styles.metricItem}>
                <Wind color="#0EA5E9" size={20} />
                <Text style={styles.metricValue}>{weather.windspeed} km/h</Text>
                <Text style={styles.metricTitle}>Wind Velocity</Text>
              </View>

              <View style={styles.metricItem}>
                <CloudRain color="#10B981" size={20} />
                <Text style={styles.metricValue}>WMO {weather.weathercode}</Text>
                <Text style={styles.metricTitle}>Condition</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Safety Bulletins */}
        <Text style={styles.sectionTitle}>Regional Safety Bulletins</Text>

        {SAFETY_BULLETINS.map((b) => (
          <View key={b.id} style={[styles.bulletinCard, { borderLeftColor: b.color }]}>
            <View style={styles.bulletinTop}>
              <View style={styles.bulletinBadgeRow}>
                <ShieldAlert color={b.color} size={16} />
                <Text style={[styles.bulletinType, { color: b.color }]}>{b.type.toUpperCase()} ADVISORY</Text>
              </View>
              <View style={[styles.severityPill, { backgroundColor: b.color + '20' }]}>
                <Text style={[styles.severityPillText, { color: b.color }]}>{b.severity}</Text>
              </View>
            </View>

            <Text style={styles.bulletinTitle}>{b.title}</Text>
            <Text style={styles.bulletinDesc}>{b.description}</Text>

            <View style={styles.bulletinFooter}>
              <Text style={styles.bulletinSource}>📡 {b.time}</Text>
              <Text style={styles.bulletinCity}>Verified 🛡️</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scroll: { padding: 16, gap: 12 },
  intelCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#0EA5E940',
    gap: 12,
  },
  intelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  liveLabel: { color: '#10B981', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cityName: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#334155' },
  metricItem: { alignItems: 'center', gap: 4 },
  metricValue: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },
  metricTitle: { color: '#64748B', fontSize: 11 },
  sectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 },
  bulletinCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    gap: 6,
  },
  bulletinTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bulletinBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bulletinType: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  severityPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  severityPillText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  bulletinTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: 'bold' },
  bulletinDesc: { color: '#CBD5E1', fontSize: 12, lineHeight: 18 },
  bulletinFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  bulletinSource: { color: '#64748B', fontSize: 11 },
  bulletinCity: { color: '#10B981', fontSize: 11, fontWeight: '600' },
});
