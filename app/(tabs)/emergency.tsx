import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Phone, MessageSquare, AlertTriangle, ShieldCheck, MapPin, Hospital, Shield } from 'lucide-react-native';

const EMERGENCY_NUMBER = '7424962369';

export default function EmergencyScreen() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('Detecting GPS location...');

  useEffect(() => {
    getGPS();
  }, []);

  const getGPS = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        const geo = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (geo.length > 0) {
          const g = geo[0];
          setAddress(`${g.name || ''}, ${g.city || g.subregion || ''}, ${g.region || ''}`);
        }
      }
    } catch (e) {
      setAddress('Location unavailable');
    }
  };

  const directCall = () => {
    Alert.alert(
      '🚨 Call Emergency Contact',
      `Directly call +91 ${EMERGENCY_NUMBER}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => Linking.openURL(`tel:${EMERGENCY_NUMBER}`), style: 'destructive' },
      ]
    );
  };

  const whatsappSOS = () => {
    const mapsLink = coords ? `https://maps.google.com/?q=${coords.lat},${coords.lng}` : 'GPS pending';
    const text = `🚨 *EMERGENCY SOS ALERT!*\nI need immediate assistance!\n📍 *My Live GPS Location:* ${mapsLink}\nAddress: ${address}`;
    Linking.openURL(`https://wa.me/91${EMERGENCY_NUMBER}?text=${encodeURIComponent(text)}`);
  };

  const sendSMS = () => {
    const mapsLink = coords ? `https://maps.google.com/?q=${coords.lat},${coords.lng}` : '';
    const text = `EMERGENCY SOS: I need help! My GPS: ${mapsLink} (${address})`;
    Linking.openURL(`sms:${EMERGENCY_NUMBER}?body=${encodeURIComponent(text)}`);
  };

  const call112 = () => {
    Alert.alert(
      '👮 National Emergency 112',
      'Connect to National Emergency Services (Police, Fire, Ambulance)?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Dial 112', onPress: () => Linking.openURL('tel:112'), style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Massive SOS Button */}
        <TouchableOpacity style={styles.sosHuge} onPress={directCall} activeOpacity={0.8}>
          <AlertTriangle color="#FFFFFF" size={44} />
          <Text style={styles.sosHugeTitle}>SOS EMERGENCY</Text>
          <Text style={styles.sosHugeSub}>TAP TO CALL +91 {EMERGENCY_NUMBER}</Text>
        </TouchableOpacity>

        {/* Live GPS Card */}
        <View style={styles.gpsCard}>
          <View style={styles.gpsHeader}>
            <MapPin color="#0EA5E9" size={18} />
            <Text style={styles.gpsTitle}>CURRENT GPS DISPATCH COORDINATES</Text>
          </View>
          <Text style={styles.gpsCoords}>
            {coords ? `${coords.lat.toFixed(5)}° N, ${coords.lng.toFixed(5)}° E` : 'Acquiring GPS...'}
          </Text>
          <Text style={styles.gpsAddress}>{address}</Text>
        </View>

        {/* Action Buttons */}
        <Text style={styles.sectionTitle}>Instant Dispatch Channels</Text>

        <TouchableOpacity style={[styles.channelBtn, { backgroundColor: '#166534' }]} onPress={whatsappSOS}>
          <MessageSquare color="#FFFFFF" size={20} />
          <View style={{ flex: 1 }}>
            <Text style={styles.channelTitle}>WhatsApp SOS with Live Google Pin</Text>
            <Text style={styles.channelSub}>Sends instant location link to +91 {EMERGENCY_NUMBER}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.channelBtn, { backgroundColor: '#1E293B', borderColor: '#0EA5E9', borderWidth: 1 }]} onPress={sendSMS}>
          <Phone color="#0EA5E9" size={20} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.channelTitle, { color: '#0EA5E9' }]}>Direct SMS Alert</Text>
            <Text style={styles.channelSub}>Broadcasts SMS payload to +91 {EMERGENCY_NUMBER}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.channelBtn, { backgroundColor: '#B91C1C' }]} onPress={call112}>
          <Shield color="#FFFFFF" size={20} />
          <View style={{ flex: 1 }}>
            <Text style={styles.channelTitle}>Call National Emergency (112)</Text>
            <Text style={styles.channelSub}>Police, Ambulance, and Fire Control</Text>
          </View>
        </TouchableOpacity>

        {/* Local Emergency Helplines */}
        <Text style={styles.sectionTitle}>Government Emergency Hotlines</Text>

        <View style={styles.helplineList}>
          <TouchableOpacity style={styles.helplineItem} onPress={() => Linking.openURL('tel:100')}>
            <ShieldCheck color="#0EA5E9" size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.helplineName}>Police Control Room</Text>
              <Text style={styles.helplineNum}>Dial 100</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helplineItem} onPress={() => Linking.openURL('tel:108')}>
            <Hospital color="#EF4444" size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.helplineName}>24/7 Ambulance Dispatch</Text>
              <Text style={styles.helplineNum}>Dial 108</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helplineItem} onPress={() => Linking.openURL('tel:1091')}>
            <ShieldCheck color="#EC4899" size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.helplineName}>Women Helpline</Text>
              <Text style={styles.helplineNum}>Dial 1091</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.helplineItem} onPress={() => Linking.openURL('tel:1363')}>
            <ShieldCheck color="#F59E0B" size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.helplineName}>Tourist Helpline India</Text>
              <Text style={styles.helplineNum}>Dial 1363</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  scroll: { padding: 16, gap: 14 },
  sosHuge: {
    backgroundColor: '#DC2626',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  sosHugeTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  sosHugeSub: { color: '#FCA5A5', fontSize: 13, fontWeight: '700' },
  gpsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  gpsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  gpsTitle: { color: '#0EA5E9', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  gpsCoords: { color: '#F8FAFC', fontSize: 15, fontWeight: 'bold' },
  gpsAddress: { color: '#94A3B8', fontSize: 12 },
  sectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  channelBtn: {
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  channelTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  channelSub: { color: '#E2E8F0', fontSize: 11, opacity: 0.8 },
  helplineList: { backgroundColor: '#1E293B', borderRadius: 14, overflow: 'hidden' },
  helplineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  helplineName: { color: '#F8FAFC', fontSize: 14, fontWeight: '600' },
  helplineNum: { color: '#64748B', fontSize: 12 },
});
