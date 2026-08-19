-- ============================================================
-- SafeWander Platform — Supabase Schema
-- Tourist Safety & Communication Platform
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('tourist', 'admin', 'authority', 'guide');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified');
CREATE TYPE incident_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE incident_category AS ENUM (
  'theft', 'harassment', 'unsafe_area', 'accident',
  'natural_hazard', 'suspicious_activity', 'scam',
  'road_hazard', 'other'
);
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE sos_status AS ENUM ('active', 'resolved', 'cancelled', 'demo');
CREATE TYPE alert_type AS ENUM (
  'weather', 'crime', 'traffic', 'natural_disaster',
  'political', 'health', 'general'
);
CREATE TYPE alert_severity AS ENUM ('info', 'low', 'moderate', 'high', 'critical');
CREATE TYPE recommendation_category AS ENUM (
  'hotel', 'restaurant', 'attraction', 'hospital',
  'police_station', 'shopping', 'transport', 'other'
);
CREATE TYPE emergency_contact_type AS ENUM (
  'police', 'hospital', 'ambulance', 'fire',
  'embassy', 'coast_guard', 'mountain_rescue', 'other'
);

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  profile_image TEXT,
  role user_role NOT NULL DEFAULT 'tourist',
  verification_status verification_status NOT NULL DEFAULT 'unverified',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_email TEXT,
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  bio TEXT,
  nationality TEXT,
  preferred_language TEXT DEFAULT 'en',
  is_safety_mode_active BOOLEAN DEFAULT false,
  checkin_interval_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LOCATIONS
-- ============================================================

CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  description TEXT,
  image_url TEXT,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  population INTEGER,
  area_km2 DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_locations_city ON public.locations(city);
CREATE INDEX idx_locations_country ON public.locations(country);

-- ============================================================
-- SAFETY RATINGS
-- ============================================================

CREATE TABLE public.safety_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  crime_score INTEGER NOT NULL CHECK (crime_score BETWEEN 0 AND 100),
  weather_score INTEGER NOT NULL CHECK (weather_score BETWEEN 0 AND 100),
  hazard_score INTEGER NOT NULL CHECK (hazard_score BETWEEN 0 AND 100),
  community_score INTEGER NOT NULL CHECK (community_score BETWEEN 0 AND 100),
  political_stability_score INTEGER NOT NULL CHECK (political_stability_score BETWEEN 0 AND 100),
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_current BOOLEAN DEFAULT true,
  calculation_notes TEXT
);

CREATE INDEX idx_safety_ratings_location ON public.safety_ratings(location_id);
CREATE INDEX idx_safety_ratings_current ON public.safety_ratings(location_id, is_current);

-- ============================================================
-- INCIDENT REPORTS
-- ============================================================

CREATE TABLE public.incident_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  category incident_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity incident_severity NOT NULL DEFAULT 'medium',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  image_url TEXT,
  status incident_status NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  admin_notes TEXT,
  incident_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_incidents_location ON public.incident_reports(location_id);
CREATE INDEX idx_incidents_status ON public.incident_reports(status);
CREATE INDEX idx_incidents_category ON public.incident_reports(category);
CREATE INDEX idx_incidents_reporter ON public.incident_reports(reporter_id);

-- ============================================================
-- SOS ALERTS
-- ============================================================

CREATE TABLE public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tourist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_description TEXT,
  status sos_status NOT NULL DEFAULT 'active',
  is_demo BOOLEAN NOT NULL DEFAULT false,
  authority_notified BOOLEAN DEFAULT false,
  emergency_contact_notified BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sos_tourist ON public.sos_alerts(tourist_id);
CREATE INDEX idx_sos_status ON public.sos_alerts(status);

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================

CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  organization TEXT NOT NULL,
  type emergency_contact_type NOT NULL,
  phone TEXT NOT NULL,
  alternate_phone TEXT,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  operating_hours TEXT,
  is_24x7 BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_emergency_contacts_location ON public.emergency_contacts(location_id);
CREATE INDEX idx_emergency_contacts_type ON public.emergency_contacts(type);

-- ============================================================
-- CHAT MESSAGES (Regional Community)
-- ============================================================

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  region_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_region ON public.chat_messages(region_id);
CREATE INDEX idx_chat_created ON public.chat_messages(created_at DESC);

-- ============================================================
-- ITINERARIES
-- ============================================================

CREATE TABLE public.itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tourist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  itinerary_details JSONB DEFAULT '[]',
  shared_with UUID[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_itineraries_tourist ON public.itineraries(tourist_id);

-- ============================================================
-- SAFETY ALERTS (Admin-broadcast)
-- ============================================================

CREATE TABLE public.safety_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'moderate',
  alert_type alert_type NOT NULL DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_safety_alerts_location ON public.safety_alerts(location_id);
CREATE INDEX idx_safety_alerts_active ON public.safety_alerts(is_active);

-- ============================================================
-- LOCAL RECOMMENDATIONS
-- ============================================================

CREATE TABLE public.local_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category recommendation_category NOT NULL,
  safety_rating INTEGER CHECK (safety_rating BETWEEN 0 AND 100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  description TEXT,
  phone TEXT,
  website TEXT,
  image_url TEXT,
  is_open_now BOOLEAN,
  operating_hours TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recommendations_location ON public.local_recommendations(location_id);
CREATE INDEX idx_recommendations_category ON public.local_recommendations(category);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  related_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);

-- ============================================================
-- TRANSLATION HISTORY
-- ============================================================

CREATE TABLE public.translation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_translation_user ON public.translation_history(user_id);

-- ============================================================
-- SAFE ROUTES (cached route results)
-- ============================================================

CREATE TABLE public.safe_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_lat DECIMAL(10, 8) NOT NULL,
  start_lng DECIMAL(11, 8) NOT NULL,
  end_lat DECIMAL(10, 8) NOT NULL,
  end_lng DECIMAL(11, 8) NOT NULL,
  start_name TEXT,
  end_name TEXT,
  safest_route JSONB,
  fastest_route JSONB,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FUNCTIONS: Auto-update timestamps
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incident_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_sos_updated_at BEFORE UPDATE ON public.sos_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_itineraries_updated_at BEFORE UPDATE ON public.itineraries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_safety_alerts_updated_at BEFORE UPDATE ON public.safety_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- FUNCTION: Auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'tourist')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCTION: Recalculate safety score after incident verification
-- ============================================================

CREATE OR REPLACE FUNCTION public.recalculate_safety_score(p_location_id UUID)
RETURNS void AS $$
DECLARE
  v_verified_count INTEGER;
  v_high_severity INTEGER;
  v_medium_severity INTEGER;
  v_current_crime INTEGER;
  v_new_crime INTEGER;
  v_new_overall INTEGER;
  v_current_record RECORD;
BEGIN
  -- Get current safety rating
  SELECT * INTO v_current_record
  FROM public.safety_ratings
  WHERE location_id = p_location_id AND is_current = true
  LIMIT 1;

  IF NOT FOUND THEN RETURN; END IF;

  -- Count recent verified incidents (last 30 days)
  SELECT COUNT(*) INTO v_verified_count
  FROM public.incident_reports
  WHERE location_id = p_location_id
    AND status = 'verified'
    AND created_at > NOW() - INTERVAL '30 days';

  SELECT COUNT(*) INTO v_high_severity
  FROM public.incident_reports
  WHERE location_id = p_location_id
    AND status = 'verified'
    AND severity IN ('high', 'critical')
    AND created_at > NOW() - INTERVAL '30 days';

  SELECT COUNT(*) INTO v_medium_severity
  FROM public.incident_reports
  WHERE location_id = p_location_id
    AND status = 'verified'
    AND severity = 'medium'
    AND created_at > NOW() - INTERVAL '30 days';

  -- Adjust crime score based on incidents
  v_current_crime := v_current_record.crime_score;
  v_new_crime := GREATEST(20, v_current_crime - (v_high_severity * 5) - (v_medium_severity * 2));

  -- Calculate new overall score (weighted average)
  v_new_overall := (
    v_new_crime * 0.30 +
    v_current_record.weather_score * 0.20 +
    v_current_record.hazard_score * 0.20 +
    v_current_record.community_score * 0.15 +
    v_current_record.political_stability_score * 0.15
  )::INTEGER;

  -- Mark old as not current
  UPDATE public.safety_ratings
  SET is_current = false
  WHERE location_id = p_location_id AND is_current = true;

  -- Insert new rating
  INSERT INTO public.safety_ratings (
    location_id, overall_score, crime_score, weather_score,
    hazard_score, community_score, political_stability_score, is_current,
    calculation_notes
  ) VALUES (
    p_location_id, v_new_overall, v_new_crime,
    v_current_record.weather_score, v_current_record.hazard_score,
    v_current_record.community_score, v_current_record.political_stability_score,
    true,
    format('Auto-recalculated after incident verification. %s verified incidents in 30 days.', v_verified_count)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TRIGGER: Recalculate score when incident is verified
-- ============================================================

CREATE OR REPLACE FUNCTION public.on_incident_verified()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'verified' AND OLD.status != 'verified' AND NEW.location_id IS NOT NULL THEN
    PERFORM public.recalculate_safety_score(NEW.location_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER incident_verified_trigger
  AFTER UPDATE ON public.incident_reports
  FOR EACH ROW EXECUTE FUNCTION public.on_incident_verified();
