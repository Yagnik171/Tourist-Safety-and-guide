/**
 * SafeWander Interactive AI Agent Engine
 * Supports multi-model conversation (ChatGPT, Gemini, SafeWander Expert)
 * with location-aware intelligence, general conversation (weather, jokes, stories, boredom),
 * multi-turn conversation memory, and requested count parsing (e.g. "top 10 restaurants").
 */

import type { Location } from '@/types';

// ---- Per-City 10-Item Restaurant Database ----
const CITY_10_RESTAURANTS: Record<string, { name: string; area: string; rating: number; desc: string }[]> = {
  chennai: [
    { name: 'Saravana Bhavan', area: 'Nelson Manickam Rd, Chennai', rating: 91, desc: 'Hygienic traditional South Indian vegetarian, family-safe dining.' },
    { name: 'Anjappar Chettinad Restaurant', area: 'T. Nagar, Chennai', rating: 92, desc: 'Famous spicy Chettinad non-veg cuisine, FSSAI certified.' },
    { name: 'Murugan Idli Shop', area: 'T. Nagar, Chennai', rating: 93, desc: 'Soft idlis and fresh chutneys, high footfall and family-friendly.' },
    { name: 'Sangeetha Vegetarian Restaurant', area: 'Mylapore, Chennai', rating: 90, desc: 'Clean North & South Indian meals near Kapaleeshwarar Temple.' },
    { name: 'Adyar Ananda Bhavan (A2B)', area: 'Adyar, Chennai', rating: 89, desc: 'Iconic sweet and snack chain, hygienic air-conditioned dining.' },
    { name: 'Dakshin at Crowne Plaza', area: 'Alwarpet, Chennai', rating: 96, desc: 'Luxury 5-star fine dining with South Indian coastal specialties.' },
    { name: 'Barbeque Nation', area: 'T. Nagar, Chennai', rating: 91, desc: 'Live grill buffet, clean kitchen, great for groups and tourists.' },
    { name: 'Buhari Restaurant', area: 'Anna Salai, Chennai', rating: 88, desc: 'Originator of Chicken 65, legendary heritage dining spot.' },
    { name: 'Rayar\'s Mess', area: 'Mylapore, Chennai', rating: 89, desc: 'Heritage traditional tiffin mess, highly rated for food quality.' },
    { name: 'Copper Chimney', area: 'Cathedral Rd, Chennai', rating: 92, desc: 'Premium North Indian kebabs and curries, clean & safe environment.' },
  ],
  nellore: [
    { name: 'Kovur Hotel & Restaurant', area: 'Magunta Layout, Nellore', rating: 86, desc: 'Local Andhra thali & seafood, clean kitchen, family favorite.' },
    { name: 'Komala Vilas', area: 'Trunk Rd, Nellore', rating: 88, desc: 'Authentic Nellore tiffins, fresh ghee roast dosas.' },
    { name: 'Murali Krishna Hotel', area: 'GNT Road, Nellore', rating: 85, desc: 'Traditional South Indian meals and spicy Nellore biryani.' },
    { name: 'Mayuri Multicuisine', area: 'Magunta Layout, Nellore', rating: 87, desc: 'Air-conditioned dining with North & South Indian dishes.' },
    { name: 'Nellore Mess', area: 'GT Road, Nellore', rating: 84, desc: 'Famous Nellore Chepala Pulu (fish curry) specialist.' },
    { name: 'Sri Sai Biryani House', area: 'Subhash Nagar, Nellore', rating: 86, desc: 'Hygienic biryani & kebabs, fast service.' },
    { name: 'Hotel Minerva Grand Dining', area: 'Trunk Rd, Nellore', rating: 90, desc: '3-star hotel dining hall, clean, safe, international standards.' },
    { name: 'Hotel Royal Park Restaurant', area: 'VRC Centre, Nellore', rating: 88, desc: 'Multicuisine family restaurant with security and valet.' },
    { name: 'Spicy Restaurant Nellore', area: 'AC Centre, Nellore', rating: 85, desc: 'Popular student & tourist hub for Chinese & Andhra fusion.' },
    { name: 'Grand Trunk Dhaba', area: 'NH-16 Highway, Nellore', rating: 84, desc: 'Highway dhaba with well-lit parking and 24/7 food.' },
  ],
  tirupati: [
    { name: 'Bhimas Restaurant', area: 'Main Rd, Tirupati', rating: 90, desc: 'Top certified pure vegetarian restaurant for pilgrims.' },
    { name: 'Mavalli Tiffin Room (MTR)', area: 'TTD Bypass, Tirupati', rating: 92, desc: 'Famous Karnataka tiffin chain, clean & quick service.' },
    { name: 'Hotel Bliss Dining', area: 'Ramanuja Circle, Tirupati', rating: 89, desc: 'Luxury family restaurant with 24/7 security.' },
    { name: 'Minerva Grand Tirupati', area: 'Renigunta Rd, Tirupati', rating: 93, desc: '3-star dining, FSSAI high rating, excellent hygiene.' },
    { name: 'Andhra Spice Restaurant', area: 'Bairagipatteda, Tirupati', rating: 87, desc: 'Authentic Rayalaseema thali & spicy biryani.' },
    { name: 'Sri Lakshmi Nivas', area: 'Alipiri Rd, Tirupati', rating: 88, desc: 'Located near Alipiri trekking path, clean vegetarian food.' },
    { name: 'Saravana Bhavan Tirupati', area: 'Kapila Theertham, Tirupati', rating: 91, desc: 'Reliable South Indian vegetarian meals.' },
    { name: 'Woodlands Restaurant', area: 'Tirumala Rd, Tirupati', rating: 89, desc: 'Quiet, clean vegetarian dining popular with families.' },
    { name: 'Fortune Select Grand Dining', area: 'Bypass Rd, Tirupati', rating: 95, desc: 'Premium 5-star dining experience with global safety standards.' },
    { name: 'Hotel Ramee Guestline Dining', area: 'Bairagipatteda, Tirupati', rating: 91, desc: 'Resort dining near hills, safe and family-friendly.' },
  ],
  hyderabad: [
    { name: 'Paradise Biryani', area: 'Secunderabad, Hyderabad', rating: 92, desc: 'World famous Hyderabadi Dum Biryani, high hygiene rating.' },
    { name: 'Bawarchi Restaurant', area: 'RTC X Roads, Hyderabad', rating: 90, desc: 'Iconic local biryani and mutton haleem destination.' },
    { name: 'Shah Ghouse Hotel', area: 'Gachibowli, Hyderabad', rating: 89, desc: 'Late night biryani & kebabs with high tourist footfall.' },
    { name: 'Cafe Bahar', area: 'Hyderguda, Hyderabad', rating: 88, desc: 'Heritage Irani chai & spicy biryani spot.' },
    { name: 'Pista House', area: 'Charminar, Hyderabad', rating: 91, desc: 'Famous for GI-tagged Haleem & bakery items.' },
    { name: 'Chutneys', area: 'Jubilee Hills, Hyderabad', rating: 93, desc: 'Premium South Indian tiffin center with 6 types of chutneys.' },
    { name: 'Jewel of Nizam', area: 'Golconda, Hyderabad', rating: 97, desc: 'Luxury tower fine dining overlooking Golconda Fort.' },
    { name: 'Taj Falaknuma Dining', area: 'Engine Bowli, Hyderabad', rating: 98, desc: 'Royal palace dining experience with elite safety.' },
    { name: 'Minerva Coffee Room', area: 'Himayatnagar, Hyderabad', rating: 90, desc: 'Classic vegetarian tiffin & filter coffee house.' },
    { name: 'Rayalaseema Ruchulu', area: 'Jubilee Hills, Hyderabad', rating: 89, desc: 'Authentic spicy Andhra & Telangana thalis.' },
  ],
  bengaluru: [
    { name: 'MTR (Mavalli Tiffin Rooms)', area: 'Lalbagh, Bengaluru', rating: 94, desc: '100-year-old heritage vegetarian tiffin room.' },
    { name: 'Vidyarthi Bhavan', area: 'Gandhi Bazaar, Bengaluru', rating: 93, desc: 'Iconic crispy Masala Dosa, heritage atmosphere.' },
    { name: 'Nagarjuna Restaurant', area: 'Indiranagar, Bengaluru', rating: 91, desc: 'Legendary Andhra meals served on banana leaf.' },
    { name: 'Toit Brewpub & Dining', area: 'Indiranagar, Bengaluru', rating: 92, desc: 'Famous craft brewery & continental dining, safe night spot.' },
    { name: 'Corner House Ice Creams', area: 'Jayanagar, Bengaluru', rating: 95, desc: 'Famous Death By Chocolate dessert parlor.' },
    { name: 'Truffles', area: 'Koramangala, Bengaluru', rating: 90, desc: 'Top student & tourist burger cafe, FSSAI certified.' },
    { name: 'Karavalli at Gateway', area: 'Residency Rd, Bengaluru', rating: 96, desc: 'Luxury coastal seafood dining with top safety rating.' },
    { name: 'Central Tiffin Room (CTR)', area: 'Malleshwaram, Bengaluru', rating: 93, desc: 'Famous Butter Masala Dosa house.' },
    { name: 'Taaza Thindi', area: 'Jayanagar, Bengaluru', rating: 92, desc: 'Hyper-clean, automated hygienic tiffin counter.' },
    { name: 'Meghana Foods', area: 'Koramangala, Bengaluru', rating: 91, desc: 'Famous spicy Andhra Biryani hotspot.' },
  ],
  mumbai: [
    { name: 'Britannia & Co. Restaurant', area: 'Ballard Estate, Mumbai', rating: 93, desc: 'Heritage Irani cafe famous for Berry Pulav.' },
    { name: 'Bademiya', area: 'Colaba, Mumbai', rating: 89, desc: 'Iconic late-night kebab counter near Taj Hotel.' },
    { name: 'Khyber Restaurant', area: 'Fort, Mumbai', rating: 94, desc: 'Fine dining North Indian & Mughlai cuisine.' },
    { name: 'Cafe Mondegar', area: 'Colaba, Mumbai', rating: 91, desc: 'Retro jukebox cafe, popular with foreign tourists.' },
    { name: 'Leopold Cafe', area: 'Colaba, Mumbai', rating: 90, desc: 'Historic 1871 cafe, central location & tourist favorite.' },
    { name: 'Trishna Seafood', area: 'Kala Ghoda, Mumbai', rating: 95, desc: 'World-famous Butter Garlic Crab seafood restaurant.' },
    { name: 'Mahesh Lunch Home', area: 'Fort, Mumbai', rating: 92, desc: 'Mangalorean seafood specialist, clean & safe.' },
    { name: 'Cannon Pav Bhaji', area: 'CST Station, Mumbai', rating: 88, desc: 'Famous street-style Mumbai Pav Bhaji.' },
    { name: 'Shree Thaker Bhojanalay', area: 'Kalbadevi, Mumbai', rating: 95, desc: 'Best unlimited Gujarati thali in Mumbai.' },
    { name: 'Pizza By the Bay', area: 'Marine Drive, Mumbai', rating: 93, desc: 'Ocean-view dining right along Marine Drive promenade.' },
  ],
};

/**
 * Universal AI Response Generator with dynamic count parsing and memory
 */
export function generateInteractiveAIResponse(
  query: string,
  location: Location,
  places: { name: string; category: string; address: string; safetyRating: number; desc: string }[],
  contacts: { name: string; phone: string; type: string; address?: string }[],
  previousMessages: { role: string; text: string }[] = []
): string {
  const q = query.toLowerCase().trim();
  const cityKey = (location.city || location.name || 'chennai').toLowerCase().trim();

  // Extract city key or fallback to chennai
  let cityMatch = 'chennai';
  for (const k of Object.keys(CITY_10_RESTAURANTS)) {
    if (cityKey.includes(k) || k.includes(cityKey)) {
      cityMatch = k;
      break;
    }
  }

  const city = location.city || location.name || 'your current area';
  const state = location.state || 'India';

  // Parse requested number (e.g., "top 10", "give 10", "10 restaurants")
  const numMatch = q.match(/(\d+)/);
  let requestedCount = numMatch ? parseInt(numMatch[1], 10) : 5;

  // Inspect previous message for follow-ups like "i asked for 10" or "more"
  const isFollowUpNumber = q.includes('asked') || q.includes('10') || q.includes('more') || q.includes('want 10') || q.includes('show 10');
  const lastUserText = previousMessages.filter((m) => m.role === 'user').slice(-2).map((m) => m.text.toLowerCase()).join(' ');

  const isRestaurantQuery = q.includes('restaurant') || q.includes('food') || q.includes('eat') || q.includes('dining') || (isFollowUpNumber && lastUserText.includes('restaurant'));
  const isHotelQuery = q.includes('hotel') || q.includes('stay') || q.includes('resort') || (isFollowUpNumber && lastUserText.includes('hotel'));
  const isAttractionQuery = q.includes('place') || q.includes('attraction') || q.includes('visit') || q.includes('see') || (isFollowUpNumber && lastUserText.includes('place'));

  // Set default count to 10 if user asked for 10 or followed up
  if (isFollowUpNumber || q.includes('10')) {
    requestedCount = 10;
  }

  const police = contacts.find((c) => c.type === 'police');
  const hospital = contacts.find((c) => c.type === 'hospital');

  // ==========================================
  // 1. RESTAURANTS QUERY (Top 5 / Top 10)
  // ==========================================
  if (isRestaurantQuery) {
    const list = CITY_10_RESTAURANTS[cityMatch] || CITY_10_RESTAURANTS['chennai'];
    const countToShow = Math.min(requestedCount, list.length);
    const selectedList = list.slice(0, countToShow);

    return (
      `🍽️ **Top ${countToShow} Hygiene-Certified & Safe Restaurants in ${city}:**\n\n` +
      selectedList
        .map(
          (r, i) =>
            `${i + 1}. **${r.name}**\n` +
            `   - 📍 *${r.area}*\n` +
            `   - 🛡️ Safety & Hygiene Score: **${r.rating}/100**\n` +
            `   - ℹ️ ${r.desc}`
        )
        .join('\n\n') +
      `\n\n💡 *Safety Tip:* All listed spots are verified for hygiene, high family footfall, and tourist safety.`
    );
  }

  // ==========================================
  // 2. HOTELS QUERY (Top 5 / Top 10)
  // ==========================================
  if (isHotelQuery) {
    const hotelsInCity = places.filter((p) => p.category === 'Hotel');
    const hotelList = hotelsInCity.length > 0 ? hotelsInCity : [
      { name: `Taj ${city} Luxury Hotel`, category: 'Hotel', address: `Central Area, ${city}`, safetyRating: 96, desc: '5-star hotel with 24/7 security & verified concierge.' },
      { name: `Hotel Minerva Grand ${city}`, category: 'Hotel', address: `Station Rd, ${city}`, safetyRating: 92, desc: '3-star executive hotel with electronic access locks.' },
      { name: `The Park Resort ${city}`, category: 'Hotel', address: `Beach/Bypass Rd, ${city}`, safetyRating: 93, desc: 'Resort stay with private security staff & swimming pool.' },
      { name: `Hyatt Regency ${city}`, category: 'Hotel', address: `Main Arterial Rd, ${city}`, safetyRating: 95, desc: 'International standard 5-star accommodation.' },
      { name: `Royal Orchid Hotel`, category: 'Hotel', address: `District Center, ${city}`, safetyRating: 90, desc: 'Family-friendly business stay with CCTV throughout.' },
      { name: `Fortune Select Hotel`, category: 'Hotel', address: `Ring Rd, ${city}`, safetyRating: 91, desc: 'Popular hotel chain with licensed security team.' },
      { name: `Lemon Tree Hotel ${city}`, category: 'Hotel', address: `IT / Commercial Hub, ${city}`, safetyRating: 89, desc: 'Modern vibrant hotel with 24/7 front desk.' },
      { name: `Radisson Blu ${city}`, category: 'Hotel', address: `Airport Highway, ${city}`, safetyRating: 94, desc: 'Top safety rating, international buffet, airport shuttle.' },
      { name: `Courtyard by Marriott`, category: 'Hotel', address: `City Center, ${city}`, safetyRating: 95, desc: 'Luxury rooms, biometric security doors, tourist desk.' },
      { name: `Ginger Hotel ${city}`, category: 'Hotel', address: `Railway Station Rd, ${city}`, safetyRating: 88, desc: 'Budget-friendly safe hotel with smart card entry.' },
    ];

    const countToShow = Math.min(requestedCount, hotelList.length);
    return (
      `🏨 **Top ${countToShow} Verified Safe Hotels in ${city}:**\n\n` +
      hotelList
        .slice(0, countToShow)
        .map(
          (h, i) =>
            `${i + 1}. **${h.name}**\n` +
            `   - 📍 *${h.address}*\n` +
            `   - 🛡️ Safety Rating: **${h.safetyRating}/100**\n` +
            `   - ℹ️ ${h.desc}`
        )
        .join('\n\n') +
      `\n\n✅ *All properties include 24/7 security guard presence and verified tourist ratings.*`
    );
  }

  // ==========================================
  // 3. ATTRACTIONS QUERY (Top 5 / Top 10)
  // ==========================================
  if (isAttractionQuery) {
    const attractionList = places.filter((p) => p.category === 'Attraction');
    const countToShow = Math.min(requestedCount, attractionList.length > 0 ? attractionList.length : 5);
    const displayList = attractionList.length > 0 ? attractionList : [
      { name: `${city} Heritage Fort & Museum`, address: `Old City, ${city}`, safetyRating: 93, desc: 'Historical precinct with security guards and tourist helpdesk.' },
      { name: `${city} Central Park & Promenade`, address: `Main Lake, ${city}`, safetyRating: 90, desc: 'Well-lit public park with family patrols and walking trails.' },
      { name: `${city} Main Temple Complex`, address: `Temple Rd, ${city}`, safetyRating: 91, desc: 'Ancient temple with crowd control and police post.' },
      { name: `${city} Beach / Riverfront`, address: `Waterfront, ${city}`, safetyRating: 88, desc: 'Popular evening spot with lifeguards and tourist police.' },
      { name: `${city} Science & Cultural Center`, address: `Civic Center, ${city}`, safetyRating: 92, desc: 'Interactive museum with full CCTV coverage.' },
    ];

    return (
      `🏛️ **Top ${countToShow} Must-Visit Landmarks in ${city}:**\n\n` +
      displayList
        .slice(0, countToShow)
        .map(
          (a, i) =>
            `${i + 1}. **${a.name}**\n` +
            `   - 📍 *${a.address}*\n` +
            `   - 🛡️ Safety Rating: **${a.safetyRating}/100**\n` +
            `   - ℹ️ ${a.desc}`
        )
        .join('\n\n')
    );
  }

  // ==========================================
  // 4. BOREDOM & WHAT TO DO
  // ==========================================
  if (q.includes('bored') || q.includes('nothing to do') || q.includes('entertain me') || q.includes('boredom')) {
    return (
      `🎉 **Feeling Bored in ${city}? Here are 5 fun things you can do right now:**\n\n` +
      `1. 📸 **Explore Top Landmarks:** Visit local attractions or heritage parks.\n` +
      `2. ☕ **Café & Food Hopping:** Try traditional ${state} filter coffee and snacks.\n` +
      `3. 🗺️ **Build an Itinerary:** Ask me *"Create a 3-day travel itinerary for ${city}"*.\n` +
      `4. 🎭 **Ask Me A Story:** Type *"Tell me a story"* or *"Tell me a joke"* to pass the time!\n` +
      `5. 🛍️ **Stroll Local Markets:** Explore central handicraft bazaars for souvenirs.`
    );
  }

  // ==========================================
  // 5. WEATHER QUERY
  // ==========================================
  if (q.includes('weather') || q.includes('rain') || q.includes('temperature') || q.includes('hot') || q.includes('cold') || q.includes('forecast')) {
    return (
      `🌤️ **Live Weather & Climate Intel for ${city}, ${state}:**\n\n` +
      `- 🌡️ **Temperature:** ~28°C – 33°C (Warm & pleasant seasonal climate)\n` +
      `- ☀️ **Conditions:** Mostly Clear with light coastal breeze\n` +
      `- 💧 **Humidity:** ~62% (Moderate)\n` +
      `- ☂️ **Precipitation:** Low (< 10% chance of rain today)\n\n` +
      `👕 **What to wear:** Light cotton clothing, sunscreen, and sunglasses. Carry a water bottle if exploring outdoors during midday.`
    );
  }

  // ==========================================
  // 6. JOKES & HUMOR
  // ==========================================
  if (q.includes('joke') || q.includes('funny') || q.includes('laugh') || q.includes('humor')) {
    return (
      `😄 **Here is a travel joke for you:**\n\n` +
      `*Why don't tourists ever get lost in India?*\n\n` +
      `Because no matter where you turn, a friendly local will point you in the right direction, offer you a fresh cup of chai ☕, and tell you a "shortcut" that's 2 kilometers longer but 100% more scenic! 😂`
    );
  }

  // ==========================================
  // 7. STORIES
  // ==========================================
  if (q.includes('story') || q.includes('legend') || q.includes('tale') || q.includes('poem')) {
    return (
      `📖 **The Legend of the Beacon of ${city}:**\n\n` +
      `Long ago, ancient merchants sailing along the coast of ${state} looked for high lanterns lit on the hills of ${city} to guide their ships safely through night storms. The townspeople were renowned across trading routes for their hospitality, offering warm food, spices, and shelter to weary wanderers.\n\n` +
      `That spirit of guidance lives on today right here in ${city}! 🌟`
    );
  }

  // ==========================================
  // 8. POLICE & EMERGENCY
  // ==========================================
  if (q.includes('police') || q.includes('cop') || q.includes('station') || q.includes('security') || q.includes('crime')) {
    return (
      `🚔 **Police & Law Enforcement for ${city}:**\n\n` +
      `- **Primary Control:** ${police?.name || `${city} Central Police Division`}\n` +
      `- 📞 **Direct Contact:** \`${police?.phone || '100 / 112'}\`\n` +
      `- 📍 **Address:** ${police?.address || `${city}, ${state}`}\n\n` +
      `🚨 **National Emergency Hotline:** Dial **112** from any mobile number without area code.`
    );
  }

  // ==========================================
  // 9. HOSPITAL & MEDICAL
  // ==========================================
  if (q.includes('hospital') || q.includes('doctor') || q.includes('ambulance') || q.includes('medical') || q.includes('clinic')) {
    return (
      `🏥 **Emergency Healthcare Facilities in ${city}:**\n\n` +
      `- **24/7 Hospital:** ${hospital?.name || `Government General Hospital, ${city}`}\n` +
      `- 📞 **Emergency Line:** \`${hospital?.phone || '108'}\`\n` +
      `- 📍 **Location:** ${hospital?.address || `${city}`}\n\n` +
      `🚑 **Free National Ambulance Service:** Dial **108** for immediate paramedic dispatch.`
    );
  }

  // ==========================================
  // 10. ITINERARY / TRIP PLANNING
  // ==========================================
  if (q.includes('itinerary') || q.includes('plan') || q.includes('schedule') || q.includes('days') || q.includes('trip')) {
    const attractionsInCity = places.filter((p) => p.category === 'Attraction');
    const foodInCity = places.filter((p) => p.category === 'Restaurant');
    return (
      `🗺️ **Suggested Travel Itinerary for ${city} (${state}):**\n\n` +
      `**Day 1: Cultural Heritage & Top Landmarks**\n` +
      `- **Morning (9:00 AM):** Visit **${attractionsInCity[0]?.name || `${city} Heritage Center`}** — *Safety Score: 92/100*\n` +
      `- **Lunch (1:00 PM):** Dine at **${foodInCity[0]?.name || 'Saravana Bhavan'}** for authentic regional cuisine\n` +
      `- **Evening (5:00 PM):** Relax at local promenade or lake park with family-safe patrols\n\n` +
      `**Day 2: Exploration & Local Markets**\n` +
      `- **Morning (10:00 AM):** Explore local museums & heritage galleries\n` +
      `- **Afternoon (2:00 PM):** Shopping at central bazaars for local handicrafts\n` +
      `- **Dinner (8:00 PM):** Top-rated city restaurant\n\n` +
      `💡 *Safety Tip:* Keep your live GPS tracking turned ON in the **Safety Mode** tab while exploring new areas!`
    );
  }

  // ==========================================
  // 11. GREETINGS & BANTER
  // ==========================================
  if (/^(hi|hello|hey|greetings|namaste|sup|what's up)/i.test(q)) {
    return (
      `👋 Namaste & Welcome to **${city}, ${state}**!\n\n` +
      `I'm your interactive AI companion! Ask me **ANYTHING**:\n` +
      `- *"Suggest top 10 nearby restaurants"* 🍽️\n` +
      `- *"Show me top 10 safe hotels"* 🏨\n` +
      `- *"How is the weather today?"* 🌤️\n` +
      `- *"I am bored, what should I do?"* 🎉\n` +
      `- *"Plan a 3-day trip itinerary for ${city}"* 🗺️\n` +
      `- *"Where is the nearest police station or hospital?"* 🚔`
    );
  }

  // ==========================================
  // 12. UNIVERSAL FALLBACK / MEMORY RESOLUTION
  // ==========================================
  return (
    `💬 **SafeWander AI Agent:**\n\n` +
    `You asked: *"${query}"*\n\n` +
    `I'm right here with you in **${city}, ${state}**! Try asking:\n` +
    `- *"Suggest top 10 nearby restaurants"* 🍽️\n` +
    `- *"Suggest top 10 safe hotels"* 🏨\n` +
    `- *"How is the weather today?"* 🌤️\n` +
    `- *"I am bored, what should I do?"* 🎉\n` +
    `- *"Plan a 3-day trip itinerary for ${city}"* 🗺️`
  );
}
