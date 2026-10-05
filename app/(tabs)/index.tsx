import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Linking, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { ShieldCheck, Map, Bot, Bell, Phone, Navigation, Star } from 'lucide-react-native';

const SAFETY_DATA: Record<string, { score: number; status: string; color: string }> = {
  'Chennai': { score: 88, status: 'High Safety', color: '#10B981' },
  'Mumbai': { score: 82, status: 'High Safety', color: '#10B981' },
  'Delhi': { score: 74, status: 'Moderate', color: '#F59E0B' },
  'Goa': { score: 91, status: 'High Safety', color: '#10B981' },
  'Hyderabad': { score: 86, status: 'High Safety', color: '#10B981' },
  'Tirupati': { score: 89, status: 'High Safety', color: '#10B981' },
  'Bengaluru': { score: 83, status: 'High Safety', color: '#10B981' },
  'Vizag': { score: 87, status: 'High Safety', color: '#10B981' },
  'Kolkata': { score: 78, status: 'Moderate', color: '#F59E0B' },
  'Jaipur': { score: 80, status: 'Moderate', color: '#F59E0B' },
};

export default function DashboardScreen() {
  const [city, setCity] = useState('Chennai');
  const [safetyScore, setSafetyScore] = useState(88);
  const [safetyStatus, setSafetyStatus] = useState('High Safety');
  const [safetyColor, setSafetyColor] = useState('#10B981');
  const [refreshing, setRefreshing] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    detectLocation();
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const detectLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geo.length > 0) {
        const detectedCity = geo[0].city || geo[0].subregion || 'Chennai';
        const found = Object.keys(SAFETY_DATA).find(c =>
          detectedCity.toLowerCase().includes(c.toLowerCase())
        );
        const targetCity = found || 'Chennai';
        setCity(targetCity);
        setSafetyScore(SAFETY_DATA[targetCity].score);
        setSafetyStatus(SAFETY_DATA[targetCity].status);
        setSafetyColor(SAFETY_DATA[targetCity].color);
      }
    } catch (e) {}
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await detectLocation();
    setRefreshing(false);
  };

  const callSOS = () => {
    Alert.alert(
      '🚨 SOS Emergency',
      'Call emergency contact now?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '📞 Call 7424962369', onPress: () => Linking.openURL('tel:7424962369'), style: 'destructive' },
      ]
    );
  };

  const quickActions = [
    { title: 'Live Map', icon: Map, color: '#0EA5E9', route: '/(tabs)/map' },
    { title: 'AI Assistant', icon: Bot, color: '#8B5CF6', route: '/(tabs)/assistant' },
    { title: 'Alerts', icon: Bell, color: '#F59E0B', route: '/(tabs)/alerts' },
    { title: 'Safe Route', icon: Navigation, color: '#10B981', route: '/routes' },
  ];

  const recentAlerts = [
    { type: 'Weather', title: 'Heavy Rain Advisory', city: city, severity: 'moderate', color: '#F59E0B' },
    { type: 'Safety', title: 'Coastal Area Caution', city: city, severity: 'low', color: '#10B981' },
    { type: 'Traffic', title: 'Road Congestion Alert', city: city, severity: 'info', color: '#0EA5E9' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0EA5E9" />}
      >
        {/* Hero Safety Card */}
        <View style={[styles.heroCard, { borderColor: safetyColor + '60' }]}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.cityText}>📍 {city}</Text>
              <Text style={styles.timeText}>{time}</Text>
            </View>
            <View style={[styles.scoreBadge, { backgroundColor: safetyColor + '20', borderColor: safetyColor }]}>
              <ShieldCheck color={safetyColor} size={20} />
              <Text style={[styles.scoreText, { color: safetyColor }]}>{safetyScore}</Text>
            </View>
          </View>
          <Text style={[styles.safetyStatus, { color: safetyColor }]}>
            ● {safetyStatus}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${safetyScore}%` as any, backgroundColor: safetyColor }]} />
          </View>
          <Text style={styles.progressLabel}>Safety Index: {safetyScore}/100</Text>
        </View>

        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton} onPress={callSOS}>
          <Text style={styles.sosText}>🚨 EMERGENCY SOS</Text>
          <Text style={styles.sosSubtext}>Tap to call 7424962369</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.title}
              style={[styles.quickCard, { borderColor: action.color + '40' }]}
              onPress={() => router.push(action.route as any)}
            >
              <action.icon color={action.color} size={24} />
              <Text style={[styles.quickLabel, { color: action.color }]}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Alerts */}
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        {recentAlerts.map((alert, idx) => (
          <View key={idx} style={[styles.alertCard, { borderLeftColor: alert.color }]}>
            <View style={styles.alertTop}>
              <Text style={[styles.alertType, { color: alert.color }]}>{alert.type.toUpperCase()}</Text>
              <View style={[styles.severityBadge, { backgroundColor: alert.color + '20' }]}>
                <Text style={[styles.severityText, { color: alert.color }]}>{alert.severity}</Text>
              </View>
            </View>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <Text style={styles.alertCity}>📍 {alert.city}</Text>
          </View>
        ))}

        {/* Top Cities */}
        <Text style={styles.sectionTitle}>Safe Destinations</Text>
        {Object.entries(SAFETY_DATA).slice(0, 5).map(([c, data]) => (
          <View key={c} style={styles.cityRow}>
            <View style={styles.cityInfo}>
              <Star color={data.color} size={14} fill={data.color} />
              <Text style={styles.cityRowName}>{c}</Text>
            </View>
            <View style={[styles.cityScore, { backgroundColor: data.color + '20' }]}>
              <Text style={[styles.cityScoreText, { color: data.color }]}>{data.score}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scroll: { padding: 16, gap: 12 },
  heroCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    gap: 8,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cityText: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' },
  timeText: { color: '#64748B', fontSize: 12, marginTop: 2 },
  scoreBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 999, borderWidth: 1,
  },
  scoreText: { fontSize: 18, fontWeight: 'bold' },
  safetyStatus: { fontSize: 13, fontWeight: '600' },
  progressBar: { height: 6, backgroundColor: '#334155', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  progressLabel: { color: '#64748B', fontSize: 11 },
  sosButton: {
    backgroundColor: '#EF4444',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  sosText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  sosSubtext: { color: '#FCA5A5', fontSize: 12, marginTop: 2 },
  sectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 8 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: '#1E293B',
    borderRadius: 12, borderWidth: 1,
    padding: 16, alignItems: 'center', gap: 8,
  },
  quickLabel: { fontSize: 12, fontWeight: '600' },
  alertCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12, padding: 14,
    borderLeftWidth: 3, gap: 4,
  },
  alertTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  alertType: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  severityText: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  alertTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  alertCity: { color: '#64748B', fontSize: 11 },
  cityRow: {
    backgroundColor: '#1E293B', borderRadius: 10, padding: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cityInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cityRowName: { color: '#F8FAFC', fontSize: 14, fontWeight: '500' },
  cityScore: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  cityScoreText: { fontSize: 13, fontWeight: 'bold' },
});
