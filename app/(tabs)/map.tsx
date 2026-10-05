import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';

const SAFETY_COLORS: Record<number, string> = { 90: '#10B981', 80: '#22C55E', 70: '#F59E0B', 0: '#EF4444' };

function getSafetyColor(score: number) {
  if (score >= 90) return '#10B981';
  if (score >= 80) return '#22C55E';
  if (score >= 70) return '#F59E0B';
  return '#EF4444';
}

const CITY_MARKERS = [
  { id: 1, name: 'Chennai', score: 88, lat: 13.0827, lng: 80.2707, hospitals: 'Apollo Hospital', police: 'Chennai Control Room: 044-23452320' },
  { id: 2, name: 'Hyderabad', score: 86, lat: 17.3850, lng: 78.4867, hospitals: 'NIMS Hospital', police: 'Hyderabad PCR: 040-27852425' },
  { id: 3, name: 'Mumbai', score: 82, lat: 19.0760, lng: 72.8777, hospitals: 'KEM Hospital', police: 'Mumbai Control: 022-22621855' },
  { id: 4, name: 'Tirupati', score: 89, lat: 13.6288, lng: 79.4192, hospitals: 'SVIMS Hospital', police: 'Tirupati Control: 0877-2255001' },
  { id: 5, name: 'Goa', score: 91, lat: 15.2993, lng: 74.1240, hospitals: 'Goa Medical College', police: 'Goa Control: 0832-2422500' },
  { id: 6, name: 'Delhi', score: 74, lat: 28.7041, lng: 77.1025, hospitals: 'AIIMS Delhi', police: 'Delhi Control: 011-23490000' },
  { id: 7, name: 'Bengaluru', score: 83, lat: 12.9716, lng: 77.5946, hospitals: 'Manipal Hospital', police: 'Bengaluru Control: 080-22942222' },
  { id: 8, name: 'Vizag', score: 87, lat: 17.6868, lng: 83.2185, hospitals: 'King George Hospital', police: 'Vizag Control: 0891-2543777' },
];

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [userCity, setUserCity] = useState('Detecting...');
  const [selectedMarker, setSelectedMarker] = useState<typeof CITY_MARKERS[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Location permission is required for live GPS tracking.');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setUserLocation(coords);

      // Reverse geocode
      const geo = await Location.reverseGeocodeAsync(coords);
      if (geo.length > 0) {
        setUserCity(geo[0].city || geo[0].subregion || 'Your Location');
      }

      // Animate map to user location
      mapRef.current?.animateToRegion({
        ...coords,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      }, 1000);
    } catch (e) {
      console.log('Location error:', e);
    } finally {
      setLoading(false);
    }
  };

  const callSOS = () => {
    Alert.alert('🚨 Emergency', 'Call SOS?', [
      { text: 'Cancel', style: 'cancel' },
      { text: '📞 Call 7424962369', onPress: () => Linking.openURL('tel:7424962369'), style: 'destructive' },
    ]);
  };

  const whatsappSOS = () => {
    if (!userLocation) return;
    const mapsUrl = `https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`;
    const message = `🆘 SOS ALERT! I need immediate help!\n📍 My live GPS location: ${mapsUrl}`;
    Linking.openURL(`https://wa.me/917424962369?text=${encodeURIComponent(message)}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 15.0,
          longitude: 78.0,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        customMapStyle={mapDarkStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* City Safety Markers */}
        {CITY_MARKERS.map((city) => (
          <React.Fragment key={city.id}>
            <Circle
              center={{ latitude: city.lat, longitude: city.lng }}
              radius={15000}
              fillColor={getSafetyColor(city.score) + '20'}
              strokeColor={getSafetyColor(city.score) + '80'}
              strokeWidth={1}
            />
            <Marker
              coordinate={{ latitude: city.lat, longitude: city.lng }}
              onPress={() => setSelectedMarker(city)}
            >
              <View style={[styles.markerBubble, { backgroundColor: getSafetyColor(city.score) }]}>
                <Text style={styles.markerScore}>{city.score}</Text>
                <Text style={styles.markerName}>{city.name}</Text>
              </View>
            </Marker>
          </React.Fragment>
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <Marker coordinate={userLocation}>
            <View style={styles.userMarker}>
              <View style={styles.userMarkerInner} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color="#0EA5E9" size="large" />
          <Text style={styles.loadingText}>Detecting your location...</Text>
        </View>
      )}

      {/* User Location Panel */}
      <View style={styles.locationPanel}>
        <Text style={styles.locationTitle}>📍 {userCity}</Text>
        <TouchableOpacity onPress={getLocation}>
          <Text style={styles.refreshBtn}>🎯 Locate Me</Text>
        </TouchableOpacity>
      </View>

      {/* Selected City Info */}
      {selectedMarker && (
        <View style={styles.infoPanel}>
          <View style={styles.infoPanelTop}>
            <Text style={styles.infoCityName}>{selectedMarker.name}</Text>
            <TouchableOpacity onPress={() => setSelectedMarker(null)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.scoreRow, { borderColor: getSafetyColor(selectedMarker.score) + '40' }]}>
            <Text style={[styles.scoreBig, { color: getSafetyColor(selectedMarker.score) }]}>
              {selectedMarker.score}
            </Text>
            <Text style={styles.scoreLabel}>Safety Index</Text>
          </View>
          <Text style={styles.infoItem}>🏥 {selectedMarker.hospitals}</Text>
          <Text style={styles.infoItem}>🚔 {selectedMarker.police}</Text>
        </View>
      )}

      {/* SOS Floating Button */}
      <View style={styles.sosContainer}>
        <TouchableOpacity style={styles.whatsappBtn} onPress={whatsappSOS}>
          <Text style={styles.whatsappText}>🟢</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sosBtn} onPress={callSOS}>
          <Text style={styles.sosBtnText}>SOS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const mapDarkStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0F172A' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0F172A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94A3B8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1E293B' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0EA5E9' }, { lightness: -70 }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  map: { flex: 1 },
  markerBubble: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 8, alignItems: 'center',
    minWidth: 48,
  },
  markerScore: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  markerName: { color: '#fff', fontSize: 9, marginTop: 1 },
  userMarker: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#0EA5E920', borderWidth: 2, borderColor: '#0EA5E9',
    alignItems: 'center', justifyContent: 'center',
  },
  userMarkerInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0EA5E9' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A80',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  loadingText: { color: '#94A3B8', fontSize: 14 },
  locationPanel: {
    position: 'absolute', top: 12, left: 12, right: 12,
    backgroundColor: '#1E293BF0', borderRadius: 12,
    padding: 12, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#334155',
  },
  locationTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  refreshBtn: { color: '#0EA5E9', fontSize: 13, fontWeight: '600' },
  infoPanel: {
    position: 'absolute', bottom: 100, left: 12, right: 12,
    backgroundColor: '#1E293B', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#334155', gap: 8,
  },
  infoPanelTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoCityName: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' },
  closeBtn: { color: '#64748B', fontSize: 18, padding: 4 },
  scoreRow: {
    flexDirection: 'row', alignItems: 'baseline', gap: 8,
    borderWidth: 1, borderRadius: 8, padding: 8,
  },
  scoreBig: { fontSize: 32, fontWeight: 'bold' },
  scoreLabel: { color: '#94A3B8', fontSize: 12 },
  infoItem: { color: '#CBD5E1', fontSize: 12 },
  sosContainer: {
    position: 'absolute', bottom: 24, right: 16,
    alignItems: 'center', gap: 8,
  },
  whatsappBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#166534',
    alignItems: 'center', justifyContent: 'center',
  },
  whatsappText: { fontSize: 20 },
  sosBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  sosBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
});
