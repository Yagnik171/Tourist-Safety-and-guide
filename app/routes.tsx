import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, Zap, Navigation, MapPin, CheckCircle2 } from 'lucide-react-native';

const DEMO_ROUTES = [
  {
    id: 'safest',
    title: '🛡️ Safest Recommended Route',
    subtitle: 'Via CCTV Corridors & Main Lit Arterials',
    safetyScore: 94,
    color: '#10B981',
    distance: '8.4 km',
    duration: '22 mins',
    highlights: ['100% Street-lit', '2 Police Booths en-route', 'High pedestrian activity'],
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
  },
];

export default function RoutesScreen() {
  const [origin, setOrigin] = useState('Central Railway Terminal');
  const [destination, setDestination] = useState('Marina Beach Promenade');
  const [selectedRoute, setSelectedRoute] = useState('safest');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Route Planner Card */}
        <View style={styles.inputCard}>
          <View style={styles.inputRow}>
            <MapPin color="#10B981" size={18} />
            <TextInput
              style={styles.textInput}
              value={origin}
              onChangeText={setOrigin}
              placeholder="Origin..."
              placeholderTextColor="#64748B"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputRow}>
            <MapPin color="#EF4444" size={18} />
            <TextInput
              style={styles.textInput}
              value={destination}
              onChangeText={setDestination}
              placeholder="Destination..."
              placeholderTextColor="#64748B"
            />
          </View>
        </View>

        {/* Section Header */}
        <Text style={styles.sectionTitle}>Calculated Route Options</Text>

        {/* Route Cards */}
        {DEMO_ROUTES.map((route) => {
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
                  <Text style={[styles.scoreLbl, { color: route.color }]}>INDEX</Text>
                </View>
              </View>

              <View style={styles.metricsBar}>
                <Text style={styles.metricText}>📏 {route.distance}</Text>
                <Text style={styles.metricText}>⏱️ {route.duration}</Text>
                {isSelected && <CheckCircle2 color={route.color} size={16} />}
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

        {/* Start Navigation Button */}
        <TouchableOpacity style={styles.startNavBtn}>
          <Navigation color="#FFFFFF" size={20} />
          <Text style={styles.startNavText}>Start Turn-by-Turn Safe Navigation</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
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
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  textInput: { flex: 1, color: '#F8FAFC', fontSize: 14, paddingVertical: 4 },
  divider: { height: 1, backgroundColor: '#334155', marginHorizontal: 28 },
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
    gap: 16,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  metricText: { color: '#CBD5E1', fontSize: 13, fontWeight: '600' },
  highlightsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  highlightPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  highlightText: { color: '#94A3B8', fontSize: 11 },
  startNavBtn: {
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  startNavText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
