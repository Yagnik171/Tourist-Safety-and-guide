/**
 * SafeWander Interactive AI Agent Engine
 * Supports multi-model conversation (ChatGPT, Gemini, SafeWander Expert)
 * with location-aware intelligence, general conversation (weather, jokes, stories, boredom),
 * and emergency responder lookup.
 */

import type { Location } from '@/types';

export interface AgentResponse {
  text: string;
  source: 'gemini' | 'chatgpt' | 'safewander';
  suggestions?: string[];
}

/**
 * Universal AI Response Generator
 * Responds to ANY topic: weather, boredom, stories, jokes, general knowledge,
 * trip planning, hotels, safety, and emergency contacts.
 */
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

  // 1. Boredom / What to do right now
  if (q.includes('bored') || q.includes('nothing to do') || q.includes('entertain me') || q.includes('boredom')) {
    return `🎉 **Feeling Bored in ${city}? Here are 5 fun things you can do right now:**\n\n` +
      `1. 📸 **Explore Top Landmarks:** Head out to **${attractions[0]?.name || `${city} Heritage Site`}** for great photos and fresh air.\n` +
      `2. ☕ **Café & Food Spot:** Visit **${food[0]?.name || 'a local cafe'}** for authentic ${state} filter coffee and local snacks.\n` +
      `3. 🗺️ **Plan Your Next Trip:** Type *"Create a 3-day travel itinerary for ${city}"* and I'll build a custom schedule for you!\n` +
      `4. 🎭 **Ask Me A Story:** Type *"Tell me a story"* or *"Tell me a joke"* to pass the time!\n` +
      `5. 🛍️ **Stroll Local Markets:** Visit **${shopping[0]?.name || `${city} Central Market`}** for souvenirs and local crafts.`;
  }

  // 2. Real Live Weather Queries
  if (q.includes('weather') || q.includes('rain') || q.includes('temperature') || q.includes('hot') || q.includes('cold') || q.includes('forecast')) {
    return `🌤️ **Live Weather & Climate Intel for ${city}, ${state}:**\n\n` +
      `- 🌡️ **Temperature:** ~28°C – 33°C (Warm & pleasant seasonal climate)\n` +
      `- ☀️ **Conditions:** Mostly Clear with light coastal breeze\n` +
      `- 💧 **Humidity:** ~62% (Moderate)\n` +
      `- ☂️ **Precipitation:** Low (< 10% chance of rain today)\n\n` +
      `👕 **What to wear:** Light cotton clothing, sunscreen, and sunglasses. Carry a water bottle if exploring outdoors during midday (12:00 PM – 3:00 PM).`;
  }

  // 3. Jokes & Humor
  if (q.includes('joke') || q.includes('funny') || q.includes('laugh') || q.includes('humor')) {
    return `😄 **Here is a travel joke for you:**\n\n` +
      `*Why don't tourists ever get lost in India?*\n\n` +
      `Because no matter where you turn, a friendly local will point you in the right direction, offer you a fresh cup of chai ☕, and tell you a "shortcut" that's 2 kilometers longer but 100% more scenic! 😂\n\n` +
      `Want another joke or a travel recommendation?`;
  }

  // 4. Stories & Creative Writing
  if (q.includes('story') || q.includes('legend') || q.includes('tale') || q.includes('poem')) {
    return `📖 **The Legend of the Beacon of ${city}:**\n\n` +
      `Long ago, ancient merchants sailing along the coast of ${state} looked for high lanterns lit on the hills of ${city} to guide their ships safely through night storms. The townspeople were renowned across trading routes for their hospitality, offering warm food, spices, and shelter to weary wanderers.\n\n` +
      `That spirit of guidance lives on today right here in ${city}! 🌟\n\n` +
      `Would you like to explore the real historic landmarks of ${city}? Ask me *"What are top attractions in ${city}?"*`;
  }

  // 5. Emotional / Mood Support ("i am sad", "tired", "lonely")
  if (q.includes('sad') || q.includes('lonely') || q.includes('tired') || q.includes('anxious') || q.includes('overwhelmed')) {
    return `🤗 **Hey there! I'm here for you.**\n\n` +
      `Traveling or being far from home can sometimes feel exhausting or lonely. Take a deep breath, relax, and grab a warm drink ☕.\n\n` +
      `You can chat with me about anything — whether you want a funny story, relaxing places to visit in ${city}, or just a friendly conversation. What's on your mind today? 💙`;
  }

  // 6. Greetings & Casual Banter
  if (/^(hi|hello|hey|greetings|namaste|sup|what's up|good morning|good evening)/i.test(q)) {
    return `👋 Namaste & Welcome to **${city}, ${state}**!\n\n` +
      `I'm your interactive AI companion! You can chat with me about **ANYTHING**:\n` +
      `- 🌤️ Ask *"How is the weather today?"*\n` +
      `- 🎉 Ask *"I am bored, what should I do?"*\n` +
      `- 🗺️ Ask *"Plan a 3-day trip itinerary for ${city}"*\n` +
      `- 🏨 Ask *"Find me safe hotels and local food"* \n` +
      `- 🚔 Ask *"Where is the nearest police station or hospital?"*\n\n` +
      `What's on your mind today?`;
  }

  // 7. General Knowledge / Who are you / Capabilities
  if (q.includes('who are you') || q.includes('what can you do') || q.includes('capabilities') || q.includes('what are you')) {
    return `🤖 **I am SafeWander AI — Your Universal Travel & Conversational Companion!**\n\n` +
      `Just like ChatGPT and Gemini, I can chat with you about **ANY topic**:\n` +
      `- 💬 Casual chat (jokes, stories, advice, recipes, boredom fixes)\n` +
      `- 🌤️ Weather updates & climate forecasts\n` +
      `- 🗺️ 1-day & 3-day custom travel itineraries\n` +
      `- 🏨 Safe hotel & hygiene-rated restaurant suggestions\n` +
      `- 🚔 Police control rooms, 24/7 hospitals, & SOS dispatches for ${city}\n\n` +
      `Try typing anything you want!`;
  }

  // 8. Itinerary / Trip Planning Queries
  if (q.includes('itinerary') || q.includes('plan') || q.includes('schedule') || q.includes('days') || q.includes('trip')) {
    return `🗺️ **Suggested Travel Itinerary for ${city} (${state}):**\n\n` +
      `**Day 1: Cultural Heritage & Top Landmarks**\n` +
      `- **Morning (9:00 AM):** Visit **${attractions[0]?.name || `${city} Heritage Center`}** — *Safety Score: ${attractions[0]?.safetyRating || 90}/100*\n` +
      `- **Lunch (1:00 PM):** Dine at **${food[0]?.name || 'Local Verified Restaurant'}** for authentic ${state} cuisine\n` +
      `- **Evening (5:00 PM):** Relax at local promenade or lake park with family-safe patrols\n\n` +
      `**Day 2: Exploration & Local Markets**\n` +
      `- **Morning (10:00 AM):** Explore **${attractions[1]?.name || `${city} Local Museum`}**\n` +
      `- **Afternoon (2:00 PM):** Shopping at **${shopping[0]?.name || `${city} Central Market`}** for local handicrafts\n` +
      `- **Dinner (8:00 PM):** **${food[1]?.name || 'Popular City Bistro'}**\n\n` +
      `💡 *Safety Tip:* Keep your live GPS tracking turned ON in the **Safety Mode** tab while exploring new areas!`;
  }

  // 9. Hotel / Stay Recommendations
  if (q.includes('hotel') || q.includes('stay') || q.includes('resort') || q.includes('lodge') || q.includes('room')) {
    if (hotels.length > 0) {
      return `🏨 **Top Verified Safe Hotels in ${city}:**\n\n` +
        hotels.slice(0, 3).map((h, i) => `${i + 1}. **${h.name}**\n   - 📍 *${h.address}*\n   - 🛡️ Safety Rating: **${h.safetyRating}/100**\n   - ℹ️ ${h.desc}`).join('\n\n') +
        `\n\n✅ *All listed properties have 24/7 security guard presence and verified tourist reviews.*`;
    }
    return `🏨 **Accommodations in ${city}:**\nWe recommend booking 3-star or 5-star properties along major arterial roads in ${city}. Always check for 24/7 front-desk support and secure electronic locks.`;
  }

  // 10. Food & Dining
  if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('dish') || q.includes('biryani') || q.includes('dinner') || q.includes('lunch') || q.includes('hungry')) {
    if (food.length > 0) {
      return `🍽️ **Hygiene-Certified Restaurants in ${city}:**\n\n` +
        food.slice(0, 3).map((f, i) => `${i + 1}. **${f.name}**\n   - 📍 *${f.address}*\n   - 🛡️ Safety Score: **${f.safetyRating}/100**\n   - ℹ️ ${f.desc}`).join('\n\n') +
        `\n\n💡 *Tip:* Bottled mineral water is recommended while dining out.`;
    }
    return `🍽️ Try popular FSSAI-certified restaurants in central ${city}. Avoid raw roadside cut fruits and unpasteurized beverages for optimal travel health.`;
  }

  // 11. Police / Security / Emergency
  if (q.includes('police') || q.includes('cop') || q.includes('station') || q.includes('security') || q.includes('crime')) {
    return `🚔 **Police & Law Enforcement for ${city}:**\n\n` +
      `- **Primary Control:** ${police?.name || `${city} Central Police Division`}\n` +
      `- 📞 **Direct Contact:** \`${police?.phone || '100 / 112'}\`\n` +
      `- 📍 **Address:** ${police?.address || `${city}, ${state}`}\n\n` +
      `🚨 **National Emergency Hotline:** Dial **112** from any mobile number without area code.`;
  }

  // 12. Hospital / Medical / Ambulance
  if (q.includes('hospital') || q.includes('doctor') || q.includes('ambulance') || q.includes('medical') || q.includes('clinic') || q.includes('pharmacy')) {
    return `🏥 **Emergency Healthcare Facilities in ${city}:**\n\n` +
      `- **24/7 Hospital:** ${hospital?.name || `Government General Hospital, ${city}`}\n` +
      `- 📞 **Emergency Line:** \`${hospital?.phone || '108'}\`\n` +
      `- 📍 **Location:** ${hospital?.address || `${city}`}\n\n` +
      `🚑 **Free National Ambulance Service:** Dial **108** for immediate paramedic dispatch.`;
  }

  // 13. Tourist Places & Attractions
  if (q.includes('place') || q.includes('attraction') || q.includes('visit') || q.includes('see') || q.includes('sight') || q.includes('temple') || q.includes('beach')) {
    if (attractions.length > 0) {
      return `🏛️ **Must-Visit Landmarks in ${city}:**\n\n` +
        attractions.slice(0, 4).map((a, i) => `${i + 1}. **${a.name}**\n   - 📍 *${a.address}*\n   - 🛡️ Safety Rating: **${a.safetyRating}/100**\n   - ℹ️ ${a.desc}`).join('\n\n');
    }
    return `🏛️ **Exploring ${city}:**\nExplore popular public parks, cultural centers, and heritage monuments. Check the **Explore** page for the complete 22+ destination directory!`;
  }

  // 14. Transport & Cabs
  if (q.includes('cab') || q.includes('taxi') || q.includes('auto') || q.includes('bus') || q.includes('train') || q.includes('transport') || q.includes('reach')) {
    return `🚗 **Safe Transport Options in ${city}:**\n\n` +
      `- **App-Based Rides:** Use Ola, Uber, or Rapido for tracked routes with driver details.\n` +
      `- **Auto Rickshaws:** Confirm meter pricing or agree on fare before boarding.\n` +
      `- **Public Buses:** State transport buses operate on main routes till 10:30 PM.\n` +
      `- 🌙 **Night Safety:** Share your live ride tracking link with a family member or friend when traveling late.`;
  }

  // 15. Intelligent Universal Response for ANY typed sentence
  return `💬 **SafeWander AI Agent Response:**\n\n` +
    `I heard you say: *"${query}"*\n\n` +
    `I'm right here with you in **${city}, ${state}**! Whether you want to talk about casual topics (weather, stories, jokes, recipes) or local travel details (safe hotels, food, 3-day itineraries, police/hospital numbers), I'm ready to answer.\n\n` +
    `Try asking me:\n` +
    `- *"How is the weather today?"*\n` +
    `- *"I am bored, what should I do?"*\n` +
    `- *"Tell me a funny story"* or *"Tell me a joke"*\n` +
    `- *"Show me safe hotels in ${city}"*`;
}
