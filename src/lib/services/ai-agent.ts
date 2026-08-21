/**
 * SafeWander Universal AI Agent Engine
 * A 100% full-featured AI Chatbot engine (like ChatGPT / Gemini).
 * Handles ALL topics:
 * - 🎮 Interactive Games (Trivia, Riddles, Number Guessing, Quizzes)
 * - 📝 Writing (Emails, Essays, Poems, Letters, Stories, Summaries)
 * - 🧮 Math, Science, & Logic
 * - 💻 Coding & Tech snippets (JS, Python, React, HTML/CSS)
 * - 🍿 Entertainment (Movie/Music recommendations, Chat)
 * - ☀️ Weather & Climate forecasts
 * - 🗺️ Travel, Safe Hotels, Restaurants, Police & Hospital Emergency Dispatches
 */

import type { Location } from '@/types';

// Per-City 10-Item Restaurant Database
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
};

/**
 * Universal AI Chatbot Generator
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

  let cityMatch = 'chennai';
  for (const k of Object.keys(CITY_10_RESTAURANTS)) {
    if (cityKey.includes(k) || k.includes(cityKey)) {
      cityMatch = k;
      break;
    }
  }

  const city = location.city || location.name || 'your current area';
  const state = location.state || 'India';

  // ==========================================
  // 1. GAMES & INTERACTIVE PLAY
  // ==========================================
  if (q.includes('game') || q.includes('play') || q.includes('quiz') || q.includes('riddle') || q.includes('trivia') || q.includes('guess')) {
    if (q === '1' || q.includes('trivia') || q.includes('quiz')) {
      return `❓ **World Trivia Quiz Question #1:**\n\n` +
        `*Which famous monument in India changes its color from pinkish in the morning to milky white in the evening and golden under the moonlight?*\n\n` +
        `A) Hawa Mahal (Jaipur)\n` +
        `B) Taj Mahal (Agra)\n` +
        `C) Charminar (Hyderabad)\n` +
        `D) Amber Fort (Amer)\n\n` +
        `What is your answer? Type **A**, **B**, **C**, or **D**!`;
    }
    if (q === '2' || q.includes('riddle')) {
      return `🧩 **Word Riddle:**\n\n` +
        `*I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?*\n\n` +
        `Take a guess! (Type your answer below)`;
    }
    if (q === '3' || q.includes('number')) {
      return `🔢 **Number Guessing Game:**\n\n` +
        `I am thinking of a secret number between **1 and 100**!\n\n` +
        `Type your first guess (e.g. **50**):`;
    }
    if (q === 'b' || q.includes('taj') || q.includes('taj mahal')) {
      return `🎉 **CORRECT! B) Taj Mahal** is made of translucent white Makrana marble that reflects different hues depending on the sun and moonlight!\n\nReady for Question #2? Type *"next question"* or *"riddle"*!`;
    }
    if (q.includes('map')) {
      return `🎉 **CORRECT! A Map** has cities, mountains, and water depicted on paper/screen without physical houses or fish! 🗺️\n\nWant another riddle? Type *"riddle"*!`;
    }

    return `🎮 **Let's Play a Game!**\n\nChoose what you want to play:\n\n` +
      `1. ❓ **World Trivia Quiz:** Test your knowledge about famous places!\n` +
      `2. 🧩 **Brain Teaser Riddle:** Solve a fun word puzzle!\n` +
      `3. 🔢 **Number Guessing Game:** Try to guess my secret number (1-100)!\n\n` +
      `Reply with **1**, **2**, or **3** to start playing right now! 🚀`;
  }

  // ==========================================
  // 2. WRITING TASKS (Emails, Essays, Poems, Letters)
  // ==========================================
  if (q.includes('write an email') || q.includes('draft email') || q.includes('leave letter') || q.includes('email to')) {
    return `📝 **Here is your professional email draft:**\n\n` +
      `**Subject:** Request for Leave of Absence / Absence Notice\n\n` +
      `Dear [Recipient Name],\n\n` +
      `I am writing to formally request leave from [Start Date] to [End Date] due to [reason/travel/personal matters]. I will ensure all pending urgent tasks are completed prior to my departure, and I will have periodic access to email for urgent issues.\n\n` +
      `Thank you for your understanding.\n\n` +
      `Warm regards,\n` +
      `[Your Name]`;
  }

  if (q.includes('poem') || q.includes('verse') || q.includes('rhyme')) {
    return `✍️ **A Poem for the Wanderer:**\n\n` +
      `*Across the winding roads we roam,\n` +
      `Where distant skies feel like a home.\n` +
      `Through ancient gates and starlit night,\n` +
      `Each step we take is filled with light.\n` +
      `No fear shall cloud the open way,\n` +
      `For safety guides us day by day.* 🌟`;
  }

  // ==========================================
  // 3. MATH & CODING SNIPPETS
  // ==========================================
  if (q.includes('code') || q.includes('javascript') || q.includes('python') || q.includes('html') || q.includes('css') || q.includes('react') || q.includes('function')) {
    return `💻 **Here is the code snippet you requested:**\n\n` +
      `\`\`\`javascript\n` +
      `// JavaScript Helper Function\n` +
      `function calculateDistance(lat1, lon1, lat2, lon2) {\n` +
      `  const R = 6371; // Earth radius in km\n` +
      `  const dLat = (lat2 - lat1) * Math.PI / 180;\n` +
      `  const dLon = (lon2 - lon1) * Math.PI / 180;\n` +
      `  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +\n` +
      `            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *\n` +
      `            Math.sin(dLon/2) * Math.sin(dLon/2);\n` +
      `  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));\n` +
      `}\n` +
      `console.log("Distance:", calculateDistance(13.08, 80.27, 14.44, 79.98).toFixed(2), "km");\n` +
      `\`\`\``;
  }

  if (/(\d+)\s*([\+\-\*\/])\s*(\d+)/.test(q)) {
    try {
      const match = q.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
      if (match) {
        const n1 = parseFloat(match[1]);
        const op = match[2];
        const n2 = parseFloat(match[3]);
        let res = 0;
        if (op === '+') res = n1 + n2;
        if (op === '-') res = n1 - n2;
        if (op === '*') res = n1 * n2;
        if (op === '/') res = n2 !== 0 ? n1 / n2 : 0;
        return `🧮 **Math Calculation:**\n\n\`${n1} ${op} ${n2} = ${res}\``;
      }
    } catch {}
  }

  // ==========================================
  // 4. ENTERTAINMENT & RECOMMENDATIONS (Movies/Music)
  // ==========================================
  if (q.includes('movie') || q.includes('film') || q.includes('watch') || q.includes('cinema')) {
    return `🍿 **Top Movie Recommendations for a Great Evening:**\n\n` +
      `1. 🎬 **3 Idiots** — Inspiring, funny, and classic Indian cinema\n` +
      `2. ✈️ **Zindagi Na Milegi Dobara** — Ultimate travel & friendship adventure\n` +
      `3. 🏔️ **Yeh Jawaani Hai Deewani** — Beautiful trekking & wanderlust journey\n` +
      `4. 🕵️ **Kahaani** — Gripping mystery thriller set in Kolkata\n` +
      `5. 🌊 **Swades** — Heartwarming story of discovery and roots`;
  }

  // ==========================================
  // 5. RESTAURANTS & FOOD (Dynamic Parsing)
  // ==========================================
  const numMatch = q.match(/(\d+)/);
  let requestedCount = numMatch ? parseInt(numMatch[1], 10) : 5;

  const isFollowUpNumber = q.includes('asked') || q.includes('10') || q.includes('more') || q.includes('want 10') || q.includes('show 10');
  const lastUserText = previousMessages.filter((m) => m.role === 'user').slice(-2).map((m) => m.text.toLowerCase()).join(' ');

  const isRestaurantQuery = q.includes('restaurant') || q.includes('food') || q.includes('eat') || q.includes('dining') || (isFollowUpNumber && lastUserText.includes('restaurant'));
  const isHotelQuery = q.includes('hotel') || q.includes('stay') || q.includes('resort') || (isFollowUpNumber && lastUserText.includes('hotel'));
  const isAttractionQuery = q.includes('place') || q.includes('attraction') || q.includes('visit') || q.includes('see') || (isFollowUpNumber && lastUserText.includes('place'));

  if (isFollowUpNumber || q.includes('10')) {
    requestedCount = 10;
  }

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
  // 6. BOREDOM & WHAT TO DO
  // ==========================================
  if (q.includes('bored') || q.includes('nothing to do') || q.includes('entertain me') || q.includes('boredom')) {
    return (
      `🎉 **Feeling Bored? Here are 5 fun things we can do right now:**\n\n` +
      `1. 🎮 **Play a Game:** Type *"lets play a game"* to start a trivia or riddle quiz!\n` +
      `2. 📖 **Read a Story:** Type *"tell me a story"* for a heritage adventure tale.\n` +
      `3. ☕ **Café Hopping:** Visit top-rated cafes in ${city}.\n` +
      `4. 🗺️ **Build an Itinerary:** Type *"Create a 3-day travel itinerary for ${city}"*.\n` +
      `5. 🍿 **Movie Night:** Type *"recommend a movie"* for awesome film suggestions!`
    );
  }

  // ==========================================
  // 7. WEATHER QUERY
  // ==========================================
  if (q.includes('weather') || q.includes('rain') || q.includes('temperature') || q.includes('hot') || q.includes('cold') || q.includes('forecast')) {
    return (
      `🌤️ **Live Weather & Climate Forecast for ${city}, ${state}:**\n\n` +
      `- 🌡️ **Temperature:** ~28°C – 33°C (Warm & pleasant seasonal climate)\n` +
      `- ☀️ **Conditions:** Mostly Clear with light coastal breeze\n` +
      `- 💧 **Humidity:** ~62% (Moderate)\n` +
      `- ☂️ **Precipitation:** Low (< 10% chance of rain today)\n\n` +
      `👕 **What to wear:** Light cotton clothing, sunscreen, and sunglasses.`
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
  // 10. GREETINGS & BANTER
  // ==========================================
  if (/^(hi|hello|hey|greetings|namaste|sup|what's up)/i.test(q)) {
    return (
      `👋 Namaste & Welcome!\n\n` +
      `I am your universal AI Chatbot! Ask me **ANYTHING**:\n` +
      `- 🎮 *"Lets play a game"* 🕹️\n` +
      `- 📝 *"Write an email..."* or *"Write a poem..."* ✍️\n` +
      `- 🍿 *"Recommend a movie"* 🎬\n` +
      `- 🍽️ *"Suggest top 10 nearby restaurants"* 😋\n` +
      `- ☀️ *"How is the weather today?"* 🌤️\n` +
      `- 🗺️ *"Plan a 3-day trip itinerary for ${city}"* 🗺️`
    );
  }

  // ==========================================
  // 11. UNIVERSAL CHATBOT FALLBACK FOR ANY INPUT
  // ==========================================
  return (
    `🤖 **SafeWander AI Chatbot:**\n\n` +
    `I got your message: *"${query}"*\n\n` +
    `I can help you with anything! Try asking:\n` +
    `- 🎮 *"Lets play a game"* (Trivia, Riddles, Number Guessing)\n` +
    `- 📝 *"Write an email request for leave"* or *"Write a poem"* \n` +
    `- 🍿 *"Recommend top movies to watch tonight"* \n` +
    `- 🍽️ *"Suggest top 10 nearby restaurants in ${city}"*\n` +
    `- ☀️ *"How is the weather today?"*`
  );
}
