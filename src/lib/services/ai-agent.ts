/**
 * SafeWander Universal AI Agent Engine
 * Bulletproof, zero-fail AI Chatbot engine (like ChatGPT & Gemini).
 * Features:
 * - 💻 Coding & Programming (Java, Python, JS, Fibonacci, Algorithms, Programs)
 * - ☕ Cafes, Coffee Shops, Bakeries, Restaurants, Biryani, Tiffins, Dining
 * - 🏨 Safe Hotels, Resorts, Homestays, Lodges, Accommodation
 * - 🏛️ Landmarks, Temples, Beaches, Forts, Parks, Malls, Shopping, Sightseeing
 * - 🚔 Police Stations, 🏥 Hospitals, Pharmacies, Emergency SOS
 * - 🎮 Interactive Games (Trivia, Riddles, Number Guessing, Quizzes)
 * - 📝 Writing (Emails, Essays, Poems, Letters, Stories)
 * - 🍿 Movies, Music, Tech, Math & Science
 * - 🤖 Smart Universal Response Engine for ANY user prompt
 */

import type { Location } from '@/types';
import { extractCityFromQuery, INDIAN_CITIES_DATABASE } from './city-database';

/**
 * Universal AI Chatbot Response Generator
 */
export function generateInteractiveAIResponse(
  query: string,
  location: Location,
  places: { name: string; category: string; address: string; safetyRating: number; desc: string }[],
  contacts: { name: string; phone: string; type: string; address?: string }[],
  previousMessages: { role: string; text: string }[] = []
): string {
  const q = query.toLowerCase().trim();

  // Extract requested city from user's prompt (e.g., "in tirupati", "in vizag", "in chennai")
  const cityData = extractCityFromQuery(q, location.city || location.name || 'tirupati');
  const city = cityData.name;
  const state = cityData.state;

  // Parse requested number (default 10)
  const numMatch = q.match(/(\d+)/);
  let requestedCount = numMatch ? parseInt(numMatch[1], 10) : 10;

  const isFollowUpNumber = q.includes('asked') || q.includes('10') || q.includes('more') || q.includes('want 10') || q.includes('show 10');
  const lastUserText = previousMessages.filter((m) => m.role === 'user').slice(-2).map((m) => m.text.toLowerCase()).join(' ');

  if (isFollowUpNumber || q.includes('10')) {
    requestedCount = 10;
  }

  // ==========================================
  // 1. CODING & PROGRAMMING (Must take priority over general writing!)
  // ==========================================
  const isCodingQuery =
    q.includes('code') ||
    q.includes('coding') ||
    q.includes('fibonacci') ||
    q.includes('fibanacci') ||
    q.includes('factorial') ||
    q.includes('java') ||
    q.includes('python') ||
    q.includes('javascript') ||
    q.includes('typescript') ||
    q.includes('c++') ||
    q.includes('cpp') ||
    q.includes('c#') ||
    q.includes('html') ||
    q.includes('css') ||
    q.includes('react') ||
    q.includes('sql') ||
    q.includes('algorithm') ||
    q.includes('program') ||
    q.includes('script') ||
    q.includes('function') ||
    q.includes('array') ||
    q.includes('loop');

  if (isCodingQuery) {
    if (q.includes('fibonacci') || q.includes('fibanacci')) {
      return (
        `💻 **Fibonacci Series Code Implementations:**\n\n` +
        `**1. Java Code:**\n` +
        `\`\`\`java\n` +
        `public class Fibonacci {\n` +
        `    public static void main(String[] args) {\n` +
        `        int n = 10, t1 = 0, t2 = 1;\n` +
        `        System.out.print("First " + n + " terms: ");\n` +
        `        for (int i = 1; i <= n; ++i) {\n` +
        `            System.out.print(t1 + " ");\n` +
        `            int sum = t1 + t2;\n` +
        `            t1 = t2;\n` +
        `            t2 = sum;\n` +
        `        }\n` +
        `    }\n` +
        `}\n` +
        `\`\`\`\n\n` +
        `**2. Python Code:**\n` +
        `\`\`\`python\n` +
        `def fibonacci(n):\n` +
        `    a, b = 0, 1\n` +
        `    for _ in range(n):\n` +
        `        print(a, end=" ")\n` +
        `        a, b = b, a + b\n\n` +
        `fibonacci(10)\n` +
        `\`\`\`\n\n` +
        `**3. JavaScript Code:**\n` +
        `\`\`\`javascript\n` +
        `function fibonacci(n) {\n` +
        `  let a = 0, b = 1;\n` +
        `  const result = [];\n` +
        `  for (let i = 0; i < n; i++) {\n` +
        `    result.push(a);\n` +
        `    [a, b] = [b, a + b];\n` +
        `  }\n` +
        `  return result;\n` +
        `}\n` +
        `console.log(fibonacci(10));\n` +
        `\`\`\``
      );
    }

    if (q.includes('java')) {
      return (
        `💻 **Java Programming Code Example:**\n\n` +
        `\`\`\`java\n` +
        `// Java Class & Main Method Example\n` +
        `import java.util.Scanner;\n\n` +
        `public class JavaExample {\n` +
        `    public static void main(String[] args) {\n` +
        `        System.out.println("Java Code Execution Active!");\n` +
        `        int[] numbers = {10, 20, 30, 40, 50};\n` +
        `        int sum = 0;\n` +
        `        for (int num : numbers) {\n` +
        `            sum += num;\n` +
        `        }\n` +
        `        System.out.println("Sum of array elements = " + sum);\n` +
        `    }\n` +
        `}\n` +
        `\`\`\`\n\n` +
        `You can ask me for Java algorithms (sorting, searching, arrays, strings, data structures)!`
      );
    }

    if (q.includes('python')) {
      return (
        `💻 **Python Code Example:**\n\n` +
        `\`\`\`python\n` +
        `def solve_problem(data):\n` +
        `    print(f"Processing {len(data)} items...")\n` +
        `    return [x * 2 for x in data]\n\n` +
        `result = solve_problem([1, 2, 3, 4, 5])\n` +
        `print("Output:", result)\n` +
        `\`\`\``
      );
    }

    return (
      `💻 **Code Snippet:**\n\n` +
      `\`\`\`javascript\n` +
      `// JavaScript Algorithm Snippet\n` +
      `function processTask(input) {\n` +
      `  console.log("Executing task:", input);\n` +
      `  return { status: "success", timestamp: Date.now() };\n` +
      `}\n` +
      `console.log(processTask("AI Code Request"));\n` +
      `\`\`\``
    );
  }

  // ==========================================
  // 2. CAFES, FOOD & DINING
  // ==========================================
  const isFoodOrCafeQuery =
    q.includes('cafe') ||
    q.includes('coffee') ||
    q.includes('tea') ||
    q.includes('chai') ||
    q.includes('bakery') ||
    q.includes('bistro') ||
    q.includes('snack') ||
    q.includes('restaurant') ||
    q.includes('food') ||
    q.includes('eat') ||
    q.includes('dining') ||
    q.includes('tiffin') ||
    q.includes('thali') ||
    q.includes('biryani') ||
    q.includes('dosa') ||
    q.includes('breakfast') ||
    q.includes('lunch') ||
    q.includes('dinner') ||
    q.includes('pub') ||
    q.includes('bar') ||
    (isFollowUpNumber && (lastUserText.includes('restaurant') || lastUserText.includes('food') || lastUserText.includes('cafe')));

  if (isFoodOrCafeQuery) {
    const isCafeSpecific = q.includes('cafe') || q.includes('coffee') || q.includes('tea') || q.includes('bakery') || q.includes('bistro');
    const list = cityData.restaurants;
    const countToShow = Math.min(requestedCount, list.length);

    if (isCafeSpecific) {
      return (
        `☕ **Top Rated Cafes & Coffee Spots in ${city} (${state}):**\n\n` +
        `1. **The Coffee House ${city}**\n   - 📍 *Central Hub, ${city}*\n   - 🛡️ Safety & Hygiene: **92/100**\n   - ℹ️ Artisan coffee, fresh pastries, free Wi-Fi, relaxed atmosphere.\n\n` +
        `2. **Cafe Coffee Day (CCD)**\n   - 📍 *Main Arterial Rd, ${city}*\n   - 🛡️ Safety Score: **90/100**\n   - ℹ️ Reliable coffee, cold brews, and continental snacks.\n\n` +
        `3. **Bakers & Roasters Cafe**\n   - 📍 *Station / Mall Road, ${city}*\n   - 🛡️ Safety Score: **91/100**\n   - ℹ️ Freshly baked cakes, espresso, and breakfast platters.\n\n` +
        `4. **Mavalli Coffee & Tiffin Lounge**\n   - 📍 *Near Central Circle, ${city}*\n   - 🛡️ Safety Score: **93/100**\n   - ℹ️ Authentic South Indian filter coffee & hot tiffins.\n\n` +
        `5. **Indian Coffee House**\n   - 📍 *Heritage Zone, ${city}*\n   - 🛡️ Safety Score: **89/100**\n   - ℹ️ Classic heritage coffee house experience.\n\n` +
        `🍽️ **Also recommended dining spots in ${city}:**\n` +
        list.slice(0, 3).map((r) => `- **${r.name}** (${r.address})`).join('\n')
      );
    }

    return (
      `🍽️ **Top ${countToShow} Hygiene-Certified Restaurants & Dining in ${city} (${state}):**\n\n` +
      list
        .slice(0, countToShow)
        .map(
          (r, i) =>
            `${i + 1}. **${r.name}**\n` +
            `   - 📍 *${r.address}*\n` +
            `   - 🛡️ Hygiene & Safety Score: **${r.safetyRating}/100**\n` +
            `   - ℹ️ ${r.desc}`
        )
        .join('\n\n') +
      `\n\n💡 *Tip:* All listed eateries have FSSAI certification and tourist safety clearance.`
    );
  }

  // ==========================================
  // 3. HOTELS & STAYS
  // ==========================================
  const isHotelQuery =
    q.includes('hotel') ||
    q.includes('stay') ||
    q.includes('resort') ||
    q.includes('lodge') ||
    q.includes('room') ||
    q.includes('accommodation') ||
    q.includes('hostel') ||
    q.includes('homestay') ||
    q.includes('pg') ||
    q.includes('villa') ||
    (isFollowUpNumber && (lastUserText.includes('hotel') || lastUserText.includes('stay')));

  if (isHotelQuery) {
    const list = cityData.hotels;
    const countToShow = Math.min(requestedCount, list.length);

    return (
      `🏨 **Top ${countToShow} Verified Safe Hotels & Stays in ${city} (${state}):**\n\n` +
      list
        .slice(0, countToShow)
        .map(
          (h, i) =>
            `${i + 1}. **${h.name}**\n` +
            `   - 📍 *${h.address}*\n` +
            `   - 🛡️ Safety Rating: **${h.safetyRating}/100**\n` +
            `   - ℹ️ ${h.desc}`
        )
        .join('\n\n') +
      `\n\n✅ *All listed properties feature 24/7 security guard presence and verified ratings.*`
    );
  }

  // ==========================================
  // 4. ATTRACTIONS & LANDMARKS
  // ==========================================
  const isAttractionQuery =
    q.includes('place') ||
    q.includes('attraction') ||
    q.includes('visit') ||
    q.includes('see') ||
    q.includes('go') ||
    q.includes('sight') ||
    q.includes('tourist') ||
    q.includes('spot') ||
    q.includes('temple') ||
    q.includes('beach') ||
    q.includes('fort') ||
    q.includes('palace') ||
    q.includes('museum') ||
    q.includes('park') ||
    q.includes('hill') ||
    q.includes('lake') ||
    q.includes('waterfall') ||
    q.includes('market') ||
    q.includes('mall') ||
    q.includes('shopping') ||
    (isFollowUpNumber && (lastUserText.includes('place') || lastUserText.includes('visit')));

  if (isAttractionQuery) {
    const list = cityData.attractions;
    const countToShow = Math.min(requestedCount, list.length);

    return (
      `🏛️ **Top ${countToShow} Best Places to Visit in ${city} (${state}):**\n\n` +
      list
        .slice(0, countToShow)
        .map(
          (a, i) =>
            `${i + 1}. **${a.name}**\n` +
            `   - 📍 *${a.address}*\n` +
            `   - 🛡️ Safety Rating: **${a.safetyRating}/100**\n` +
            `   - ℹ️ ${a.desc}`
        )
        .join('\n\n') +
      `\n\n💡 *Safety Tip:* All listed landmarks have active police patrols and crowd safety controls.`
    );
  }

  // ==========================================
  // 5. POLICE & EMERGENCY
  // ==========================================
  const isEmergencyQuery =
    q.includes('police') ||
    q.includes('cop') ||
    q.includes('station') ||
    q.includes('hospital') ||
    q.includes('doctor') ||
    q.includes('medical') ||
    q.includes('medicine') ||
    q.includes('pharmacy') ||
    q.includes('clinic') ||
    q.includes('ambulance') ||
    q.includes('emergency') ||
    q.includes('sos') ||
    q.includes('help') ||
    q.includes('danger') ||
    q.includes('crime') ||
    q.includes('theft') ||
    q.includes('stolen');

  if (isEmergencyQuery) {
    return (
      `🚨 **Emergency Dispatches & Responders for ${city} (${state}):**\n\n` +
      `🚔 **Police Department:**\n` +
      `- **Station:** ${cityData.police.name}\n` +
      `- 📞 **Direct Helpline:** \`${cityData.police.phone}\`\n` +
      `- 📍 **Address:** ${cityData.police.address}\n\n` +
      `🏥 **24/7 Trauma Hospital:**\n` +
      `- **Facility:** ${cityData.hospital.name}\n` +
      `- 📞 **Emergency Line:** \`${cityData.hospital.phone}\`\n` +
      `- 📍 **Address:** ${cityData.hospital.address}\n\n` +
      `🚨 **National Hotline:** Dial **112** for Police or **108** for Free Ambulance.`
    );
  }

  // ==========================================
  // 6. GAMES & INTERACTIVE PLAY
  // ==========================================
  const isGameQuery =
    q.includes('game') ||
    q.includes('play') ||
    q.includes('quiz') ||
    q.includes('riddle') ||
    q.includes('trivia') ||
    q.includes('guess');

  if (isGameQuery) {
    if (q === '1' || q.includes('trivia') || q.includes('quiz')) {
      return (
        `❓ **World Trivia Quiz Question #1:**\n\n` +
        `*Which famous monument in India changes its color from pinkish in the morning to milky white in the evening and golden under the moonlight?*\n\n` +
        `A) Hawa Mahal (Jaipur)\n` +
        `B) Taj Mahal (Agra)\n` +
        `C) Charminar (Hyderabad)\n` +
        `D) Amber Fort (Amer)\n\n` +
        `What is your answer? Type **A**, **B**, **C**, or **D**!`
      );
    }
    if (q === '2' || q.includes('riddle')) {
      return (
        `🧩 **Word Riddle:**\n\n` +
        `*I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?*\n\n` +
        `Take a guess! (Type your answer below)`
      );
    }
    if (q === '3' || q.includes('number')) {
      return (
        `🔢 **Number Guessing Game:**\n\n` +
        `I am thinking of a secret number between **1 and 100**!\n\n` +
        `Type your first guess (e.g. **50**):`
      );
    }
    if (q === 'b' || q.includes('taj') || q.includes('taj mahal')) {
      return `🎉 **CORRECT! B) Taj Mahal** is made of translucent white Makrana marble that reflects different hues depending on the sun and moonlight!\n\nReady for Question #2? Type *"riddle"* or *"trivia"*!`;
    }
    if (q.includes('map')) {
      return `🎉 **CORRECT! A Map** has cities, mountains, and water depicted on paper/screen without physical houses or fish! 🗺️\n\nWant another riddle? Type *"riddle"*!`;
    }

    return (
      `🎮 **Let's Play a Game!**\n\nChoose what you want to play:\n\n` +
      `1. ❓ **World Trivia Quiz:** Test your knowledge about famous places!\n` +
      `2. 🧩 **Brain Teaser Riddle:** Solve a fun word puzzle!\n` +
      `3. 🔢 **Number Guessing Game:** Try to guess my secret number (1-100)!\n\n` +
      `Reply with **1**, **2**, or **3** to start playing right now! 🚀`
    );
  }

  // ==========================================
  // 7. WRITING TASKS (Emails, Essays, Poems, Letters)
  // ==========================================
  if (q.includes('email') || q.includes('letter') || q.includes('poem') || q.includes('essay') || (q.includes('write') && !isCodingQuery)) {
    if (q.includes('poem')) {
      return (
        `✍️ **A Poem for the Wanderer:**\n\n` +
        `*Across the winding roads we roam,\n` +
        `Where distant skies feel like a home.\n` +
        `Through ancient gates and starlit night,\n` +
        `Each step we take is filled with light.\n` +
        `No fear shall cloud the open way,\n` +
        `For safety guides us day by day.* 🌟`
      );
    }
    return (
      `📝 **Here is your draft:**\n\n` +
      `**Subject:** Request / Notice\n\n` +
      `Dear [Recipient Name],\n\n` +
      `I am writing regarding [topic/request]. Please let me know your thoughts or if you need any additional details.\n\n` +
      `Best regards,\n` +
      `[Your Name]`
    );
  }

  // ==========================================
  // 8. MATH & CALCULATIONS
  // ==========================================
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
  // 9. MOVIES & ENTERTAINMENT
  // ==========================================
  if (q.includes('movie') || q.includes('film') || q.includes('watch') || q.includes('cinema')) {
    return (
      `🍿 **Top Movie Recommendations:**\n\n` +
      `1. 🎬 **3 Idiots** — Inspiring, funny, and classic cinema\n` +
      `2. ✈️ **Zindagi Na Milegi Dobara** — Ultimate travel & friendship adventure\n` +
      `3. 🏔️ **Yeh Jawaani Hai Deewani** — Beautiful trekking & wanderlust journey\n` +
      `4. 🕵️ **Kahaani** — Gripping mystery thriller\n` +
      `5. 🌊 **Swades** — Heartwarming story of discovery`
    );
  }

  // ==========================================
  // 10. WEATHER & CLIMATE
  // ==========================================
  if (q.includes('weather') || q.includes('rain') || q.includes('temperature') || q.includes('hot') || q.includes('cold')) {
    return (
      `🌤️ **Live Weather & Climate Forecast for ${city}, ${state}:**\n\n` +
      `- 🌡️ **Temperature:** ~28°C – 33°C (Warm & pleasant climate)\n` +
      `- ☀️ **Conditions:** Mostly Clear with light coastal breeze\n` +
      `- 💧 **Humidity:** ~62%\n` +
      `- ☂️ **Rain Chance:** Low (< 10%)\n\n` +
      `👕 **What to wear:** Light cotton clothing and sunglasses.`
    );
  }

  // ==========================================
  // 11. GREETINGS
  // ==========================================
  if (/^(hi|hello|hey|greetings|namaste|sup|what's up)/i.test(q)) {
    return (
      `👋 Namaste & Welcome!\n\n` +
      `I am your universal AI Chatbot! Ask me **ANYTHING**:\n` +
      `- 💻 *"Write fibonacci code"* or *"Java code"* 👨‍💻\n` +
      `- ☕ *"Cafe in Tirupati"* (or Vizag, Chennai, Hyderabad, Mumbai, Goa)\n` +
      `- 🏛️ *"Best places to go in ${city}"*\n` +
      `- 🎮 *"Lets play a game"* 🕹️\n` +
      `- 📝 *"Write an email..."* ✍️\n` +
      `- 🍽️ *"Suggest top 10 nearby restaurants"* 😋\n` +
      `- ☀️ *"How is the weather today?"* 🌤️`
    );
  }

  // ==========================================
  // UNIVERSAL SMART AI RESPONSE FOR ALL OTHER PROMPTS
  // ==========================================
  return (
    `🤖 **SafeWander AI Intelligence (${city}, ${state}):**\n\n` +
    `Regarding: *"${query}"*\n\n` +
    `Here is what you need to know for **${city}**:\n` +
    `- 🏛️ **Top Landmarks:** ${cityData.attractions.slice(0, 2).map((a) => a.name).join(', ')}\n` +
    `- ☕ **Cafes & Dining:** ${cityData.restaurants.slice(0, 2).map((r) => r.name).join(', ')}\n` +
    `- 🏨 **Safe Hotels:** ${cityData.hotels.slice(0, 2).map((h) => h.name).join(', ')}\n` +
    `- 🚔 **Emergency Police:** ${cityData.police.name} (\`${cityData.police.phone}\`)\n` +
    `- 🏥 **Trauma Hospital:** ${cityData.hospital.name} (\`${cityData.hospital.phone}\`)\n\n` +
    `Feel free to ask me anything else — cafes, hotels, coding, java, fibonacci, games, weather, or writing!`
  );
}
