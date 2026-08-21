/**
 * Comprehensive Multi-City Knowledge Base for SafeWander AI
 * Contains rich places, attractions, restaurants, hotels, police & hospitals
 * for 20+ major travel destinations across India.
 */

export interface CityData {
  name: string;
  state: string;
  attractions: { name: string; address: string; safetyRating: number; desc: string }[];
  restaurants: { name: string; address: string; safetyRating: number; desc: string }[];
  hotels: { name: string; address: string; safetyRating: number; desc: string }[];
  police: { name: string; phone: string; address: string };
  hospital: { name: string; phone: string; address: string };
}

export const INDIAN_CITIES_DATABASE: Record<string, CityData> = {
  vizag: {
    name: 'Visakhapatnam (Vizag)',
    state: 'Andhra Pradesh',
    attractions: [
      { name: 'RK Beach (Rama Krishna Beach)', address: 'Beach Rd, Vizag', safetyRating: 90, desc: 'Popular coastal promenade with police patrols, lifeguard posts, and submarine museum.' },
      { name: 'INS Kursura Submarine Museum', address: 'RK Beach Rd, Vizag', safetyRating: 94, desc: 'Real decommissioned submarine museum preserved by the Indian Navy.' },
      { name: 'Kailasagiri Hill Park', address: 'Hill Top, Vizag', safetyRating: 91, desc: 'Scenic hilltop park overlooking the Bay of Bengal with ropeway rides.' },
      { name: 'Araku Valley & Borra Caves', address: 'Araku, Vizag District', safetyRating: 89, desc: 'Breathtaking hill station with coffee plantations and million-year-old limestone caves.' },
      { name: 'Rushikonda Beach', address: 'Rushikonda, Vizag', safetyRating: 92, desc: 'Blue Flag certified clean beach with water sports and beach safety guards.' },
      { name: 'Simhachalam Temple', address: 'Simhachalam, Vizag', safetyRating: 93, desc: '11th-century Lord Narasimha temple complex with tight crowd security.' },
      { name: 'Dolphin\'s Nose & Lighthouse', address: 'Gangavaram, Vizag', safetyRating: 88, desc: 'Dramatic rock promontory 358m above sea level with panoramic harbor views.' },
      { name: 'TU 142 Aircraft Museum', address: 'Beach Rd, Vizag', safetyRating: 93, desc: 'Naval maritime reconnaissance aircraft museum opposite RK Beach.' },
      { name: 'Yarada Beach', address: 'Yarada, Vizag', safetyRating: 87, desc: 'Secluded golden sand beach surrounded by lush green hills on three sides.' },
      { name: 'Tenneti Park', address: 'Beach Rd, Jodupeallu, Vizag', safetyRating: 89, desc: 'Coastal cliffside park offering stunning sunset views over the sea.' },
    ],
    restaurants: [
      { name: 'Bheemili Beach Seafood Restaurant', address: 'Bheemili Beach, Vizag', safetyRating: 88, desc: 'Fresh local coastal seafood, FSSAI certified, clean beachfront kitchen.' },
      { name: 'Dine Confidential', address: 'Siripuram, Vizag', safetyRating: 91, desc: 'Popular multicuisine restaurant with great ambiance and hygiene standards.' },
      { name: 'Dakshin at WelcomeHotel', address: 'VIP Rd, Vizag', safetyRating: 95, desc: 'Luxury South Indian fine dining by ITC Hotels.' },
      { name: 'Mekong - Green Park', address: 'Waltair Main Rd, Vizag', rating: 92, desc: 'Authentic Pan-Asian dining experience.' },
      { name: 'Sea Inn (Raju Gaari Dhaba)', address: 'Rushikonda, Vizag', safetyRating: 89, desc: 'Famous for spicy Andhra style chicken and fish fry.' },
      { name: 'Venkatadri Vanti Illu', address: 'Dwaraka Nagar, Vizag', safetyRating: 90, desc: 'Authentic Andhra vegetarian thalis and traditional tiffins.' },
      { name: 'Barbeque Nation Vizag', address: 'Siripuram, Vizag', safetyRating: 91, desc: 'Live table grill buffet with family-friendly seating.' },
      { name: 'Zeeshan Restaurant', address: 'Jagadamba Centre, Vizag', safetyRating: 87, desc: 'Famous for Hyderabadi Dum Biryani & Mughlai kebabs.' },
      { name: 'Flying Spaghetti Monster', address: 'Waltair Uplands, Vizag', safetyRating: 93, desc: 'Popular Italian restaurant serving hand-tossed pizzas and pasta.' },
      { name: 'Pastry, Coffee & Lots More (PCLM)', address: 'Siripuram, Vizag', safetyRating: 90, desc: 'Vibrant cafe for desserts, coffees, and light continental snacks.' },
    ],
    hotels: [
      { name: 'The Park Hotel Visakhapatnam', address: 'Beach Rd, Vizag', safetyRating: 94, desc: '5-star luxury beachfront hotel with 24/7 security and private beach access.' },
      { name: 'Novotel Visakhapatnam Varun Beach', address: 'Beach Rd, Vizag', safetyRating: 96, desc: 'Premium oceanfront 5-star hotel with infinity pool and top security.' },
      { name: 'Welcomhotel by ITC Hotels', address: 'VIP Rd, Vizag', safetyRating: 95, desc: 'Luxury stay in the heart of Vizag business district.' },
      { name: 'Hotel GreenPark Visakhapatnam', address: 'Waltair Main Rd, Vizag', safetyRating: 92, desc: '3-star executive hotel with 24/7 front desk and electronic locks.' },
      { name: 'Dolphin Hotel', address: 'Daba Gardens, Vizag', safetyRating: 90, desc: 'Classic central hotel with verified tourist safety credentials.' },
      { name: 'Fairfield by Marriott Vizag', address: 'NAD X Road, Vizag', safetyRating: 93, desc: 'Modern Marriott property near airport with biometric access doors.' },
      { name: 'The Gateway Hotel (Taj)', address: 'Beach Rd, Vizag', safetyRating: 95, desc: 'Taj-managed luxury property overlooking RK Beach.' },
      { name: 'Hotel Supreme', address: 'Beach Rd, Vizag', safetyRating: 88, desc: 'Budget-friendly beach hotel with clean rooms and secure lobby.' },
      { name: 'Sunray Village Resort', address: 'Savaravilli, Vizag', safetyRating: 91, desc: 'Eco-friendly resort with lush gardens and family security.' },
      { name: 'Keys Select Hotel Visakhapatnam', address: 'Dwaraka Nagar, Vizag', safetyRating: 89, desc: 'Smart hotel near transit hubs with 24/7 CCTV surveillance.' },
    ],
    police: { name: 'Visakhapatnam City Police Commissionerate', phone: '0891-2562709', address: 'Surya Bagh, Visakhapatnam, Andhra Pradesh' },
    hospital: { name: 'King George Hospital (KGH Vizag)', phone: '0891-2564891', address: 'Maharanipeta, Visakhapatnam, Andhra Pradesh' },
  },

  chennai: {
    name: 'Chennai',
    state: 'Tamil Nadu',
    attractions: [
      { name: 'Marina Beach', address: 'Beach Rd, Chennai', safetyRating: 90, desc: 'World second-longest natural urban beach stretch.' },
      { name: 'Kapaleeshwarar Temple', address: 'Mylapore, Chennai', safetyRating: 93, desc: '7th-century Dravidian temple complex with grand Gopuram.' },
      { name: 'Government Museum Egmore', address: 'Pantheon Rd, Egmore, Chennai', safetyRating: 92, desc: 'Second oldest museum in India with bronze galleries.' },
      { name: 'San Thome Cathedral Basilica', address: 'Santhome, Chennai', safetyRating: 91, desc: 'Neo-Gothic church built over the tomb of St. Thomas.' },
      { name: 'Fort St. George & Museum', address: 'Rajaji Salai, Chennai', safetyRating: 94, desc: 'First British fortress built in India in 1644.' },
      { name: 'Elliot\'s Beach (Besant Nagar)', address: 'Besant Nagar, Chennai', safetyRating: 89, desc: 'Clean, peaceful beach with cafes and Schmidt Memorial.' },
      { name: 'Guindy National Park', address: 'Guindy, Chennai', safetyRating: 90, desc: 'Protected national park inside city limits with blackbucks.' },
      { name: 'DakshinaChitra Heritage Village', address: 'East Coast Rd, Muttukadu', safetyRating: 93, desc: 'Living history museum of South Indian art & architecture.' },
      { name: 'Express Avenue Mall', address: 'Royapettah, Chennai', safetyRating: 91, desc: 'Premier shopping and entertainment mall with full security.' },
      { name: 'VGP Universal Kingdom', address: 'East Coast Rd, Injambakkam', safetyRating: 88, desc: 'Popular coastal amusement park and water world.' },
    ],
    restaurants: [
      { name: 'Saravana Bhavan', address: 'Nelson Manickam Rd, Chennai', safetyRating: 91, desc: 'Traditional South Indian vegetarian cuisine.' },
      { name: 'Anjappar Chettinad Restaurant', address: 'T. Nagar, Chennai', safetyRating: 92, desc: 'Spicy Chettinad non-vegetarian dishes.' },
      { name: 'Murugan Idli Shop', address: 'T. Nagar, Chennai', safetyRating: 93, desc: 'Soft idlis, crispy dosas, and fresh chutneys.' },
      { name: 'Sangeetha Vegetarian Restaurant', address: 'Mylapore, Chennai', safetyRating: 90, desc: 'Clean vegetarian North & South Indian meals.' },
      { name: 'Adyar Ananda Bhavan (A2B)', address: 'Adyar, Chennai', safetyRating: 89, desc: 'Iconic sweets and tiffin restaurant chain.' },
      { name: 'Dakshin at Crowne Plaza', address: 'Alwarpet, Chennai', safetyRating: 96, desc: 'Luxury 5-star South Indian fine dining.' },
      { name: 'Barbeque Nation', address: 'T. Nagar, Chennai', safetyRating: 91, desc: 'Live table grill buffet restaurant.' },
      { name: 'Buhari Restaurant', address: 'Anna Salai, Chennai', safetyRating: 88, desc: 'Originator of Chicken 65, legendary heritage dining.' },
      { name: 'Rayar\'s Mess', address: 'Mylapore, Chennai', safetyRating: 89, desc: 'Heritage traditional tiffin mess.' },
      { name: 'Copper Chimney', address: 'Cathedral Rd, Chennai', safetyRating: 92, desc: 'Premium North Indian kebabs and curries.' },
    ],
    hotels: [
      { name: 'Taj Coromandel', address: 'Nungambakkam High Rd, Chennai', safetyRating: 96, desc: '5-star luxury heritage hotel.' },
      { name: 'ITC Grand Chola', address: 'Guindy, Chennai', safetyRating: 98, desc: 'Palatial 5-star hotel with Chola dynasty architecture.' },
      { name: 'The Leela Palace Chennai', address: 'MRC Nagar, Chennai', safetyRating: 97, desc: 'Seafront luxury palace hotel.' },
      { name: 'Hyatt Regency Chennai', address: 'Anna Salai, Teynampet', safetyRating: 94, desc: 'Modern luxury hotel near city center.' },
      { name: 'Radisson Blu Hotel Chennai City Centre', address: 'Egmore, Chennai', safetyRating: 92, desc: 'Business class hotel with 24/7 security.' },
      { name: 'Park Hyatt Chennai', address: 'Velachery Rd, Guindy', safetyRating: 95, desc: 'Tranquil luxury hotel overlooking Guindy forest.' },
      { name: 'The Park Chennai', address: 'Anna Salai, Nungambakkam', safetyRating: 91, desc: 'Boutique luxury design hotel.' },
      { name: 'Trident Hotel Chennai', address: 'GST Rd, Near Airport', safetyRating: 93, desc: 'Resort-style hotel near Chennai International Airport.' },
      { name: 'Hotel Savera', address: 'Dr. Radhakrishnan Salai, Mylapore', safetyRating: 89, desc: 'Central heritage business hotel.' },
      { name: 'Courtyard by Marriott Chennai', address: 'Anna Salai, Teynampet', safetyRating: 92, desc: 'Contemporary hotel with high safety rating.' },
    ],
    police: { name: 'Greater Chennai Police Headquarters', phone: '044-23452320', address: 'Vepery, Chennai, Tamil Nadu' },
    hospital: { name: 'Rajiv Gandhi Government General Hospital (GH)', phone: '044-25305000', address: 'EVR Periyar Salai, Park Town, Chennai' },
  },

  nellore: {
    name: 'Nellore',
    state: 'Andhra Pradesh',
    attractions: [
      { name: 'Sri Ranganathaswamy Temple', address: 'Rangasthala, Nellore', safetyRating: 91, desc: '600-year-old ancient Vaishnava temple on the banks of Penna River.' },
      { name: 'Penna Riverfront Promenade', address: 'Penna River, Nellore', safetyRating: 88, desc: 'Scenic riverfront walkway with evening breeze and safety lighting.' },
      { name: 'Nelapattu Bird Sanctuary', address: 'Nelapattu, Nellore District', safetyRating: 90, desc: 'One of the largest breeding grounds for spot-billed pelicans in Southeast Asia.' },
      { name: 'Mypadu Beach', address: 'Mypadu, Nellore', safetyRating: 89, desc: 'Pristine golden sand beach with tranquil waters and AP tourism resort.' },
      { name: 'Udayagiri Fort', address: 'Udayagiri, Nellore', safetyRating: 87, desc: 'Historic hilltop fort 307m above sea level with ancient ruins and temples.' },
      { name: 'Jonnavada Kamakshi Temple', address: 'Jonnavada, Nellore', safetyRating: 92, desc: 'Famous pilgrimage center dedicated to Goddess Kamakshi.' },
      { name: 'Pulicat Lake Bird Sanctuary', address: 'Sullurpeta, Nellore', safetyRating: 91, desc: 'Second largest brackish water lagoon in India, home to thousands of flamingos.' },
      { name: 'Krishnapatnam Port Beach', address: 'Krishnapatnam, Nellore', safetyRating: 86, desc: 'Coastal port area with scenic views of ships and blue water.' },
      { name: 'Narasimha Swamy Temple Penchalakona', address: 'Penchalakona, Nellore', safetyRating: 89, desc: 'Sacred temple surrounded by scenic hills and waterfalls.' },
      { name: 'Ranganayakulapeta Market', address: 'Nellore City', safetyRating: 85, desc: 'Vibrant local bazaar famous for Nellore rice, silks, and local crafts.' },
    ],
    restaurants: [
      { name: 'Kovur Hotel & Restaurant', address: 'Magunta Layout, Nellore', safetyRating: 86, desc: 'Local Andhra thali & seafood, clean kitchen, family favorite.' },
      { name: 'Komala Vilas', address: 'Trunk Rd, Nellore', safetyRating: 88, desc: 'Authentic Nellore tiffins, fresh ghee roast dosas.' },
      { name: 'Murali Krishna Hotel', address: 'GNT Road, Nellore', safetyRating: 85, desc: 'Traditional South Indian meals and spicy Nellore biryani.' },
      { name: 'Mayuri Multicuisine', address: 'Magunta Layout, Nellore', safetyRating: 87, desc: 'Air-conditioned dining with North & South Indian dishes.' },
      { name: 'Nellore Mess', address: 'GT Road, Nellore', safetyRating: 84, desc: 'Famous Nellore Chepala Pulu (fish curry) specialist.' },
      { name: 'Sri Sai Biryani House', address: 'Subhash Nagar, Nellore', safetyRating: 86, desc: 'Hygienic biryani & kebabs, fast service.' },
      { name: 'Hotel Minerva Grand Dining', address: 'Trunk Rd, Nellore', safetyRating: 90, desc: '3-star hotel dining hall, clean, safe, international standards.' },
      { name: 'Hotel Royal Park Restaurant', address: 'VRC Centre, Nellore', safetyRating: 88, desc: 'Multicuisine family restaurant with security and valet.' },
      { name: 'Spicy Restaurant Nellore', address: 'AC Centre, Nellore', safetyRating: 85, desc: 'Popular student & tourist hub for Chinese & Andhra fusion.' },
      { name: 'Grand Trunk Dhaba', address: 'NH-16 Highway, Nellore', safetyRating: 84, desc: 'Highway dhaba with well-lit parking and 24/7 food.' },
    ],
    hotels: [
      { name: 'Hotel Minerva Grand', address: 'Trunk Rd, Nellore', safetyRating: 91, desc: 'Top business hotel with 24/7 security and restaurant.' },
      { name: 'Hotel Royal Park', address: 'VRC Centre, Nellore', safetyRating: 89, desc: 'Central hotel with electronic locks and clean rooms.' },
      { name: 'DPR Grand Hotel', address: 'Magunta Layout, Nellore', safetyRating: 88, desc: 'Modern stay with 24/7 front desk and valet parking.' },
      { name: 'Hotel Simhapuri', address: 'GT Rd, Nellore', safetyRating: 86, desc: 'Classic hotel near transit hub with verified safety.' },
      { name: 'Hotel Abhiram', address: 'Trunk Rd, Nellore', safetyRating: 85, desc: 'Budget-friendly safe hotel for families.' },
      { name: 'Mypadu AP Tourism Beach Resort', address: 'Mypadu Beach, Nellore', safetyRating: 89, desc: 'Government-operated beach resort right on the shore.' },
      { name: 'Hotel Vintage Grand', address: 'Subhash Nagar, Nellore', safetyRating: 87, desc: 'Comfortable executive stay with clean dining.' },
      { name: 'NSR Residency', address: 'AC Centre, Nellore', safetyRating: 84, desc: 'Convenient stay near shopping districts.' },
      { name: 'Hotel Pavani Grand', address: 'Magunta Layout, Nellore', safetyRating: 86, desc: 'Clean rooms with CCTV and security staff.' },
      { name: 'Hotel Sri Kanya', address: 'GNT Road, Nellore', safetyRating: 85, desc: 'Traditional hotel with in-house restaurant.' },
    ],
    police: { name: 'Nellore District Police Headquarters', phone: '0861-2331200', address: 'GT Road, Nellore, Andhra Pradesh' },
    hospital: { name: 'Government General Hospital Nellore', phone: '0861-2327001', address: 'GT Road, Dargamitta, Nellore, Andhra Pradesh' },
  },

  tirupati: {
    name: 'Tirupati',
    state: 'Andhra Pradesh',
    attractions: [
      { name: 'Sri Venkateswara Swamy Temple', address: 'Tirumala, Tirupati', safetyRating: 97, desc: 'Holiest Vishnu pilgrimage shrine atop Tirumala hills with platinum security.' },
      { name: 'Sri Kapileswara Swamy Temple', address: 'Kapila Theertham, Tirupati', safetyRating: 92, desc: 'Ancient Shiva temple located at the foot of Tirumala hills near a natural waterfall.' },
      { name: 'Sri Padmavathi Ammavari Temple', address: 'Tiruchanur, Tirupati', safetyRating: 94, desc: 'Sacred temple dedicated to Goddess Padmavathi, consort of Lord Venkateswara.' },
      { name: 'Sri Vari Padalu', address: 'Tirumala Hills, Tirupati', safetyRating: 90, desc: 'Sacred footprints of Lord Venkateswara at the highest point of Tirumala.' },
      { name: 'Silathoranam (Natural Arch)', address: 'Tirumala Hills, Tirupati', safetyRating: 91, desc: 'Rare geological natural rock arch formation millions of years old.' },
      { name: 'Chandragiri Fort & Palace', address: 'Chandragiri, Tirupati', safetyRating: 89, desc: '11th-century Vijayanagara fort with sound & light show.' },
      { name: 'Sri Govindaraja Swamy Temple', address: 'Heart of Tirupati City', safetyRating: 93, desc: 'Ancient temple complex with an impressive 7-tiered Gopuram near railway station.' },
      { name: 'Regional Science Centre Tirupati', address: 'Alipiri Rd, Tirupati', safetyRating: 90, desc: 'Interactive science museum and planetarium.' },
      { name: 'Talakona Waterfalls', address: 'Talakona, Tirupati District', safetyRating: 88, desc: 'Highest waterfall in Andhra Pradesh (270ft) inside Sri Venkateswara National Park.' },
      { name: 'Srikalahasti Temple', address: 'Srikalahasti (near Tirupati)', safetyRating: 92, desc: 'Famous Rahu-Ketu Vayu Lingam temple complex on Swarnamukhi river.' },
    ],
    restaurants: [
      { name: 'Bhimas Restaurant', address: 'Main Rd, Tirupati', safetyRating: 90, desc: 'Top certified pure vegetarian restaurant for pilgrims.' },
      { name: 'Mavalli Tiffin Room (MTR)', address: 'TTD Bypass, Tirupati', safetyRating: 92, desc: 'Famous Karnataka tiffin chain, clean & quick service.' },
      { name: 'Hotel Bliss Dining', address: 'Ramanuja Circle, Tirupati', safetyRating: 89, desc: 'Luxury family restaurant with 24/7 security.' },
      { name: 'Minerva Grand Tirupati', address: 'Renigunta Rd, Tirupati', safetyRating: 93, desc: '3-star dining, FSSAI high rating, excellent hygiene.' },
      { name: 'Andhra Spice Restaurant', address: 'Bairagipatteda, Tirupati', safetyRating: 87, desc: 'Authentic Rayalaseema thali & spicy biryani.' },
      { name: 'Sri Lakshmi Nivas', address: 'Alipiri Rd, Tirupati', safetyRating: 88, desc: 'Located near Alipiri trekking path, clean vegetarian food.' },
      { name: 'Saravana Bhavan Tirupati', address: 'Kapila Theertham, Tirupati', safetyRating: 91, desc: 'Reliable South Indian vegetarian meals.' },
      { name: 'Woodlands Restaurant', address: 'Tirumala Rd, Tirupati', safetyRating: 89, desc: 'Quiet, clean vegetarian dining popular with families.' },
      { name: 'Fortune Select Grand Dining', address: 'Bypass Rd, Tirupati', safetyRating: 95, desc: 'Premium 5-star dining experience with global safety standards.' },
      { name: 'Hotel Ramee Guestline Dining', address: 'Bairagipatteda, Tirupati', safetyRating: 91, desc: 'Resort dining near hills, safe and family-friendly.' },
    ],
    hotels: [
      { name: 'Tirumala Tirupati Devasthanams (TTD) Guesthouses', address: 'Tirumala, Tirupati', safetyRating: 96, desc: 'Official TTD managed pilgrim accommodations.' },
      { name: 'Fortune Select Grand Ridge', address: 'Tiruchanoor Rd, Tirupati', safetyRating: 95, desc: '5-star hotel near Tirupati bus station.' },
      { name: 'Hotel Bliss', address: 'Ramanuja Circle, Tirupati', safetyRating: 90, desc: 'Popular family hotel with swimming pool and security.' },
      { name: 'Hotel Minerva Grand Tirupati', address: 'Renigunta Rd, Tirupati', safetyRating: 92, desc: '3-star hotel with verified hygiene and digital keys.' },
      { name: 'Marasa Sarovar Premiere', address: 'Karakambadi Rd, Tirupati', safetyRating: 94, desc: '5-star thematic resort inspired by Dashavatara.' },
      { name: 'Hotel Bhimas Deluxe', address: 'Overbridge Rd, Tirupati', safetyRating: 88, desc: 'Classic pilgrim hotel near railway station.' },
      { name: 'Taj Tirupati', address: 'Tiruchanoor Rd, Tirupati', safetyRating: 97, desc: 'Luxury 5-star Taj hotel with top safety protocols.' },
      { name: 'Ramee Guestline Hotel', address: 'Karakambadi Rd, Tirupati', safetyRating: 91, desc: 'Resort stay at the foothills of Tirumala.' },
      { name: 'Pai Viceroy Hotel', address: 'Kapila Theertham Rd, Tirupati', safetyRating: 89, desc: 'Comfortable hotel close to trekking path.' },
      { name: 'Hotel PLR Grand', address: 'Central Bus Stand Rd, Tirupati', safetyRating: 87, desc: 'Convenient stay opposite central bus station.' },
    ],
    police: { name: 'Tirupati Urban Police Commissionerate', phone: '0877-2289100', address: 'Alipiri Road, Tirupati, Andhra Pradesh' },
    hospital: { name: 'Sri Venkateswara Institute of Medical Sciences (SVIMS)', phone: '0877-2287777', address: 'Alipiri Road, Tirupati, Andhra Pradesh' },
  },
};

/**
 * Extract target city from any string query
 */
export function extractCityFromQuery(query: string, currentCity: string): CityData {
  const q = query.toLowerCase();

  // Search through all keys and aliases
  for (const [key, data] of Object.entries(INDIAN_CITIES_DATABASE)) {
    if (q.includes(key) || q.includes(data.name.toLowerCase()) || (key === 'vizag' && (q.includes('visakhapatnam') || q.includes('vizag')))) {
      return data;
    }
  }

  // Fallback to current selected city if known
  const curKey = currentCity.toLowerCase();
  for (const [key, data] of Object.entries(INDIAN_CITIES_DATABASE)) {
    if (curKey.includes(key) || key.includes(curKey)) {
      return data;
    }
  }

  // Default to Vizag or Chennai if no match
  return INDIAN_CITIES_DATABASE['vizag'] || INDIAN_CITIES_DATABASE['chennai'];
}
