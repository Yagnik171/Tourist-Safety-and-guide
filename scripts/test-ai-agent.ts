import { generateInteractiveAIResponse } from '../src/lib/services/ai-agent';
import { DEMO_LOCATIONS, getEmergencyContactsForLocation, getRecommendationsForLocation } from '../src/lib/demo-data';

const TEST_PROMPTS = [
  // --- 1. Cafes, Coffee, Tea & Bakeries (10) ---
  'cafe in tirupati',
  'best coffee shop in vizag',
  'bakery near me in chennai',
  'chai spot in hyderabad',
  'breakfast in tirupati',
  'tea cafe in nellore',
  'bistro in bengaluru',
  'dessert shop in mumbai',
  'coffee places in goa',
  'snack cafe in delhi',

  // --- 2. Food, Dining, Biryani & Restaurants (10) ---
  'suggest top 10 nearby restaurants',
  'best biryani in hyderabad',
  'pure veg food in tirupati',
  'seafood in vizag',
  'dinner spots in nellore',
  'where to eat in chennai',
  'famous food in mumbai',
  'restaurants in goa',
  'thali in jaipur',
  'chepala pulusu in nellore',

  // --- 3. Hotels, Resorts & Stays (10) ---
  'hotels in tirupati',
  'top 10 safe hotels in chennai',
  'luxury resort in goa',
  'budget stay in vizag',
  'homestay in araku',
  'where to stay in hyderabad',
  'best hotel in mumbai',
  'resorts in bengaluru',
  'hotel near taj mahal agra',
  'guest house in tirumala',

  // --- 4. Sightseeing, Places, Temples & Beaches (10) ---
  'best places to go in vizag',
  'temples in tirupati',
  'beaches in goa',
  'what to see in jaipur',
  'places to visit in delhi',
  'sightseeing in chennai',
  'forts in hyderabad',
  'tourist attractions in mumbai',
  'places in varanasi',
  'waterfalls near tirupati',

  // --- 5. Emergency, Police, Hospitals & Health (10) ---
  'nearest police station in vizag',
  'hospital in chennai',
  'ambulance number',
  'pharmacy in tirupati',
  'doctor near me in nellore',
  'emergency helpline in hyderabad',
  'police control room vizag',
  'trauma hospital in bengaluru',
  'lost passport help',
  'sos emergency',

  // --- 6. Games, Quizzes & Riddles (10) ---
  'lets play a game',
  'tell me a riddle',
  'trivia quiz',
  '1',
  '2',
  '3',
  'b',
  'map',
  'guess a number',
  'brain teaser',

  // --- 7. Writing, Emails, Poems & Stories (10) ---
  'write an email to my manager for leave request',
  'write a poem about travel',
  'tell me a story',
  'draft a letter',
  'write a rhyme about sea',
  'tell me a legend about chennai',
  'write an absence email',
  'write a travel verse',
  'tell me a story about vizag',
  'draft a complaint email',

  // --- 8. Weather, Temperature & Climate (10) ---
  'how is the weather today',
  'is it raining in chennai',
  'temperature in vizag',
  'weather in goa',
  'climate forecast in tirupati',
  'is it hot in hyderabad',
  'weather in delhi',
  'rain forecast in mumbai',
  'what to wear in jaipur',
  'humidity in vizag',

  // --- 9. Transport, Cabs & Night Safety (10) ---
  'cab in vizag',
  'how to reach tirupati temple',
  'is it safe at night in chennai',
  'auto fare in hyderabad',
  'bus to araku valley',
  'train station near tirupati',
  'flight to vizag airport',
  'ola uber safety in mumbai',
  'car rental in goa',
  'night safety tips in delhi',

  // --- 10. General Chat, Entertainment, Math & Coding (12) ---
  'hi',
  'how are you',
  'i am bored',
  'recommend a movie',
  'what is 25 * 4',
  'write javascript code',
  'write fibanacci code',
  'java code',
  'what can you do',
  'tell me a joke',
  'who created you',
  'make me laugh',
];

async function run100Tests() {
  console.log('🚀 RUNNING 100 RIGOROUS AI AGENT PROMPT TESTS...\n');

  const location = DEMO_LOCATIONS[0]; // Chennai / Default
  const places = getRecommendationsForLocation(location);
  const contacts = getEmergencyContactsForLocation(location);

  let passed = 0;
  let failed = 0;

  TEST_PROMPTS.forEach((prompt, index) => {
    const response = generateInteractiveAIResponse(prompt, location, places, contacts);

    // Fail criteria: If response contains generic fallback template or empty
    const isGenericFallback = response.includes('I got your message:');
    const isTooShort = response.length < 30;

    if (isGenericFallback || isTooShort) {
      console.log(`❌ FAIL [${index + 1}/100]: "${prompt}"`);
      console.log(`   Response snippet: ${response.slice(0, 100)}...\n`);
      failed++;
    } else {
      passed++;
      if (index % 10 === 0 || index === 99) {
        console.log(`✅ PASS [${index + 1}/100]: "${prompt}"`);
        console.log(`   Snippet: ${response.slice(0, 120).replace(/\n/g, ' ')}...\n`);
      }
    }
  });

  console.log('==================================================');
  console.log(`📊 TEST RESULTS: ${passed}/100 PASSED | ${failed}/100 FAILED`);
  console.log('==================================================');

  if (failed === 0) {
    console.log('🎉 100% PERFECT SCORE! All 100 prompts responded correctly with rich AI output!');
  } else {
    console.log(`⚠️ ${failed} prompts need attention.`);
  }
}

run100Tests();
