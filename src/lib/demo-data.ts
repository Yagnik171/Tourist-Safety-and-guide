// ============================================================
// Demo / Mock data for development and presentations
// Used when Supabase is not configured or DEMO_MODE=true
// ============================================================

import type {
  Location,
  SafetyRating,
  SafetyAlert,
  IncidentReport,
  EmergencyContact,
  LocalRecommendation,
  ChatMessage,
  Profile,
  SOSAlert,
} from '@/types';

// ---- Demo Locations ----

export const DEMO_LOCATIONS: Location[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Chennai City',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    latitude: 13.0827,
    longitude: 80.2707,
    description: 'The capital of Tamil Nadu, known for its long sandy beaches, temples, and rich cultural heritage.',
    timezone: 'Asia/Kolkata',
    population: 10971108,
    area_km2: 426,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    name: 'Mumbai City',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    latitude: 19.0760,
    longitude: 72.8777,
    description: 'The financial capital of India, home to Bollywood and iconic landmarks.',
    timezone: 'Asia/Kolkata',
    population: 20667656,
    area_km2: 603,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    name: 'Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.2090,
    description: 'The capital of India with a rich history spanning thousands of years.',
    timezone: 'Asia/Kolkata',
    population: 32941000,
    area_km2: 1484,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
    name: 'Bengaluru City',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.9716,
    longitude: 77.5946,
    description: 'The Silicon Valley of India, known for its tech parks and cosmopolitan culture.',
    timezone: 'Asia/Kolkata',
    population: 13193000,
    area_km2: 741,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'e5f6a7b8-c9d0-1234-efab-345678901234',
    name: 'Marina Beach',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    latitude: 13.0499,
    longitude: 80.2824,
    description: 'One of the longest natural urban beaches in the world, stretching over 13 km.',
    timezone: 'Asia/Kolkata',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// ---- Demo Safety Ratings ----

export const DEMO_SAFETY_RATINGS: Record<string, SafetyRating> = {
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890': {
    id: 'sr-1',
    location_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    overall_score: 72,
    crime_score: 68,
    weather_score: 75,
    hazard_score: 70,
    community_score: 78,
    political_stability_score: 74,
    calculated_at: new Date().toISOString(),
    is_current: true,
    calculation_notes: 'Baseline score for Chennai',
  },
  'b2c3d4e5-f6a7-8901-bcde-f12345678901': {
    id: 'sr-2',
    location_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    overall_score: 69,
    crime_score: 65,
    weather_score: 72,
    hazard_score: 68,
    community_score: 74,
    political_stability_score: 71,
    calculated_at: new Date().toISOString(),
    is_current: true,
    calculation_notes: 'Baseline score for Mumbai',
  },
  'c3d4e5f6-a7b8-9012-cdef-123456789012': {
    id: 'sr-3',
    location_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    overall_score: 65,
    crime_score: 60,
    weather_score: 70,
    hazard_score: 65,
    community_score: 68,
    political_stability_score: 72,
    calculated_at: new Date().toISOString(),
    is_current: true,
    calculation_notes: 'Baseline score for Delhi',
  },
  'd4e5f6a7-b8c9-0123-defa-234567890123': {
    id: 'sr-4',
    location_id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
    overall_score: 78,
    crime_score: 74,
    weather_score: 80,
    hazard_score: 76,
    community_score: 82,
    political_stability_score: 80,
    calculated_at: new Date().toISOString(),
    is_current: true,
    calculation_notes: 'Baseline score for Bengaluru',
  },
};

// ---- Demo Safety Alerts ----

export const DEMO_ALERTS: SafetyAlert[] = [
  {
    id: 'alert-1',
    location_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    title: 'Heavy Rainfall Warning',
    description: 'IMD has issued heavy rainfall warning for Chennai coastal areas. Avoid low-lying zones and beach areas during high tide.',
    severity: 'moderate',
    alert_type: 'weather',
    is_active: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    location: { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Chennai City', city: 'Chennai' },
  },
  {
    id: 'alert-2',
    location_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    title: 'High Tide Advisory Mumbai Coast',
    description: 'High tide expected along Mumbai coastline. Stay away from Marine Drive and Juhu Beach after 6 PM.',
    severity: 'high',
    alert_type: 'weather',
    is_active: true,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    location: { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', name: 'Mumbai City', city: 'Mumbai' },
  },
  {
    id: 'alert-3',
    location_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    title: 'Air Quality Alert Delhi',
    description: 'AQI in Delhi has reached Unhealthy levels (AQI: 185). Wear masks outdoors.',
    severity: 'moderate',
    alert_type: 'health',
    is_active: true,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    location: { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', name: 'Delhi', city: 'New Delhi' },
  },
];

// ---- Demo Incidents ----

export const DEMO_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-1',
    reporter_id: 'demo-tourist',
    location_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    category: 'theft',
    title: 'Phone Snatching at Marina Beach',
    description: 'My phone was snatched by a person on a motorcycle near the northern end of Marina Beach during evening hours. Be cautious of your belongings.',
    severity: 'high',
    latitude: 13.0542,
    longitude: 80.2824,
    address: 'Near Lighthouse, Marina Beach',
    status: 'verified',
    incident_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reporter: { id: 'demo-tourist', name: 'Priya S.', profile_image: undefined, verification_status: 'verified' },
  },
  {
    id: 'inc-2',
    reporter_id: 'demo-tourist',
    location_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    category: 'scam',
    title: 'Overcharging by Auto Drivers',
    description: 'Auto rickshaw drivers near Central Railway Station are demanding 3-4x the meter rate from tourists. Use app-based cabs instead.',
    severity: 'medium',
    latitude: 13.0827,
    longitude: 80.2707,
    address: 'Chennai Central Railway Station',
    status: 'verified',
    incident_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    reporter: { id: 'demo-tourist', name: 'Rahul M.', profile_image: undefined, verification_status: 'verified' },
  },
  {
    id: 'inc-3',
    reporter_id: 'demo-tourist',
    location_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    category: 'road_hazard',
    title: 'Large Pothole on Anna Salai',
    description: 'Dangerous pothole near Gemini flyover on Anna Salai. Two motorcycles fell. Reported to CMDA.',
    severity: 'medium',
    latitude: 13.0588,
    longitude: 80.2500,
    address: 'Anna Salai, near Gemini Flyover',
    status: 'pending',
    incident_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    reporter: { id: 'demo-tourist', name: 'Arun K.', profile_image: undefined, verification_status: 'unverified' },
  },
  {
    id: 'inc-4',
    reporter_id: 'demo-tourist',
    location_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    category: 'harassment',
    title: 'Fake Guides at Gateway of India',
    description: 'Unlicensed guides aggressively soliciting tourists near Gateway of India. Verify guide credentials before hiring.',
    severity: 'low',
    latitude: 18.9220,
    longitude: 72.8347,
    address: 'Gateway of India, Mumbai',
    status: 'verified',
    incident_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reporter: { id: 'demo-tourist', name: 'Sarah J.', profile_image: undefined, verification_status: 'verified' },
  },
];

// ---- Demo Emergency Contacts ----

export const DEMO_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: 'ec-1', location_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', organization: 'Chennai City Police', type: 'police', phone: '100', is_24x7: true, address: 'Commissioner of Police Office, Vepery', is_active: true, created_at: '2024-01-01T00:00:00Z', latitude: 13.0914, longitude: 80.2769 },
  { id: 'ec-2', location_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', organization: 'Tamil Nadu Fire Service', type: 'fire', phone: '101', is_24x7: true, address: 'Fire Station, Anna Salai', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'ec-3', location_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', organization: 'GH Emergency Ambulance', type: 'ambulance', phone: '108', is_24x7: true, address: 'Government General Hospital, Park Town', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'ec-4', location_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', organization: 'Govt General Hospital', type: 'hospital', phone: '044-25305000', is_24x7: true, address: 'Park Town, Chennai', is_active: true, created_at: '2024-01-01T00:00:00Z', latitude: 13.0795, longitude: 80.2760 },
];

// ---- Demo Chat Messages ----

export const DEMO_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender_id: 'user-1',
    region_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    message: 'Is Marina Beach safe right now?',
    is_system_message: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    sender: { id: 'user-1', name: 'Tourist_Ananya', profile_image: undefined },
  },
  {
    id: 'msg-2',
    sender_id: 'user-2',
    region_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    message: 'Yes, I\'m here right now. Very crowded on the northern side but safe.',
    is_system_message: false,
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    sender: { id: 'user-2', name: 'Traveler_Karthik', profile_image: undefined },
  },
  {
    id: 'msg-3',
    sender_id: 'user-3',
    region_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    message: 'Avoid the northern road near the lighthouse, there was an accident earlier.',
    is_system_message: false,
    created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    sender: { id: 'user-3', name: 'Local_Guide_Ravi', profile_image: undefined },
  },
  {
    id: 'msg-4',
    sender_id: 'user-4',
    region_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    message: 'Thanks for the update! What time does the beach get less crowded?',
    is_system_message: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    sender: { id: 'user-4', name: 'Tourist_Sarah', profile_image: undefined },
  },
  {
    id: 'msg-5',
    sender_id: 'user-2',
    region_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    message: 'Early morning (5-7 AM) is the best and safest time. Fewer people and beautiful sunrise!',
    is_system_message: false,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    sender: { id: 'user-2', name: 'Traveler_Karthik', profile_image: undefined },
  },
];

// ---- Demo Profile ----

export const DEMO_TOURIST_PROFILE: Profile = {
  id: 'demo-tourist-id',
  name: 'Demo Tourist',
  email: 'tourist@safewander.demo',
  phone: '+91 9876543210',
  role: 'tourist',
  verification_status: 'verified',
  emergency_contact_name: 'Priya (Sister)',
  emergency_contact_phone: '+91 9876543200',
  emergency_contact_email: 'priya@example.com',
  preferred_language: 'en',
  is_safety_mode_active: false,
  checkin_interval_minutes: 30,
  current_latitude: 13.0827,
  current_longitude: 80.2707,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: new Date().toISOString(),
};

export const DEMO_ADMIN_PROFILE: Profile = {
  id: 'demo-admin-id',
  name: 'Admin User',
  email: 'admin@safewander.demo',
  role: 'admin',
  verification_status: 'verified',
  preferred_language: 'en',
  is_safety_mode_active: false,
  checkin_interval_minutes: 30,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: new Date().toISOString(),
};

// ---- Demo SOS Alerts (for admin dashboard) ----

export const DEMO_SOS_ALERTS: SOSAlert[] = [
  {
    id: 'sos-demo-1',
    tourist_id: 'demo-tourist-id',
    latitude: 13.0499,
    longitude: 80.2824,
    location_description: 'Near Marina Beach Lighthouse',
    status: 'demo',
    is_demo: true,
    authority_notified: false,
    emergency_contact_notified: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    tourist: {
      id: 'demo-tourist-id',
      name: 'Demo Tourist',
      phone: '+91 9876543210',
      emergency_contact_name: 'Priya (Sister)',
      emergency_contact_phone: '+91 9876543200',
    },
  },
];

// ---- Search helper ----

export function searchLocations(query: string): Location[] {
  if (!query) return DEMO_LOCATIONS;
  const q = query.toLowerCase();
  return DEMO_LOCATIONS.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.state?.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q)
  );
}
