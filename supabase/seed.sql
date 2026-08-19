-- ============================================================
-- SafeWander Platform — Seed Data
-- Demo data for Chennai, Mumbai, Delhi, Bengaluru
-- Run AFTER schema.sql and rls.sql
-- ============================================================

-- ============================================================
-- LOCATIONS
-- ============================================================

INSERT INTO public.locations (id, name, city, state, country, latitude, longitude, description, population, area_km2) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Chennai City', 'Chennai', 'Tamil Nadu', 'India', 13.0827, 80.2707, 'The capital of Tamil Nadu, known for its long sandy beaches, temples, and rich cultural heritage.', 10971108, 426.0),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Mumbai City', 'Mumbai', 'Maharashtra', 'India', 19.0760, 72.8777, 'The financial capital of India, home to Bollywood and iconic landmarks like the Gateway of India.', 20667656, 603.4),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Delhi', 'New Delhi', 'Delhi', 'India', 28.6139, 77.2090, 'The capital of India with a rich history spanning thousands of years and iconic monuments.', 32941000, 1484.0),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Bengaluru City', 'Bengaluru', 'Karnataka', 'India', 12.9716, 77.5946, 'The Silicon Valley of India, known for its tech parks, gardens, and cosmopolitan culture.', 13193000, 741.0),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Marina Beach', 'Chennai', 'Tamil Nadu', 'India', 13.0499, 80.2824, 'One of the longest natural urban beaches in the world, stretching over 13 km.', NULL, 13.0),
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'T Nagar', 'Chennai', 'Tamil Nadu', 'India', 13.0418, 80.2341, 'A major commercial and residential locality in Chennai, famous for silk sarees and gold jewellery.', NULL, 4.0),
  ('a7b8c9d0-e1f2-3456-abcd-567890123456', 'Connaught Place', 'New Delhi', 'Delhi', 'India', 28.6328, 77.2197, 'The financial, commercial and business center of New Delhi with colonial architecture.', NULL, 3.2),
  ('b8c9d0e1-f2a3-4567-bcde-678901234567', 'Bandra', 'Mumbai', 'Maharashtra', 'India', 19.0596, 72.8295, 'A prime residential and commercial suburb of Mumbai, known as the Queen of the Suburbs.', NULL, 18.0),
  ('c9d0e1f2-a3b4-5678-cdef-789012345678', 'Koramangala', 'Bengaluru', 'Karnataka', 'India', 12.9352, 77.6245, 'A vibrant upscale neighborhood in Bengaluru known for restaurants, startups and shopping.', NULL, 9.0),
  ('d0e1f2a3-b4c5-6789-defa-890123456789', 'Mahabalipuram', 'Chengalpattu', 'Tamil Nadu', 'India', 12.6269, 80.1927, 'UNESCO World Heritage Site famous for rock-cut cave temples and ancient monuments.', NULL, 22.0);

-- ============================================================
-- SAFETY RATINGS
-- ============================================================

INSERT INTO public.safety_ratings (location_id, overall_score, crime_score, weather_score, hazard_score, community_score, political_stability_score, is_current, calculation_notes) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 72, 68, 75, 70, 78, 74, true, 'Baseline score for Chennai. Moderate crime, seasonal weather risks during monsoon.'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 69, 65, 72, 68, 74, 71, true, 'Baseline score for Mumbai. Dense population, coastal weather risks, moderate crime.'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 65, 60, 70, 65, 68, 72, true, 'Baseline score for Delhi. Higher crime rate, air quality concerns, politically stable.'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 78, 74, 80, 76, 82, 80, true, 'Baseline score for Bengaluru. Lower crime, good weather, vibrant community.'),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 74, 70, 72, 68, 80, 76, true, 'Marina Beach area. Some petty theft incidents, crowded during weekends.'),
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 68, 62, 78, 72, 70, 72, true, 'T Nagar commercial area. Higher theft risk in crowded markets.'),
  ('a7b8c9d0-e1f2-3456-abcd-567890123456', 70, 65, 74, 68, 74, 78, true, 'Connaught Place. Tourist-heavy area, moderate pickpocketing incidents.'),
  ('b8c9d0e1-f2a3-4567-bcde-678901234567', 76, 72, 74, 78, 80, 77, true, 'Bandra. Relatively safe, good infrastructure, some traffic incidents.'),
  ('c9d0e1f2-a3b4-5678-cdef-789012345678', 80, 76, 82, 78, 84, 81, true, 'Koramangala. Generally safe tech-hub area, well-lit streets.'),
  ('d0e1f2a3-b4c5-6789-defa-890123456789', 82, 80, 78, 76, 86, 84, true, 'Mahabalipuram. Mostly safe tourist area, some seasonal coastal risks.');

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================

INSERT INTO public.emergency_contacts (location_id, organization, type, phone, is_24x7, address, latitude, longitude) VALUES
  -- Chennai
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Chennai City Police', 'police', '100', true, 'Commissioner of Police Office, Vepery, Chennai', 13.0914, 80.2769),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Tamil Nadu Fire Service', 'fire', '101', true, 'Fire Station, Anna Salai, Chennai', 13.0680, 80.2590),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'GH Emergency Ambulance', 'ambulance', '108', true, 'Government General Hospital, Park Town, Chennai', 13.0795, 80.2760),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Govt General Hospital Chennai', 'hospital', '044-25305000', true, 'Park Town, Chennai - 600003', 13.0795, 80.2760),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Marina Beach Police Booth', 'police', '044-25361989', true, 'Marina Beach, Chennai', 13.0499, 80.2824),
  -- Mumbai
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Mumbai Police', 'police', '100', true, 'Mumbai Police Headquarters, Crawford Market', 18.9472, 72.8352),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Mumbai Fire Brigade', 'fire', '101', true, 'Byculla Fire Station, Mumbai', 18.9648, 72.8347),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'MIMS Ambulance', 'ambulance', '108', true, 'Mumbai', 19.0760, 72.8777),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'KEM Hospital', 'hospital', '022-24136051', true, 'Acharya Donde Marg, Parel, Mumbai', 19.0048, 72.8430),
  -- Delhi
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Delhi Police', 'police', '100', true, 'Delhi Police Headquarters, New Delhi', 28.6304, 77.2223),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Delhi Fire Service', 'fire', '101', true, 'Delhi Fire Service HQ, New Delhi', 28.6139, 77.2090),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Dial 112 Emergency', 'ambulance', '112', true, 'New Delhi', 28.6139, 77.2090),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'AIIMS New Delhi', 'hospital', '011-26588500', true, 'Ansari Nagar, New Delhi', 28.5672, 77.2100),
  -- Bengaluru
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Bengaluru City Police', 'police', '100', true, 'Cubbon Park Police Station, Bengaluru', 12.9766, 77.5993),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Karnataka Fire Services', 'fire', '101', true, 'Shivajinagar Fire Station, Bengaluru', 12.9815, 77.5974),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Ambulance Services', 'ambulance', '108', true, 'Bengaluru', 12.9716, 77.5946),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Victoria Hospital Bengaluru', 'hospital', '080-26700290', true, 'Fort Road, Bengaluru - 560002', 12.9634, 77.5800);

-- ============================================================
-- SAFETY ALERTS (demo data)
-- ============================================================

INSERT INTO public.safety_alerts (location_id, title, description, severity, alert_type, is_active) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Heavy Rainfall Warning', 'IMD has issued heavy rainfall warning for Chennai coastal areas. Avoid low-lying zones and beach areas during high tide.', 'moderate', 'weather', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Increased Vigilance at Marina Beach', 'Police advisory: Be cautious of petty theft at crowded areas near Marina Beach during evening hours.', 'low', 'crime', true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'High Tide Advisory Mumbai Coast', 'High tide expected along Mumbai coastline. Stay away from Marine Drive and Juhu Beach after 6 PM.', 'high', 'weather', true),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Air Quality Alert Delhi', 'AQI in Delhi has reached Unhealthy levels (AQI: 185). Wear masks outdoors. Sensitive groups should stay indoors.', 'moderate', 'health', true),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Traffic Disruption - Silk Board', 'Major traffic disruption near Silk Board junction due to metro construction. Expect delays of 30-60 minutes.', 'low', 'traffic', true),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Crowded Beach Warning', 'Marina Beach is extremely crowded this weekend due to a local festival. Exercise caution with belongings.', 'low', 'general', true);

-- ============================================================
-- LOCAL RECOMMENDATIONS
-- ============================================================

INSERT INTO public.local_recommendations (location_id, name, category, safety_rating, address, description, is_open_now) VALUES
  -- Chennai
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Taj Coromandel Hotel', 'hotel', 92, 'Nungambakkam High Rd, Chennai', 'Luxury 5-star hotel with excellent security and facilities.', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Saravana Bhavan', 'restaurant', 88, 'Nelson Manickam Rd, Chennai', 'Iconic vegetarian restaurant chain, safe and hygienic.', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Government Museum Chennai', 'attraction', 90, 'Pantheon Rd, Egmore', 'One of the oldest museums in India, safe for tourists.', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Apollo Hospital Chennai', 'hospital', 95, '21, Greams Lane, Chennai', 'Top-tier private hospital with emergency services.', true),
  -- Mumbai
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'The Taj Mahal Palace', 'hotel', 96, 'Apollo Bunder, Colaba, Mumbai', 'Iconic luxury hotel near Gateway of India with top security.', true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Leopold Cafe', 'restaurant', 82, 'Colaba Causeway, Mumbai', 'Famous cafe with a long history, popular among tourists.', true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Gateway of India', 'attraction', 78, 'Apollo Bunder, Mumbai', 'Iconic monument. Crowded but safe. Watch belongings.', true),
  -- Delhi
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'The Imperial New Delhi', 'hotel', 94, 'Janpath, New Delhi', 'Heritage luxury hotel in central Delhi, very secure.', true),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'India Gate', 'attraction', 75, 'Rajpath, New Delhi', 'War memorial and popular picnic spot. Safe but crowded.', true),
  -- Bengaluru
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'The Leela Palace Bengaluru', 'hotel', 95, 'HAL Airport Rd, Bengaluru', 'Opulent 5-star hotel with world-class security.', true),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Lalbagh Botanical Garden', 'attraction', 88, 'Mavalli, Bengaluru', 'Beautiful botanical garden, safe for families.', true),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Church Street', 'restaurant', 85, 'Church Street, MG Road area', 'Popular dining street with many safe restaurant options.', true);

-- ============================================================
-- DEMO INCIDENT REPORTS (requires auth users — use UUIDs from auth)
-- These will be inserted via the app's seed script, not directly here
-- as they require valid auth.users foreign keys
-- ============================================================

-- Note: Run seed_demo_users.sql after creating demo accounts in Supabase Auth
-- Demo accounts:
--   tourist@safewander.demo / Demo@123456 (role: tourist)
--   admin@safewander.demo / Admin@123456 (role: admin)
