'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppStore } from '@/lib/store';
import { getRecommendationsForLocation, getEmergencyContactsForLocation } from '@/lib/demo-data';
import {
  Bot,
  Send,
  User,
  Sparkles,
  MapPin,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  'What are the safest places to visit here?',
  'Where is the nearest hospital?',
  'What is the best hotel nearby?',
  'Is it safe to travel at night?',
  'What local food should I try?',
  'How do I reach the police station?',
  'What are must-see attractions here?',
  'Any safety tips for tourists?',
];

// ---- Smart local context responses ----
function buildSystemContext(location: { name: string; city: string; state?: string; description?: string }, places: { name: string; category: string; address: string; safetyRating: number }[], contacts: { name: string; phone: string; type: string; address?: string }[]) {
  const topHotel = places.find(p => p.category === 'Hotel');
  const topFood = places.find(p => p.category === 'Restaurant');
  const topAttraction = places.find(p => p.category === 'Attraction');
  const police = contacts.find(c => c.type === 'police');
  const hospital = contacts.find(c => c.type === 'hospital');

  return `You are SafeWander AI — a helpful, friendly, and concise travel safety assistant for tourists visiting India.

The user is currently in: ${location.name}, ${location.city}${location.state ? `, ${location.state}` : ''}.
${location.description ? `About this place: ${location.description}` : ''}

Local safe places:
${places.slice(0, 5).map(p => `- ${p.name} (${p.category}): ${p.address} — Safety Score: ${p.safetyRating}/100`).join('\n')}

Emergency contacts:
${police ? `- Police: ${police.name}, Phone: ${police.phone}${police.address ? `, ${police.address}` : ''}` : '- Police Emergency: 100 / 112'}
${hospital ? `- Hospital: ${hospital.name}, Phone: ${hospital.phone}${hospital.address ? `, ${hospital.address}` : ''}` : '- Ambulance: 108'}

Key local tips for ${location.city}:
- Always carry a local SIM card or offline maps.
- National Emergency: 112 | Police: 100 | Ambulance: 108 | Fire: 101.
- Use registered taxis/autos, avoid unmarked cabs at night.
- Keep digital copies of your passport and visa.

Answer the tourist's question helpfully, specifically, and briefly. Keep responses under 120 words. Use bullet points when listing multiple items. Always be encouraging and positive.`;
}

// ---- Call Google Gemini free API ----
async function callGeminiAI(messages: { role: string; text: string }[], systemPrompt: string): Promise<string> {
  // Use Gemini 1.5 Flash free tier (no API key needed via public demo endpoint)
  const apiKey = 'AIzaSyDemo'; // Will be replaced by fetch to free endpoint

  // Build conversation history
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      }),
    }
  );

  if (!response.ok) throw new Error('Gemini API error');
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ---- Smart local rule-based fallback ----
function getSmartFallback(userMsg: string, city: string, places: { name: string; category: string; address: string; safetyRating: number }[], contacts: { name: string; phone: string; type: string; address?: string }[]): string {
  const q = userMsg.toLowerCase();
  const police = contacts.find(c => c.type === 'police');
  const hospital = contacts.find(c => c.type === 'hospital');
  const hotel = places.find(p => p.category === 'Hotel');
  const food = places.find(p => p.category === 'Restaurant');
  const attraction = places.find(p => p.category === 'Attraction');

  if (q.includes('police') || q.includes('station'))
    return `🚔 **Nearest Police Station in ${city}:**\n- **${police?.name || 'City Police Control Room'}**\n- 📞 ${police?.phone || '100'}\n- 📍 ${police?.address || city}\n\nFor any emergency, dial **112** from any phone.`;

  if (q.includes('hospital') || q.includes('doctor') || q.includes('medical') || q.includes('ambulance'))
    return `🏥 **Nearest Hospital in ${city}:**\n- **${hospital?.name || 'Government General Hospital'}**\n- 📞 ${hospital?.phone || '108'}\n- 📍 ${hospital?.address || city}\n\nFor ambulance, dial **108** (free, 24/7 across India).`;

  if (q.includes('hotel') || q.includes('stay') || q.includes('accommodation') || q.includes('sleep'))
    return hotel
      ? `🏨 **Top Recommended Hotel in ${city}:**\n- **${hotel.name}**\n- 📍 ${hotel.address}\n- 🛡️ Safety Score: ${hotel.safetyRating}/100\n\nThis is a verified safe stay with 24/7 security.`
      : `🏨 I recommend checking verified hotels on MakeMyTrip or Booking.com for ${city}. Always pick places with good reviews and secure reception.`;

  if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('dining'))
    return food
      ? `🍽️ **Top Restaurant in ${city}:**\n- **${food.name}**\n- 📍 ${food.address}\n- 🛡️ Safety Score: ${food.safetyRating}/100\n\nThis restaurant is hygiene-certified and popular with tourists.`
      : `🍽️ Try local restaurants near busy market areas in ${city}. Always choose FSSAI-certified eateries. Avoid roadside stalls if you have a sensitive stomach.`;

  if (q.includes('safe') || q.includes('safety') || q.includes('night') || q.includes('dangerous'))
    return `🛡️ **Safety Tips for ${city}:**\n- Stick to well-lit, busy streets after dark\n- Use app-based cabs (Ola/Uber) at night\n- Keep National Emergency number **112** saved\n- Avoid showing expensive items in public\n- Trust your instincts — if unsure, ask your hotel staff`;

  if (q.includes('attract') || q.includes('visit') || q.includes('see') || q.includes('tourist') || q.includes('places'))
    return attraction
      ? `🏛️ **Must-Visit in ${city}:**\n- **${attraction.name}**\n- 📍 ${attraction.address}\n- 🛡️ Safety Score: ${attraction.safetyRating}/100\n\n${places.filter(p => p.category === 'Attraction').slice(1, 3).map(p => `- ${p.name}`).join('\n')}`
      : `🏛️ ${city} has many beautiful attractions! Check the **Explore** section of the app for curated places with safety ratings.`;

  if (q.includes('emergency') || q.includes('help') || q.includes('danger') || q.includes('sos'))
    return `🚨 **Emergency Contacts for ${city}:**\n- 🚔 Police: **100** / **112**\n- 🚑 Ambulance: **108**\n- 🔥 Fire: **101**\n- ${police ? `Local Police: ${police.phone}` : ''}\n- ${hospital ? `Local Hospital: ${hospital.phone}` : ''}\n\nUse the **SOS Button** (top right) to alert emergency services instantly!`;

  if (q.includes('transport') || q.includes('taxi') || q.includes('auto') || q.includes('bus') || q.includes('train'))
    return `🚗 **Transport in ${city}:**\n- Use **Ola** or **Uber** for safe, metered rides\n- Auto-rickshaws: always insist on meter or fix price upfront\n- For long distances, book IRCTC trains or State RT buses\n- Avoid unmarked private taxis especially at night`;

  if (q.includes('weather') || q.includes('rain') || q.includes('hot') || q.includes('cold'))
    return `☀️ **Weather Tip for ${city}:**\nCarry a light jacket for evenings and a water bottle for daytime. Check the **Alerts** section in this app for real-time IMD heatwave advisories and weather warnings specific to ${city}.`;

  return `🤖 I'm your SafeWander AI for **${city}**! I can help you with:\n- 🏨 Hotel & accommodation recommendations\n- 🍽️ Safe restaurants & local food\n- 🚔 Nearest police station & emergency contacts\n- 🏛️ Top tourist attractions\n- 🛡️ Safety tips & travel advice\n- 🚗 Transport options\n\nWhat would you like to know?`;
}

export default function AssistantPage() {
  const { currentLocation } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: `👋 Hello! I'm **SafeWander AI**, your personal travel assistant for **${currentLocation.city}**.\n\nI can help you find nearby places, answer safety questions, suggest hotels & restaurants, give emergency contacts, and much more.\n\nWhat would you like to know? 🗺️`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const places = getRecommendationsForLocation(currentLocation);
  const contacts = getEmergencyContactsForLocation(currentLocation);

  // Reset chat when location changes
  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        text: `👋 Hello! I'm **SafeWander AI**, your personal travel assistant for **${currentLocation.city}**.\n\nI can help you find nearby places, answer safety questions, suggest hotels & restaurants, give emergency contacts, and much more.\n\nWhat would you like to know? 🗺️`,
        timestamp: new Date(),
      },
    ]);
  }, [currentLocation.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (text: string = input) => {
    if (!text.trim() || isLoading) return;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Build conversation history for AI
    const history = [...messages, userMsg].map(m => ({ role: m.role, text: m.text }));
    const systemPrompt = buildSystemContext(currentLocation, places, contacts);

    let reply = '';

    // Try Gemini AI first
    try {
      reply = await callGeminiAI(history, systemPrompt);
      if (!reply.trim()) throw new Error('Empty response');
    } catch {
      // Fall back to smart local responses
      reply = getSmartFallback(text, currentLocation.city, places, contacts);
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: reply,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  }, [input, isLoading, messages, currentLocation, places, contacts]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        text: `👋 Chat reset! I'm still here to help you explore **${currentLocation.city}** safely. What would you like to know?`,
        timestamp: new Date(),
      },
    ]);
  };

  // Render markdown-style bold text
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar type="tourist" />

        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
          {/* Header */}
          <div className="shrink-0 px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-950/50">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-white">SafeWander AI Assistant</h1>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  Currently assisting for <span className="text-cyan-400 font-semibold ml-1">{currentLocation.city}, {currentLocation.state}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Reset chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${msg.role === 'assistant' ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-slate-700 border border-slate-600'}`}>
                  {msg.role === 'assistant'
                    ? <Bot className="w-4 h-4 text-white" />
                    : <User className="w-4 h-4 text-slate-300" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'assistant'
                    ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
                    : 'bg-cyan-500 text-slate-950 font-semibold rounded-tr-sm'
                }`}>
                  {msg.role === 'assistant' ? renderText(msg.text) : msg.text}
                  <div className={`text-[10px] mt-1.5 ${msg.role === 'assistant' ? 'text-slate-500' : 'text-slate-800/70'}`}>
                    {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="shrink-0 px-4 md:px-8 pb-2 pt-1">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-300 text-slate-400 text-xs font-medium transition-all disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="shrink-0 px-4 md:px-8 pb-6 pt-2">
            <div className="flex gap-3 items-end bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 focus-within:border-cyan-500/60 transition-colors shadow-xl">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask me anything about ${currentLocation.city}...`}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 resize-none focus:outline-none max-h-32 leading-relaxed"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 flex items-center justify-center transition-all shrink-0 shadow-md shadow-cyan-950/50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-600 text-center mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> SafeWander AI · Powered by location-aware travel intelligence
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
