import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── City Knowledge Base ─────────────────────────────────────────────────────
const CITIES: Record<string, {
  cafes: string[]; restaurants: string[]; hotels: string[];
  attractions: string[]; police: string; hospital: string;
}> = {
  tirupati: {
    cafes: ['Café Coffee Day', 'Mocha House', 'Sri Devi Coffee', 'Bean Here Cafe', 'Tirupati Bakehouse'],
    restaurants: ['Bhimas Restaurant', 'Srinivasam Hotel', 'Minerva Coffee Shop', 'Maya Restaurant', 'Grand Restaurant'],
    hotels: ['Hotel Bliss', 'Marasa Sarovar Premiere', 'Hotel Annapoorna', 'Leela Mahal', 'Hotel Mayura'],
    attractions: ['Tirumala Venkateswara Temple', 'Silathoranam', 'Sri Padmavathi Temple', 'Kapila Theertham', 'Chandragiri Fort'],
    police: 'Tirupati Control: 0877-2255001',
    hospital: 'SVIMS Hospital: 0877-2287777',
  },
  chennai: {
    cafes: ['Amethyst Cafe', 'Chamiers Cafe', 'Brew Room', 'Cask', 'The Patio'],
    restaurants: ['Saravana Bhavan', 'Anjappar', 'Buhari Hotel', 'Palmshore Hotel', 'Junior Kuppanna'],
    hotels: ['Taj Coromandel', 'ITC Grand Chola', 'The Leela Palace', 'Hilton Chennai', 'The Park Chennai'],
    attractions: ['Marina Beach', 'Kapaleeshwarar Temple', 'Fort St. George', 'Arignar Anna Zoo', 'Valluvar Kottam'],
    police: 'Chennai Control: 044-23452320',
    hospital: 'Rajiv Gandhi GH: 044-25305000',
  },
  vizag: {
    cafes: ['Cafe Coffee Day RK Beach', 'Nostalgiq Cafe', 'Coffee Talk', 'Brew & Bite', 'Soi Cafe'],
    restaurants: ['Hotel Meghalaya', 'Sea Inn Restaurant', 'Dharani Restaurant', 'Dwaraka Hotel', 'Bamboo Garden'],
    hotels: ['The Park Visakhapatnam', 'The Novotel Visakhapatnam', 'Hotel Daspalla', 'Green Park Hotel', 'Fortune Murali Park'],
    attractions: ['RK Beach', 'Kailasagiri', 'Submarine Museum', 'Simhachalam Temple', 'Araku Valley'],
    police: 'Vizag Control: 0891-2543777',
    hospital: 'King George Hospital: 0891-2564891',
  },
  hyderabad: {
    cafes: ['The Black Window Cafe', 'Lamakaan', 'Cafe Bahar', 'Pulla Reddy Cafe', 'Infinitea'],
    restaurants: ['Paradise Biryani', 'Bawarchi', 'Ohris Restaurant', 'Chutneys', 'Jewel of Nizam'],
    hotels: ['ITC Kohinoor', 'Taj Falaknuma Palace', 'Novotel Hyderabad', 'Park Hyatt', 'Radisson Blu'],
    attractions: ['Charminar', 'Golconda Fort', 'Hussain Sagar', 'Birla Mandir', 'Ramoji Film City'],
    police: 'Hyderabad PCR: 040-27852425',
    hospital: 'NIMS Hospital: 040-23320312',
  },
  mumbai: {
    cafes: ['Cafe Mondegar', 'Prithvi Theatre Cafe', 'The Pantry', 'Koinonia Coffee', 'Starbucks Marine Lines'],
    restaurants: ['Trishna', 'Britannia & Co.', 'Leopold Cafe', 'Khyber', 'Bade Miya'],
    hotels: ['Taj Mahal Palace', 'The Oberoi Mumbai', 'Hotel Marine Plaza', 'Trident Nariman Point', 'St. Regis Mumbai'],
    attractions: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Chhatrapati Shivaji Terminus', 'Juhu Beach'],
    police: 'Mumbai Control: 022-22621855',
    hospital: 'KEM Hospital: 022-24107000',
  },
  goa: {
    cafes: ['Panjim Inn Cafe', 'Bean Me Up', 'Cafe Tato', 'Infantaria Pastry Shop', 'Art Chamber Cafe'],
    restaurants: ["Fisherman's Wharf", 'Vinayak Family Restaurant', "Britto's", 'Ritz Classic', "Martin's Corner"],
    hotels: ['Taj Exotica Resort', 'Grand Hyatt Goa', 'The Leela Goa', 'Alila Diwa Goa', 'Cidade de Goa'],
    attractions: ['Baga Beach', 'Basilica of Bom Jesus', 'Calangute Beach', 'Dudhsagar Falls', 'Fort Aguada'],
    police: 'Goa Control: 0832-2422500',
    hospital: 'Goa Medical College: 0832-2458700',
  },
};

// ─── City Extractor ───────────────────────────────────────────────────────────
function extractCity(q: string): string | null {
  const aliases: Record<string, string> = {
    vizag: 'vizag', visakhapatnam: 'vizag',
    tirupati: 'tirupati',
    chennai: 'chennai', madras: 'chennai',
    hyderabad: 'hyderabad', hyd: 'hyderabad',
    mumbai: 'mumbai', bombay: 'mumbai',
    goa: 'goa',
  };
  for (const [alias, city] of Object.entries(aliases)) {
    if (q.toLowerCase().includes(alias)) return city;
  }
  return null;
}

// ─── Local Response Builder ───────────────────────────────────────────────────
function buildLocalResponse(query: string): string | null {
  const q = query.toLowerCase();
  const city = extractCity(q);
  const data = city ? CITIES[city] : null;
  const cityLabel = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';

  if (data) {
    if (q.includes('cafe') || q.includes('coffee') || q.includes('tea') || q.includes('bakery')) {
      return `☕ **Top Cafes in ${cityLabel}:**\n\n${data.cafes.map((c, i) => `${i + 1}. ${c}`).join('\n')}`;
    }
    if (q.includes('hotel') || q.includes('stay') || q.includes('resort') || q.includes('lodge')) {
      return `🏨 **Top Safe Hotels in ${cityLabel}:**\n\n${data.hotels.map((h, i) => `${i + 1}. ${h}`).join('\n')}`;
    }
    if (q.includes('restaurant') || q.includes('food') || q.includes('eat') || q.includes('biryani') || q.includes('dine')) {
      return `🍽️ **Top Restaurants in ${cityLabel}:**\n\n${data.restaurants.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
    }
    if (q.includes('place') || q.includes('visit') || q.includes('attraction') || q.includes('see') || q.includes('go')) {
      return `🏛️ **Top Attractions in ${cityLabel}:**\n\n${data.attractions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
    }
    if (q.includes('police') || q.includes('sos') || q.includes('emergency') || q.includes('hospital') || q.includes('doctor')) {
      return `🚨 **Emergency Contacts in ${cityLabel}:**\n\n🚔 ${data.police}\n🏥 ${data.hospital}\n\n📞 National Emergency: **112**`;
    }
  }

  // General fallback responses
  if (q.includes('joke')) return '😄 Why do programmers prefer dark mode?\n\nBecause light attracts bugs! 🐛';
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) return '👋 Hi there! I\'m SafeWander AI. Ask me about cafes, hotels, places to visit, or emergency contacts in any city!';
  if (q.includes('sos') || q.includes('help me') || q.includes('emergency')) return '🚨 **EMERGENCY**: Call **7424962369** immediately!\n\nOr call:\n• Police: **100**\n• Ambulance: **108**\n• National Emergency: **112**\n• Tourist Helpline: **1363**';
  if (q.includes('safe')) return '🛡️ SafeWander tracks live safety scores across 20+ Indian cities. Check the Map tab for real-time safety zones!';

  return null;
}

// ─── Gemini REST API call (works in React Native without SDK) ─────────────────
async function callGemini(text: string): Promise<string> {
  const API_KEY = 'AIzaSyDemo_REPLACE_WITH_REAL_KEY'; // Replace with your Gemini API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are SafeWander AI, a helpful Indian travel safety and general assistant. Be concise, friendly, and use emojis. Answer in 2-4 sentences max. User says: ${text}`
        }]
      }]
    }),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not get a response. Please try again!';
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  'Cafes in Tirupati 🍵',
  'Best places in Goa 🏖️',
  'Hotels in Hyderabad 🏨',
  'Emergency in Chennai 🚨',
  'Tell me a joke 😄',
  'Restaurants in Vizag 🍽️',
];

// ─── Screen Component ─────────────────────────────────────────────────────────
export default function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '0',
    role: 'assistant',
    text: '👋 Hi! I\'m SafeWander AI — your intelligent travel companion!\n\nI can help you find:\n• 🏛️ Top places to visit\n• ☕ Best cafes & restaurants\n• 🏨 Safe hotels\n• 🚨 Emergency contacts\n• 💬 Jokes, general questions & more!',
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const addMessage = (role: 'user' | 'assistant', text: string) => {
    const msg: Message = { id: Date.now().toString(), role, text, timestamp: new Date() };
    setMessages(prev => [...prev, msg]);
    return msg;
  };

  const sendMessage = async (text: string = input) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput('');

    addMessage('user', trimmed);
    setLoading(true);

    try {
      // 1) Try local knowledge base first (instant, offline)
      const localResp = buildLocalResponse(trimmed);
      if (localResp) {
        setTimeout(() => addMessage('assistant', localResp), 300);
        setLoading(false);
        return;
      }
      // 2) Fall back to Gemini REST API
      const reply = await callGemini(trimmed);
      addMessage('assistant', reply);
    } catch {
      addMessage('assistant', '⚠️ Connection issue. Please check your internet and try again!');
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={88}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              {item.role === 'assistant' && <Text style={styles.botLabel}>🤖 SafeWander AI</Text>}
              <Text style={[styles.bubbleText, item.role === 'user' ? styles.userText : styles.aiText]}>
                {item.text}
              </Text>
              <Text style={styles.timestamp}>
                {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          )}
          ListFooterComponent={loading ? (
            <View style={[styles.bubble, styles.aiBubble]}>
              <ActivityIndicator color="#0EA5E9" size="small" />
              <Text style={styles.typingText}>SafeWander AI is thinking...</Text>
            </View>
          ) : null}
        />

        {/* Quick Prompts */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScroll}>
          {QUICK_PROMPTS.map(p => (
            <TouchableOpacity key={p} style={styles.chip} onPress={() => sendMessage(p)}>
              <Text style={styles.chipText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything about travel, safety, cafes..."
            placeholderTextColor="#64748B"
            multiline
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  messageList: { padding: 16, gap: 10, paddingBottom: 8 },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16, gap: 4 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#0EA5E9', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', borderBottomLeftRadius: 4 },
  botLabel: { color: '#0EA5E9', fontSize: 10, fontWeight: '700', marginBottom: 2 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  userText: { color: '#FFFFFF' },
  aiText: { color: '#E2E8F0' },
  timestamp: { color: '#64748B', fontSize: 10, alignSelf: 'flex-end' },
  typingText: { color: '#64748B', fontSize: 13, marginTop: 4 },
  quickScroll: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  chip: { backgroundColor: '#1E293B', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: '#334155' },
  chipText: { color: '#94A3B8', fontSize: 12 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#1E293B', backgroundColor: '#0F172A' },
  input: { flex: 1, backgroundColor: '#1E293B', borderRadius: 20, borderWidth: 1, borderColor: '#334155', paddingHorizontal: 16, paddingVertical: 10, color: '#F8FAFC', fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0EA5E9', alignItems: 'center', justifyContent: 'center' },
  sendDisabled: { backgroundColor: '#334155' },
  sendIcon: { color: '#fff', fontSize: 16 },
});
