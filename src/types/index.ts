// ============================================================
// SafeWander Platform — Core TypeScript Types
// ============================================================

// ---- Enums ----

export type UserRole = 'tourist' | 'admin' | 'authority' | 'guide';
export type VerificationStatus = 'unverified' | 'pending' | 'verified';
export type IncidentStatus = 'pending' | 'verified' | 'rejected';
export type IncidentCategory =
  | 'theft'
  | 'harassment'
  | 'unsafe_area'
  | 'accident'
  | 'natural_hazard'
  | 'suspicious_activity'
  | 'scam'
  | 'road_hazard'
  | 'other';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type SOSStatus = 'active' | 'resolved' | 'cancelled' | 'demo';
export type AlertType = 'weather' | 'crime' | 'traffic' | 'natural_disaster' | 'political' | 'health' | 'general';
export type AlertSeverity = 'info' | 'low' | 'moderate' | 'high' | 'critical';
export type RecommendationCategory =
  | 'hotel'
  | 'restaurant'
  | 'attraction'
  | 'hospital'
  | 'police_station'
  | 'shopping'
  | 'transport'
  | 'other';
export type EmergencyContactType =
  | 'police'
  | 'hospital'
  | 'ambulance'
  | 'fire'
  | 'embassy'
  | 'coast_guard'
  | 'mountain_rescue'
  | 'tourist_helpline'
  | 'other';

// ---- Risk Level ----

export type RiskLevel = 'safe' | 'moderate' | 'caution' | 'high_risk';

// ============================================================
// DATABASE ENTITIES
// ============================================================

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_image?: string;
  role: UserRole;
  verification_status: VerificationStatus;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_email?: string;
  current_latitude?: number;
  current_longitude?: number;
  bio?: string;
  nationality?: string;
  preferred_language: string;
  is_safety_mode_active: boolean;
  checkin_interval_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  description?: string;
  image_url?: string;
  timezone: string;
  population?: number;
  area_km2?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SafetyRating {
  id: string;
  location_id: string;
  overall_score: number;
  crime_score: number;
  weather_score: number;
  hazard_score: number;
  community_score: number;
  political_stability_score: number;
  calculated_at: string;
  is_current: boolean;
  calculation_notes?: string;
}

export interface IncidentReport {
  id: string;
  reporter_id: string;
  location_id?: string;
  category: IncidentCategory;
  title: string;
  description: string;
  severity: IncidentSeverity;
  latitude?: number;
  longitude?: number;
  address?: string;
  image_url?: string;
  status: IncidentStatus;
  verified_by?: string;
  verified_at?: string;
  admin_notes?: string;
  incident_at: string;
  created_at: string;
  updated_at: string;
  // Joined
  reporter?: Pick<Profile, 'id' | 'name' | 'profile_image' | 'verification_status'>;
  location?: Pick<Location, 'id' | 'name' | 'city'>;
}

export interface SOSAlert {
  id: string;
  tourist_id: string;
  latitude: number;
  longitude: number;
  location_description?: string;
  status: SOSStatus;
  is_demo: boolean;
  authority_notified: boolean;
  emergency_contact_notified: boolean;
  resolved_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
  // Joined
  tourist?: Pick<Profile, 'id' | 'name' | 'phone' | 'emergency_contact_name' | 'emergency_contact_phone'>;
}

export interface EmergencyContact {
  id: string;
  location_id?: string;
  name?: string;
  organization: string;
  type: EmergencyContactType;
  phone: string;
  alternate_phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  operating_hours?: string;
  is_24x7: boolean;
  is_active?: boolean;
  is_verified?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  region_id: string;
  message: string;
  is_system_message: boolean;
  created_at: string;
  // Joined
  sender?: Pick<Profile, 'id' | 'name' | 'profile_image'>;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  activities: {
    time?: string;
    activity: string;
    location?: string;
    notes?: string;
  }[];
}

export interface Itinerary {
  id: string;
  tourist_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description?: string;
  itinerary_details: ItineraryDay[];
  shared_with: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface SafetyAlert {
  id: string;
  location_id?: string;
  created_by?: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  alert_type: AlertType;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  // Joined
  location?: Pick<Location, 'id' | 'name' | 'city'>;
}

export interface LocalRecommendation {
  id: string;
  location_id: string;
  name: string;
  category: RecommendationCategory;
  safety_rating?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  description?: string;
  phone?: string;
  website?: string;
  image_url?: string;
  is_open_now?: boolean;
  operating_hours?: string;
  is_active: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface TranslationHistory {
  id: string;
  user_id: string;
  source_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  created_at: string;
}

// ============================================================
// SAFETY SCORE ENGINE TYPES
// ============================================================

export interface SafetyScoreInput {
  crime_score: number;
  weather_score: number;
  hazard_score: number;
  community_score: number;
  political_stability_score: number;
  verified_incidents_30d?: number;
  high_severity_incidents?: number;
}

export interface SafetyScoreResult {
  overall_score: number;
  risk_level: RiskLevel;
  risk_label: string;
  color: string;
  crime_score: number;
  weather_score: number;
  hazard_score: number;
  community_score: number;
  political_stability_score: number;
  explanation: string[];
}

// ============================================================
// ROUTE TYPES
// ============================================================

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface Route {
  points: RoutePoint[];
  distance_km: number;
  duration_minutes: number;
  safety_score: number;
  risk_level: RiskLevel;
  name: string;
  summary: string;
  hazard_notes: string[];
}

export interface RouteComparison {
  safest: Route;
  fastest: Route;
  recommendation: string;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================
// UI STATE TYPES
// ============================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapViewState {
  center: [number, number];
  zoom: number;
  selectedLocationId?: string;
}

// ============================================================
// DEMO DATA TYPES
// ============================================================

export interface DemoConfig {
  isDemo: boolean;
  demoUser: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}
