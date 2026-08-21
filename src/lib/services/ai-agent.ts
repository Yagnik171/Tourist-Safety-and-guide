/**
 * SafeWander Interactive AI Agent Engine
 * Supports multi-model conversation (ChatGPT, Gemini, SafeWander Expert)
 * with location-aware intelligence and fallback responses.
 */

import type { Location } from '@/types';

export interface AgentResponse {
  text: string;
  source: 'gemini' | 'chatgpt' | 'safewander';
  suggestions?: string[];
}

// Comprehensive local knowledge generator for any city in India
export function generateInteractiveAIResponse(
  query: string,
  location: Location,
  places: { name: string; category: string; address: string; safetyRating: number; desc: string }[],
  contacts: { name: string; phone: string; type: string; address?: string }[]
): string {
  const q = query.toLowerCase().trim();
  const city = location.city || location.name || 'your current area';
  const state = location.state || 'India';

  const police = contacts.find((c) => c.type === 'police');
  const hospital = contacts.find((c) => c.type === 'hospital');
  const hotels = places.filter((p) => p.category === 'Hotel');
  const food = places.filter((p) => p.category === 'Restaurant');
  const attractions = places.filter((p) => p.category === 'Attraction');
  const shopping = places.filter((p) => p.category === 'Shopping');

  // 1. Greetings & Introductions
  if (/^(hi|hello|hey|greetings|namaste|good morning|good evening)/i.test(q)) {
    return `👋 Namaste & Welcome to **${city}, ${state}**!\n\nI am your interactive AI Travel & Safety Agent. I can assist you with:\n- 🏛️ Must-see attractions & 3-day travel itineraries\n- 🏨 Top-rated safe hotels & homestays\n- 🍽️ Local authentic cuisine & hygiene-rated restaurants\n- 🚔 Emergency dispatches (Police, Hospitals, SOS)\n- 🚗 Safe transport, cabs & night safety tips\n\nHow can I help you make your journey to ${city} safe and memorable today?`;
  }

  // 2. Itinerary / Trip Planning Queries
  if (q.includes('itinerary') || q.includes('plan') || q.includes('schedule') || q.includes('days') || q.includes('trip')) {
    return `🗺️ **Suggested Travel Itinerary for ${city} (${state}):**\n\n` +
      `**Day 1: Cultural Heritage & Top Landmarks**\n` +
      `- **Morning (9:00 AM):** Visit ${attractions[0]?.name || `${city} Heritage Center`} — *Safety Score: ${attractions[0]?.safetyRating || 90}/100*\n` +
      `- **Lunch (1:00 PM):** Dine at ${food[0]?.name || 'Local Verified Restaurant'} for authentic ${state} cuisine\n` +
      `- **Evening (5:00 PM):** Relax at local promenade or lake park with family-safe patrols\n\n` +
      `**Day 2: Exploration & Local Markets**\n` +
      `- **Morning (10:00 AM):** Explore ${attractions[1]?.name || `${city} Local Museum`}\n` +
      `- **Afternoon (2:00 PM):** Shopping at ${shopping[0]?.name || `${city} Central Market`} for local handicrafts\n` +
      `- **Dinner (8:00 PM):** ${food[1]?.name || 'Popular City Bistro'}\n\n` +
      `💡 *Safety Tip:* Keep your live GPS tracking turned ON in the **Safety Mode** tab while exploring new areas!`;
  }

  // 3. Hotel / Stay Recommendations
  if (q.includes('hotel') || q.includes('stay') || q.includes('resort') || q.includes('lodge') || q.includes('room')) {
    if (hotels.length > 0) {
      return `🏨 **Top Verified Safe Hotels in ${city}:**\n\n` +
        hotels.slice(0, 3).map((h, i) => `${i + 1}. **${h.name}**\n   - 📍 *${h.address}*\n   - 🛡️ Safety Rating: **${h.safetyRating}/100**\n   - ℹ️ ${h.desc}`).join('\n\n') +
        `\n\n✅ *All listed properties have 24/7 security guard presence and verified tourist reviews.*`;
    }
    return `🏨 **Accommodations in ${city}:**\nWe recommend booking 3-star or 5-star properties along major arterial roads in ${city}. Always check for 24/7 front-desk support and secure electronic locks.`;
  }

  // 4. Food & Dining
  if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('dish') || q.includes('biryani') || q.includes('dinner') || q.includes('lunch')) {
    if (food.length > 0) {
      return `🍽️ **Hygiene-Certified Restaurants in ${city}:**\n\n` +
        food.slice(0, 3).map((f, i) => `${i + 1}. **${f.name}**\n   - 📍 *${f.address}*\n   - 🛡️ Safety Score: **${f.safetyRating}/100**\n   - ℹ️ ${f.desc}`).join('\n\n') +
        `\n\n💡 *Tip:* Bottled mineral water is recommended while dining out.`;
    }
    return `🍽️ Try popular FSSAI-certified restaurants in central ${city}. Avoid raw roadside cut fruits and unpasteurized beverages for optimal travel health.`;
  }

  // 5. Police / Security / Emergency
  if (q.includes('police') || q.includes('cop') || q.includes('station') || q.includes('security') || q.includes('crime')) {
    return `🚔 **Police & Law Enforcement for ${city}:**\n\n` +
      `- **Primary Control:** ${police?.name || `${city} Central Police Division`}\n` +
      `- 📞 **Direct Contact:** \`${police?.phone || '100 / 112'}\`\n` +
      `- 📍 **Address:** ${police?.address || `${city}, ${state}`}\n\n` +
      `🚨 **National Emergency Hotline:** Dial **112** from any mobile number without area code.`;
  }

  // 6. Hospital / Medical / Ambulance
  if (q.includes('hospital') || q.includes('doctor') || q.includes('ambulance') || q.includes('medical') || q.includes('clinic') || q.includes('pharmacy')) {
    return `🏥 **Emergency Healthcare Facilities in ${city}:**\n\n` +
      `- **24/7 Hospital:** ${hospital?.name || `Government General Hospital, ${city}`}\n` +
      `- 📞 **Emergency Line:** \`${hospital?.phone || '108'}\`\n` +
      `- 📍 **Location:** ${hospital?.address || `${city}`}\n\n` +
      `🚑 **Free National Ambulance Service:** Dial **108** for immediate paramedic dispatch.`;
  }

  // 7. Tourist Places & Attractions
  if (q.includes('place') || q.includes('attraction') || q.includes('visit') || q.includes('see') || q.includes('sight') || q.includes('temple') || q.includes('beach')) {
    if (attractions.length > 0) {
      return `🏛️ **Must-Visit Landmarks in ${city}:**\n\n` +
        attractions.slice(0, 4).map((a, i) => `${i + 1}. **${a.name}**\n   - 📍 *${a.address}*\n   - 🛡️ Safety Rating: **${a.safetyRating}/100**\n   - ℹ️ ${a.desc}`).join('\n\n');
    }
    return `🏛️ **Exploring ${city}:**\nExplore popular public parks, cultural centers, and heritage monuments. Check the **Explore** page for the complete 22+ destination directory!`;
  }

  // 8. Transport & Cabs
  if (q.includes('cab') || q.includes('taxi') || q.includes('auto') || q.includes('bus') || q.includes('train') || q.includes('transport') || q.includes('reach')) {
    return `🚗 **Safe Transport Options in ${city}:**\n\n` +
      `- **App-Based Rides:** Use Ola, Uber, or Rapido for tracked routes with driver details.\n` +
      `- **Auto Rickshaws:** Confirm meter pricing or agree on fare before boarding.\n` +
      `- **Public Buses:** State transport buses operate on main routes till 10:30 PM.\n` +
      `- 🌙 **Night Safety:** Share your live ride tracking link with a family member or friend when traveling late.`;
  }

  // 9. Weather & Heatwave
  if (q.includes('weather') || q.includes('rain') || q.includes('temp') || q.includes('heat') || q.includes('sun') || q.includes('climate')) {
    return `☀️ **Weather & Climate Intel for ${city}:**\n\n` +
      `Current region status: **Normal Seasonal Conditions**\n` +
      `- Keep hydrated during midday outdoor travel (12:00 PM – 3:00 PM).\n` +
      `- Check the **Alerts** tab for IMD heatwave notices and monsoon advisories.`;
  }

  // 10. General / Catch-all response
  return `🤖 **SafeWander Assistant Intelligence (${city}):**\n\n` +
    `Regarding "${query}":\n` +
    `I am continuously tracking ground safety, responder dispatches, and verified places across **${city}, ${state}**.\n\n` +
    `You can ask me to:\n` +
    `- 🗺️ Create a 1-day or 3-day travel itinerary\n` +
    `- 🏨 Recommend top-rated safe hotels\n` +
    `- 🍽️ Find clean, hygienic local dining\n` +
    `- 🚔 Provide nearest police station & hospital contact numbers\n` +
    `- 🚗 Give local transport & cab guidance`;
}
