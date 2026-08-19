// ============================================================
// App Constants
// ============================================================

// ---- App Info ----

export const APP_NAME = 'SafeWander';
export const APP_TAGLINE = 'Travel Freely. Travel Safely.';
export const APP_DESCRIPTION =
  'A real-time tourist safety and communication platform combining safety intelligence, community reports, emergency assistance, and safer navigation.';

// ---- Demo Mode ----

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
export const DEMO_TOURIST_EMAIL = 'tourist@safewander.demo';
export const DEMO_ADMIN_EMAIL = 'admin@safewander.demo';
export const DEMO_PASSWORD = 'Demo@123456';

// ---- Map Defaults ----

export const DEFAULT_MAP_CENTER: [number, number] = [13.0827, 80.2707]; // Chennai
export const DEFAULT_MAP_ZOOM = 12;
export const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
export const INDIA_ZOOM = 5;

// ---- Safety Thresholds ----

export const SAFETY_THRESHOLDS = {
  SAFE: 75,
  MODERATE: 55,
  CAUTION: 35,
} as const;

// ---- Score Colors ----

export const SCORE_COLORS = {
  safe: {
    primary: '#22c55e',
    bg: 'bg-green-500',
    text: 'text-green-400',
    border: 'border-green-500',
    badge: 'bg-green-500/10 text-green-400 border border-green-500/30',
  },
  moderate: {
    primary: '#eab308',
    bg: 'bg-yellow-500',
    text: 'text-yellow-400',
    border: 'border-yellow-500',
    badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
  },
  caution: {
    primary: '#f97316',
    bg: 'bg-orange-500',
    text: 'text-orange-400',
    border: 'border-orange-500',
    badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
  },
  high_risk: {
    primary: '#ef4444',
    bg: 'bg-red-500',
    text: 'text-red-400',
    border: 'border-red-500',
    badge: 'bg-red-500/10 text-red-400 border border-red-500/30',
  },
} as const;

// ---- Alert Severity Colors ----

export const ALERT_SEVERITY_COLORS = {
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  low: 'text-green-400 bg-green-500/10 border-green-500/30',
  moderate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  critical: 'text-red-400 bg-red-500/10 border-red-500/30',
} as const;

// ---- Incident Category Labels ----

export const INCIDENT_CATEGORY_LABELS: Record<string, string> = {
  theft: 'Theft',
  harassment: 'Harassment',
  unsafe_area: 'Unsafe Area',
  accident: 'Accident',
  natural_hazard: 'Natural Hazard',
  suspicious_activity: 'Suspicious Activity',
  scam: 'Scam',
  road_hazard: 'Road Hazard',
  other: 'Other',
};

// ---- Emergency Contact Type Labels ----

export const EMERGENCY_TYPE_LABELS: Record<string, string> = {
  police: 'Police',
  hospital: 'Hospital',
  ambulance: 'Ambulance',
  fire: 'Fire Service',
  embassy: 'Embassy/Consulate',
  coast_guard: 'Coast Guard',
  mountain_rescue: 'Mountain Rescue',
  other: 'Emergency Service',
};

// ---- National Emergency Numbers (India) ----

export const NATIONAL_EMERGENCY = {
  police: '100',
  fire: '101',
  ambulance: '108',
  disaster: '108',
  women_helpline: '1091',
  child_helpline: '1098',
  tourist_helpline: '1800-111-363',
  emergency: '112',
} as const;

// ---- Recommendation Category Labels ----

export const RECOMMENDATION_CATEGORY_LABELS: Record<string, string> = {
  hotel: 'Hotel',
  restaurant: 'Restaurant',
  attraction: 'Attraction',
  hospital: 'Hospital',
  police_station: 'Police Station',
  shopping: 'Shopping',
  transport: 'Transport',
  other: 'Other',
};

// ---- Route Config ----

export const ROUTE_CONFIG = {
  walkingSpeedKmh: 5,
  drivingSpeedKmh: 30,
  safestDetourFactor: 1.2,
} as const;

// ---- Realtime channels ----

export const REALTIME_CHANNELS = {
  CHAT: (regionId: string) => `chat:${regionId}`,
  SOS: 'sos:global',
  INCIDENTS: 'incidents:global',
  ALERTS: 'alerts:global',
} as const;

// ---- Pagination ----

export const PAGE_SIZE = 20;
export const CHAT_PAGE_SIZE = 50;

// ---- SOS ----

export const SOS_COUNTDOWN_SECONDS = 3;
export const SOS_DEMO_DISCLAIMER =
  'DEMO SOS — NO REAL EMERGENCY SERVICE CONTACTED. This is a simulated emergency for demonstration purposes only.';

// ---- Animation Durations ----

export const ANIMATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  page: 0.4,
} as const;

// ---- Languages ----

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mr', name: 'Marathi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
];

// ---- Nav items ----

export const TOURIST_NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'layout-dashboard' },
  { label: 'Explore', href: '/explore', icon: 'search' },
  { label: 'Safety Map', href: '/map', icon: 'map' },
  { label: 'Alerts', href: '/alerts', icon: 'bell' },
  { label: 'Safe Routes', href: '/routes', icon: 'navigation' },
  { label: 'Community', href: '/community', icon: 'message-circle' },
  { label: 'Report Incident', href: '/report', icon: 'flag' },
  { label: 'Emergency', href: '/emergency', icon: 'phone' },
  { label: 'My Trip', href: '/itinerary', icon: 'calendar' },
  { label: 'Recommendations', href: '/recommendations', icon: 'star' },
  { label: 'Translate', href: '/translate', icon: 'languages' },
  { label: 'Safety Mode', href: '/safety-mode', icon: 'shield' },
  { label: 'Profile', href: '/profile', icon: 'user' },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: 'layout-dashboard' },
  { label: 'Live Map', href: '/admin/map', icon: 'map' },
  { label: 'SOS Alerts', href: '/admin/sos', icon: 'alert-octagon' },
  { label: 'Incidents', href: '/admin/incidents', icon: 'flag' },
  { label: 'Safety Analytics', href: '/admin/analytics', icon: 'bar-chart' },
  { label: 'Broadcast Alerts', href: '/admin/alerts', icon: 'bell' },
  { label: 'Users', href: '/admin/users', icon: 'users' },
  { label: 'Locations', href: '/admin/locations', icon: 'map-pin' },
  { label: 'Emergency Contacts', href: '/admin/emergency-contacts', icon: 'phone' },
] as const;
