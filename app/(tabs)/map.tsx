import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const EMERGENCY_NUMBER = '7424962369';

interface CityData {
  id: number;
  name: string;
  score: number;
  lat: number;
  lng: number;
  hospitals: string;
  police: string;
  policePhone: string;
  hospitalPhone: string;
}

const CITY_MARKERS: CityData[] = [
  { id: 1, name: 'Chennai', score: 88, lat: 13.0827, lng: 80.2707, hospitals: 'Apollo Hospital & Rajiv Gandhi GH', police: 'Chennai Control Room: 044-23452320', policePhone: '04423452320', hospitalPhone: '04425305000' },
  { id: 2, name: 'Hyderabad', score: 86, lat: 17.3850, lng: 78.4867, hospitals: 'NIMS & Yashoda Hospital', police: 'Hyderabad PCR: 040-27852425', policePhone: '04027852425', hospitalPhone: '04023320312' },
  { id: 3, name: 'Mumbai', score: 82, lat: 19.0760, lng: 72.8777, hospitals: 'KEM & Lilavati Hospital', police: 'Mumbai Control: 022-22621855', policePhone: '02222621855', hospitalPhone: '02224107000' },
  { id: 4, name: 'Tirupati', score: 89, lat: 13.6288, lng: 79.4192, hospitals: 'SVIMS & BIRRD Hospital', police: 'Tirupati Control: 0877-2255001', policePhone: '08772255001', hospitalPhone: '08772287777' },
  { id: 5, name: 'Goa', score: 91, lat: 15.2993, lng: 74.1240, hospitals: 'Goa Medical College Bambolim', police: 'Goa Police Control: 0832-2422500', policePhone: '08322422500', hospitalPhone: '08322458700' },
  { id: 6, name: 'Delhi', score: 74, lat: 28.7041, lng: 77.1025, hospitals: 'AIIMS & Safdarjung Hospital', police: 'Delhi Police Control: 011-23490000', policePhone: '01123490000', hospitalPhone: '01126588500' },
  { id: 7, name: 'Bengaluru', score: 83, lat: 12.9716, lng: 77.5946, hospitals: 'Manipal & Victoria Hospital', police: 'Bengaluru Command: 080-22942222', policePhone: '08022942222', hospitalPhone: '08025024444' },
  { id: 8, name: 'Vizag', score: 87, lat: 17.6868, lng: 83.2185, hospitals: 'King George Hospital & Care', police: 'Vizag Police Control: 0891-2543777', policePhone: '08912543777', hospitalPhone: '08912564891' },
];

function getSafetyColor(score: number) {
  if (score >= 90) return '#10B981';
  if (score >= 80) return '#22C55E';
  if (score >= 70) return '#F59E0B';
  return '#EF4444';
}

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userCity, setUserCity] = useState('Detecting GPS...');
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setUserCity('Location Access Denied');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = { lat: loc.coords.latitude, lng: loc.coords.longitude };
      setUserLocation(coords);

      const geo = await Location.reverseGeocodeAsync({
        latitude: coords.lat,
        longitude: coords.lng,
      });
      if (geo.length > 0) {
        setUserCity(geo[0].city || geo[0].subregion || 'Current Location');
      }

      // Center map on user
      if (webViewRef.current) {
        const js = `
          if (window.centerOnUser) {
            window.centerOnUser(${coords.lat}, ${coords.lng});
          }
        `;
        webViewRef.current.injectJavaScript(js);
      }
    } catch (e) {
      console.log('Location detection error:', e);
      setUserCity('India (Default View)');
    } finally {
      setLoading(false);
    }
  };

  const callSOS = () => {
    Alert.alert(
      '🚨 Emergency SOS',
      `Directly call emergency responder at +91 ${EMERGENCY_NUMBER}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '📞 Call Now', onPress: () => Linking.openURL(`tel:${EMERGENCY_NUMBER}`), style: 'destructive' },
      ]
    );
  };

  const whatsappSOS = () => {
    const mapsLink = userLocation ? `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}` : 'GPS Locating';
    const text = `🚨 *EMERGENCY SOS ALERT!*\nNeed immediate help!\n📍 *My Live GPS Location:* ${mapsLink}\nCity: ${userCity}`;
    Linking.openURL(`https://wa.me/91${EMERGENCY_NUMBER}?text=${encodeURIComponent(text)}`);
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'city_click') {
        const found = CITY_MARKERS.find(c => c.id === data.id);
        if (found) setSelectedCity(found);
      }
    } catch (e) {}
  };

  // Generate self-contained HTML with Leaflet & CartoDB Dark Matter tiles
  const leafletHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #0F172A; }
        .radar-pin {
          width: 22px; height: 22px; border-radius: 50%;
          background: #0EA5E9; border: 3px solid #FFFFFF;
          box-shadow: 0 0 16px #0EA5E9; animation: pulse 1.8s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 15px rgba(14, 165, 233, 0); }
          100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
        }
        .city-label {
          background: #1E293B; color: #F8FAFC; border: 1px solid #334155;
          padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 11px;
          text-align: center; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var initialLat = ${userLocation ? userLocation.lat : 18.0};
        var initialLng = ${userLocation ? userLocation.lng : 79.0};
        var map = L.map('map', { zoomControl: false }).setView([initialLat, initialLng], ${userLocation ? 10 : 5});

        // Dark theme OpenStreetMap tiles via CartoDB Dark Matter
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(map);

        var cities = ${JSON.stringify(CITY_MARKERS)};

        cities.forEach(function(c) {
          var color = c.score >= 90 ? '#10B981' : (c.score >= 80 ? '#22C55E' : (c.score >= 70 ? '#F59E0B' : '#EF4444'));

          // Safety radius circle
          L.circle([c.lat, c.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.18,
            radius: 20000
          }).addTo(map);

          // Marker icon
          var icon = L.divIcon({
            className: '',
            html: '<div class="city-label" style="border-left: 3px solid ' + color + ';">' +
                  c.name + ' <span style="color:' + color + ';">' + c.score + '</span></div>',
            iconSize: [80, 24],
            iconAnchor: [40, 12]
          });

          var marker = L.marker([c.lat, c.lng], { icon: icon }).addTo(map);
          marker.on('click', function() {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'city_click', id: c.id }));
            }
          });
        });

        // User live location pin
        var userMarker = null;
        window.centerOnUser = function(lat, lng) {
          if (userMarker) map.removeLayer(userMarker);
          var userIcon = L.divIcon({
            className: 'radar-pin',
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });
          userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
          map.setView([lat, lng], 11);
        };

        ${userLocation ? `window.centerOnUser(${userLocation.lat}, ${userLocation.lng});` : ''}
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Top Location Bar */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveLabel}>LIVE GPS RADAR</Text>
          </View>
          <Text style={styles.cityName}>📍 {userCity}</Text>
        </View>
        <TouchableOpacity style={styles.locateBtn} onPress={getLocation} disabled={loading}>
          <Ionicons name={"locate" as any} color="#0EA5E9" size={20} />
        </TouchableOpacity>
      </View>

      {/* Interactive Map View */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: leafletHtml }}
          style={styles.webView}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.mapLoading}>
              <ActivityIndicator color="#0EA5E9" size="large" />
              <Text style={styles.loadingText}>Initializing Safe Radar Map...</Text>
            </View>
          )}
        />
      </View>

      {/* Selected City Detail Bottom Sheet */}
      {selectedCity && (
        <View style={styles.citySheet}>
          <View style={styles.sheetTop}>
            <View>
              <Text style={styles.sheetCity}>{selectedCity.name}</Text>
              <Text style={styles.sheetSubtitle}>Verified Regional Safety Hub</Text>
            </View>
            <View style={[styles.sheetBadge, { backgroundColor: getSafetyColor(selectedCity.score) + '20', borderColor: getSafetyColor(selectedCity.score) }]}>
              <Text style={[styles.sheetScore, { color: getSafetyColor(selectedCity.score) }]}>{selectedCity.score}</Text>
              <Text style={[styles.sheetScoreLabel, { color: getSafetyColor(selectedCity.score) }]}>SAFETY INDEX</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedCity(null)} style={styles.closeBtn}>
              <Ionicons name={"close" as any} color="#64748B" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.contactRow}>
            <TouchableOpacity
              style={[styles.contactCard, { borderColor: '#EF4444' }]}
              onPress={() => Linking.openURL(`tel:${selectedCity.hospitalPhone}`)}
            >
              <Ionicons name={"medkit" as any} color="#EF4444" size={18} />
              <View style={{ flex: 1 }}>
                <Text style={styles.contactTitle}>Emergency Hospital</Text>
                <Text style={styles.contactDesc} numberOfLines={1}>{selectedCity.hospitals}</Text>
              </View>
              <Ionicons name={"call" as any} color="#EF4444" size={16} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactCard, { borderColor: '#0EA5E9' }]}
              onPress={() => Linking.openURL(`tel:${selectedCity.policePhone}`)}
            >
              <Ionicons name={"shield" as any} color="#0EA5E9" size={18} />
              <View style={{ flex: 1 }}>
                <Text style={styles.contactTitle}>City Police Dispatch</Text>
                <Text style={styles.contactDesc} numberOfLines={1}>{selectedCity.police}</Text>
              </View>
              <Ionicons name={"call" as any} color="#0EA5E9" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Floating SOS Controls */}
      <View style={styles.sosFloating}>
        <TouchableOpacity style={styles.whatsappFab} onPress={whatsappSOS}>
          <Ionicons name={"logo-whatsapp" as any} color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sosFab} onPress={callSOS}>
          <Text style={styles.sosFabText}>SOS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  topBar: {
    paddingHorizontal: 16, paddingVertical: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#0F172A', borderBottomWidth: 1, borderBottomColor: '#1E293B',
  },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  liveLabel: { color: '#10B981', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  cityName: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold', marginTop: 2 },
  locateBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155',
    alignItems: 'center', justifyContent: 'center',
  },
  mapContainer: { flex: 1, backgroundColor: '#0F172A' },
  webView: { flex: 1, backgroundColor: '#0F172A' },
  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    justifyContent: 'center', alignItems: 'center', gap: 12,
  },
  loadingText: { color: '#94A3B8', fontSize: 13 },
  citySheet: {
    position: 'absolute', bottom: 16, left: 16, right: 16,
    backgroundColor: '#1E293BF8', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#334155', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 10, elevation: 12,
  },
  sheetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetCity: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' },
  sheetSubtitle: { color: '#64748B', fontSize: 11 },
  sheetBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    borderWidth: 1, alignItems: 'center',
  },
  sheetScore: { fontSize: 16, fontWeight: '900' },
  sheetScoreLabel: { fontSize: 7, fontWeight: '800' },
  closeBtn: { padding: 4 },
  contactRow: { gap: 8 },
  contactCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 10, borderRadius: 10, backgroundColor: '#0F172A',
    borderWidth: 1,
  },
  contactTitle: { color: '#F8FAFC', fontSize: 12, fontWeight: 'bold' },
  contactDesc: { color: '#94A3B8', fontSize: 11 },
  sosFloating: {
    position: 'absolute', bottom: 20, right: 16,
    alignItems: 'center', gap: 10,
  },
  whatsappFab: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#166534',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#166534', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
  sosFab: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#EF4444',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6, shadowRadius: 12, elevation: 10,
  },
  sosFabText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
});
