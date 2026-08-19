-- ============================================================
-- SafeWander Platform — Row Level Security Policies
-- Run AFTER schema.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.local_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_routes ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTION: Check if current user is admin/authority
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin_or_authority()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'authority')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role::TEXT FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PROFILES
-- ============================================================

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (public.is_admin_or_authority());

-- ============================================================
-- LOCATIONS
-- ============================================================

CREATE POLICY "Locations are public" ON public.locations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage locations" ON public.locations
  FOR ALL USING (public.is_admin_or_authority());

-- ============================================================
-- SAFETY RATINGS
-- ============================================================

CREATE POLICY "Safety ratings are public" ON public.safety_ratings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage safety ratings" ON public.safety_ratings
  FOR ALL USING (public.is_admin_or_authority());

-- ============================================================
-- INCIDENT REPORTS
-- ============================================================

CREATE POLICY "Verified incidents are public" ON public.incident_reports
  FOR SELECT USING (status = 'verified' OR reporter_id = auth.uid() OR public.is_admin_or_authority());

CREATE POLICY "Authenticated users can create incidents" ON public.incident_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND reporter_id = auth.uid());

CREATE POLICY "Users can update own pending incidents" ON public.incident_reports
  FOR UPDATE USING (reporter_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can update any incident" ON public.incident_reports
  FOR UPDATE USING (public.is_admin_or_authority());

-- ============================================================
-- SOS ALERTS
-- ============================================================

CREATE POLICY "Users can view own SOS" ON public.sos_alerts
  FOR SELECT USING (tourist_id = auth.uid() OR public.is_admin_or_authority());

CREATE POLICY "Authenticated users can create SOS" ON public.sos_alerts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND tourist_id = auth.uid());

CREATE POLICY "Users can update own active SOS" ON public.sos_alerts
  FOR UPDATE USING (tourist_id = auth.uid() OR public.is_admin_or_authority());

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================

CREATE POLICY "Emergency contacts are public" ON public.emergency_contacts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage emergency contacts" ON public.emergency_contacts
  FOR ALL USING (public.is_admin_or_authority());

-- ============================================================
-- CHAT MESSAGES
-- ============================================================

CREATE POLICY "Authenticated users can read chat" ON public.chat_messages
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND sender_id = auth.uid());

-- ============================================================
-- ITINERARIES
-- ============================================================

CREATE POLICY "Users can view own itineraries" ON public.itineraries
  FOR SELECT USING (tourist_id = auth.uid() OR is_public = true OR auth.uid() = ANY(shared_with));

CREATE POLICY "Users can create own itineraries" ON public.itineraries
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND tourist_id = auth.uid());

CREATE POLICY "Users can update own itineraries" ON public.itineraries
  FOR UPDATE USING (tourist_id = auth.uid());

CREATE POLICY "Users can delete own itineraries" ON public.itineraries
  FOR DELETE USING (tourist_id = auth.uid());

-- ============================================================
-- SAFETY ALERTS
-- ============================================================

CREATE POLICY "Active alerts are public" ON public.safety_alerts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all alerts" ON public.safety_alerts
  FOR SELECT USING (public.is_admin_or_authority());

CREATE POLICY "Admins can manage alerts" ON public.safety_alerts
  FOR ALL USING (public.is_admin_or_authority());

-- ============================================================
-- LOCAL RECOMMENDATIONS
-- ============================================================

CREATE POLICY "Recommendations are public" ON public.local_recommendations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage recommendations" ON public.local_recommendations
  FOR ALL USING (public.is_admin_or_authority());

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- TRANSLATION HISTORY
-- ============================================================

CREATE POLICY "Users can view own translations" ON public.translation_history
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create translations" ON public.translation_history
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- ============================================================
-- SAFE ROUTES
-- ============================================================

CREATE POLICY "Safe routes are accessible to authenticated users" ON public.safe_routes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create routes" ON public.safe_routes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
