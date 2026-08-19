# 🛡️ SafeWander — Tourist Safety & Communication Platform

> **Travel Freely. Travel Safely.**  
> A production-grade real-time tourist safety intelligence, community hazard reporting, safe pathfinding, and emergency assistance platform.

---

## 📌 1. Project Overview & Problem Statement

Tourists exploring unfamiliar destinations frequently face **information asymmetry**:
- Unawareness of localized crime hotspots, scam corridors, and nighttime risks.
- Navigation engines that optimize strictly for travel time, routing pedestrians through dark, high-risk alleys.
- Language barriers and confusion during emergencies (unknown local police numbers, embassy contacts, and nearest trauma centers).

**SafeWander** solves this by bridging spatial intelligence, community reporting, algorithmic risk scoring, and emergency distress response in a single cohesive platform.

---

## 🚀 2. Two-Phase Development Strategy

* **Phase 1 (Current)**: Full-featured, responsive Next.js 16 Web Intelligence Platform with normalized PostgreSQL / Supabase architecture and REST API layer.
* **Phase 2 (Upcoming)**: Native Mobile Applications (Flutter / React Native) that consume the exact same backend REST APIs, PostgreSQL schema, and business logic without rewrite.

---

## 🏛️ 3. System Architecture

```text
┌────────────────────────────────────────────────────────┐
│               WEB CLIENT (Next.js 16 App)              │
│  • Public Pages  • Tourist Dashboard  • Admin Ops Ctrl │
└───────────────────────────┬────────────────────────────┘
                            │ (REST / Realtime)
                            ▼
┌────────────────────────────────────────────────────────┐
│               UNIFIED API & SERVICE LAYER              │
│  • /api/locations        • /api/safety-scores          │
│  • /api/incidents        • /api/sos                    │
│  • /api/routes           • /api/alerts                 │
│  • /api/chat             • /api/emergency-contacts     │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     SUPABASE / POSTGRES   │ │     EXTERNAL ENGINES      │
│  • 13 Normalized Tables   │ │  • OpenStreetMap / Leaflet│
│  • RLS Security Policies  │ │  • Safety Score Alg.      │
│  • Recalculation Triggers │ │  • Haversine Safe Routing │
└───────────────────────────┘ └───────────────────────────┘
              ▲
              │ (Phase 2 Integration)
┌─────────────┴──────────────────────────────────────────┐
│      FUTURE MOBILE CLIENT (Flutter / React Native)     │
│  • Background GPS tracking  • Native SOS  • Push Alerts│
└────────────────────────────────────────────────────────┘
```

---

## 🛠️ 4. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui, CSS Variables |
| **Animations** | Framer Motion (purposeful 200–500ms transitions) |
| **Spatial Mapping** | React Leaflet, OpenStreetMap / CartoDB (Key-Free) |
| **Data Visualizations** | Recharts (Trend & Category Analytics) |
| **State Management** | Zustand (with LocalStorage persistence) |
| **Backend & DB** | Next.js Route Handlers, Supabase (PostgreSQL 15), RLS |
| **Icons** | Lucide React |

---

## 🗄️ 5. Database Schema & Entities

The database structure is codified in `supabase/schema.sql`, `supabase/rls.sql`, and `supabase/seed.sql`:

1. `profiles`: Tourist & authority identity profiles, emergency contacts, safety mode state.
2. `locations`: Monitored urban centers (Chennai, Mumbai, Delhi, Bengaluru).
3. `safety_ratings`: 5-pillar composite breakdown (Crime, Weather, Hazards, Community, Political).
4. `incident_reports`: Verified, Pending, and Rejected community submissions.
5. `sos_alerts`: Distress signals with GPS coordinate locks and resolution audit trail.
6. `emergency_contacts`: Location-aware directory of 24/7 Police, Hospitals, and Helplines.
7. `chat_messages`: Real-time regional tourist discussion channels.
8. `itineraries`: Day-by-day travel plans with safety score timeline.
9. `safety_alerts`: Broadcasted meteorological, crime, and crowd warnings.
10. `local_recommendations`: Curated safe hotels, dining, and attractions.

---

## ⚡ 6. Core Features Implemented

### 🧭 1. Tourist Platform
* **Safety Cockpit Dashboard (`/dashboard`)**: Animated radial score (0-100), 5-pillar breakdown, and active alerts.
* **Interactive Safety Map (`/map`)**: Heat zones, incident tags, emergency pins, and coordinate inspection.
* **Safest Route Navigation (`/routes`)**: Comparative Safest vs. Fastest route scoring with lighting/incident factors.
* **Incident Reporting (`/report` & `/incidents`)**: Submission form entering an authority verification queue.
* **Tourist Community Chat (`/community`)**: Regional discussion feed with online tourist counts.
* **Emergency Hotlines (`/emergency`)**: Direct 1-tap dialers for 112, 100, 108, 101, and local stations.
* **Solo / Women Safety Mode (`/safety-mode`)**: 30-minute check-in timer with automated missed check-in alerts.
* **Phrase Translator (`/translate`)**: Emergency multi-language translator with 1-click presets.

### 🛡️ 2. Authority Operations Platform
* **Operations Center (`/admin`)**: 4 KPI counters, live SOS distress feed, and tactical map.
* **Incident Verification (`/admin/incidents`)**: 1-click Verify/Reject workflow that **automatically recalculates regional safety scores**.
* **Distress Monitoring (`/admin/sos`)**: Coordinate dispatch resolution tools.
* **Alert Broadcasting (`/admin/alerts`)**: Push instant advisories across target cities.
* **Safety Analytics (`/admin/analytics`)**: Incident bar charts and multi-city score trajectory charts.

---

## 🧪 7. Verification & Demo Flow Walkthrough

Follow this 5-minute evaluation journey:
1. **Open Landing Page (`/`)**: Inspect the animated hero headline, live Leaflet map preview, and 5-step process.
2. **Access Dashboard (`/dashboard`)**: View Chennai&apos;s real-time safety score of `72/100` and active weather alerts.
3. **Explore Navigation (`/routes`)**: Click *Calculate Safest vs Fastest Route* to inspect why the safest route avoids high incident density areas.
4. **Trigger Demo SOS**: Click the glowing **SOS Button** in the top navigation bar. Watch the 3-second countdown and observe the prototype disclaimer banner.
5. **Switch to Admin Role**: In the top profile menu, click **Switch to Admin Ops View** (`/admin`). Observe the active SOS distress signal in the queue.
6. **Verify Incident**: Navigate to `/admin/incidents`. Click **Verify & Apply Score Impact** on a pending report. Watch the score update automatically!

---

## ⚙️ 8. Quick Start & Setup

### Prerequisites
* Node.js 18+ (Node 20+ recommended)
* npm / pnpm / yarn

### Installation
```bash
# Clone and enter directory
cd safewander-platform

# Install dependencies
npm install

# Configure environment variables (Runs out of the box in Demo Mode)
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 9. Security & Disclaimer Notice

* **Prototype Disclaimer**: Real emergency integrations are not wired to live police dispatchers without explicit government MoU. All SOS actions are tagged with `DEMO SOS — NO REAL EMERGENCY SERVICE CONTACTED`.
* **Zero Secret Exposure**: Database credentials, service role keys, and API tokens are restricted to server-side environments.
