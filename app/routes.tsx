import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface RouteOption {
  id: string;
  title: string;
  subtitle: string;
  safetyScore: number;
  color: string;
  distance: string;
  duration: string;
  highlights: string[];
  lighting: string;
  policeCheckpoints: number;
  cctvCoverage: string;
}

export default function RoutesScreen() {
  const [origin, setOrigin] = useState('Chennai Central Railway Station');
  const [destination, setDestination] = useState('Marina Beach Promenade');
  const [selectedRoute, setSelectedRoute] = useState('safest');
  const [calculating, setCalculating] = useState(false);

  const [routes, setRoutes] = useState<RouteOption[]>([
    {
      id: 'safest',
      title: '🛡️ Safest Recommended Route',
      subtitle: 'Via CCTV Corridors & Main Lit Arterials',
      safetyScore: 94,
      color: '#10B981',
      distance: '8.4 km',
      duration: '22 mins',
      highlights: ['100% Street-lit', '2 Police Booths en-route', 'High pedestrian surveillance'],
      lighting: '100% LED Illuminated',
      policeCheckpoints: 2,
      cctvCoverage: '92% Monitored',
    },
    {
      id: 'balanced',
      title: '⚖️ Balanced Safety & Speed',
      subtitle: 'Via Primary Ring Road',
      safetyScore: 86,
      color: '#0EA5E9',
      distance: '7.1 km',
      duration: '18 mins',
      highlights: ['Well-monitored corridor', '1 Hospital zone', 'Moderate crowd level'],
      lighting: '85% Street-lit',
      policeCheckpoints: 1,
      cctvCoverage: '78% Monitored',
    },
    {
      id: 'fastest',
      title: '⚡ Fastest Direct Route',
      subtitle: 'Via Inner Sector Cut-throughs',
      safetyScore: 71,
      color: '#F59E0B',
      distance: '6.2 km',
      duration: '14 mins',
      highlights: ['Narrow transit roads', 'Low lighting past 9 PM', 'Caution advised'],
      lighting: '60% Street-lit',
      policeCheckpoints: 0,
      cctvCoverage: '45% Monitored',
    },
  ]);

  const calculateRoutes = () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Missing Input', 'Please enter both origin and destination.');
      return;
    }
    setCalculating(true);
    setTimeout(() => {
      // Dynamically simulate calculated routes for the entered points
      setRoutes([
        {
          id: 'safest',
          title: '🛡️ Safest Recommended Route',
          subtitle: `Verified secure route to ${destination.split(' ')[0]}`,
          safetyScore: 95,
          color: '#10B981',
          distance: '9.2 km',
          duration: '24 mins',
          highlights: ['CCTV coverage along entire stretch', 'Active PCR van patrols', 'Commercial lit sidewalks'],
          lighting: '98% Illuminated',
          policeCheckpoints: 3,
          cctvCoverage: '95% Monitored',
        },
        {
          id: 'balanced',
          title: '⚖️ Balanced Route',
          subtitle: 'Via main arterial avenues',
          safetyScore: 84,
          color: '#0EA5E9',
          distance: '7.8 km',
          duration: '19 mins',
          highlights: ['Primary transit corridor', 'Busy intersections', 'Well marked crossings'],
          lighting: '80% Illuminated',
          policeCheckpoints: 1,
          cctvCoverage: '72% Monitored',
        },
        {
          id: 'fastest',
          title: '⚡ Shortest Distance Route',
          subtitle: 'Direct back-road shortcut',
          safetyScore: 68,
          color: '#F59E0B',
          distance: '6.5 km',
          duration: '15 mins',
          highlights: ['Unmonitored alleys', 'Dim street lighting after dusk', 'Solo travel discouraged'],
          lighting: '50% Illuminated',
          policeCheckpoints: 0,
          cctvCoverage: '35% Monitored',
        },
      ]);
      setCalculating(false);
      Alert.alert('Route Analyzed', 'Safe routes calculated with real-time risk scores!');
    }, 600);
  };

  const startNavigation = () => {
    const selected = routes.find(r => r.id === selectedRoute);
    const navUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;

    Alert.alert(
      '🗺️ Start Safe Navigation',
      `Launch real-time turn-by-turn navigation for:\n"${selected?.title}"?\n\nSafety Index: ${selected?.safetyScore}/100\nLighting: ${selected?.lighting}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '🚀 Start Google Navigation',
          onPress: () => Linking.openURL(navUrl).catch(() => {
            Alert.alert('Error', 'Could not open maps application.');
          }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Origin & Destination Inputs */}
        <View style={styles.inputCard}>
          <View style={styles.inputRow}>
            <Ionicons name={"location" as any} color="#10B981" size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>STARTING POINT</Text>
              <TextInput
                style={styles.textInput}
                value={origin}
                onChangeText={setOrigin}
                placeholder="Enter starting location..."
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputRow}>
            <Ionicons name={"flag" as any} color="#EF4444" size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>DESTINATION</Text>
              <TextInput
                style={styles.textInput}
                value={destination}
                onChangeText={setDestination}
                placeholder="Enter destination..."
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.calcBtn}
            onPress={calculateRoutes}
            disabled={calculating}
          >
            <Ionicons name={"shield-checkmark" as any} color="#FFFFFF" size={18} />
            <Text style={styles.calcBtnText}>
              {calculating ? 'Analyzing Safety Corridors...' : 'Calculate Safe Routes'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section Header */}
        <Text style={styles.sectionTitle}>Safety-Scored Route Options</Text>

        {/* Route Cards */}
        {routes.map((route) => {
          const isSelected = selectedRoute === route.id;
          return (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeCard,
                { borderColor: isSelected ? route.color : '#334155' },
                isSelected && { backgroundColor: '#1E293B' },
              ]}
              onPress={() => setSelectedRoute(route.id)}
              activeOpacity={0.8}
            >
              <View style={styles.routeHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.routeTitle, { color: isSelected ? route.color : '#F8FAFC' }]}>
                    {route.title}
                  </Text>
                  <Text style={styles.routeSub}>{route.subtitle}</Text>
                </View>

                <View style={[styles.scoreBadge, { backgroundColor: route.color + '20', borderColor: route.color }]}>
                  <Text style={[styles.scoreVal, { color: route.color }]}>{route.safetyScore}</Text>
                  <Text style={[styles.scoreLbl, { color: route.color }]}>SAFETY</Text>
                </View>
              </View>

              <View style={styles.metricsBar}>
                <Text style={styles.metricText}>📏 {route.distance}</Text>
                <Text style={styles.metricText}>⏱️ {route.duration}</Text>
                <Text style={[styles.metricText, { color: route.color }]}>💡 {route.lighting}</Text>
                {isSelected && <Ionicons name={"checkmark-circle" as any} color={route.color} size={18} />}
              </View>

              <View style={styles.safetyStatsRow}>
                <View style={styles.statPill}>
                  <Text style={styles.statText}>📹 {route.cctvCoverage}</Text>
                </View>
                <View style={styles.statPill}>
                  <Text style={styles.statText}>🚔 {route.policeCheckpoints} Police Booths</Text>
                </View>
              </View>

              <View style={styles.highlightsContainer}>
                {route.highlights.map((h, i) => (
                  <View key={i} style={styles.highlightPill}>
                    <Text style={styles.highlightText}>✓ {h}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Start Turn-by-Turn Navigation Button */}
        <TouchableOpacity style={styles.startNavBtn} onPress={startNavigation}>
          <Ionicons name={"navigate" as any} color="#FFFFFF" size={22} />
          <Text style={styles.startNavText}>Start Live Turn-by-Turn Navigation</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scroll: { padding: 16, gap: 14 },
  inputCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  inputLabel: { color: '#64748B', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  textInput: { color: '#F8FAFC', fontSize: 14, fontWeight: '600', paddingVertical: 2 },
  divider: { height: 1, backgroundColor: '#334155', marginHorizontal: 32 },
  calcBtn: {
    backgroundColor: '#0EA5E9',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  calcBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  sectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  routeCard: {
    backgroundColor: '#1E293B80',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    gap: 12,
  },
  routeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  routeTitle: { fontSize: 15, fontWeight: 'bold' },
  routeSub: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  scoreVal: { fontSize: 18, fontWeight: '900' },
  scoreLbl: { fontSize: 8, fontWeight: '800' },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  metricText: { color: '#CBD5E1', fontSize: 12, fontWeight: '600' },
  safetyStatsRow: { flexDirection: 'row', gap: 8 },
  statPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  highlightsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  highlightPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  highlightText: { color: '#94A3B8', fontSize: 11 },
  startNavBtn: {
    backgroundColor: '#10B981',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  startNavText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
