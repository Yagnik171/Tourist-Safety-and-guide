import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Location, Profile, SafetyRating, SafetyAlert, IncidentReport, SOSAlert, UserRole } from '@/types';
import { DEMO_LOCATIONS, DEMO_SAFETY_RATINGS, DEMO_ALERTS, DEMO_INCIDENTS, DEMO_TOURIST_PROFILE, DEMO_ADMIN_PROFILE } from '@/lib/demo-data';

interface AppState {
  // Auth state
  user: Profile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  
  // Location & Safety state
  currentLocation: Location;
  currentRating: SafetyRating | null;
  locations: Location[];
  alerts: SafetyAlert[];
  incidents: IncidentReport[];
  activeSosAlerts: SOSAlert[];
  
  // SOS State
  isSosActive: boolean;
  activeSos: SOSAlert | null;
  
  // Safety Mode State (Solo / Women Safety Mode)
  isSafetyModeActive: boolean;
  checkInInterval: number; // minutes
  lastCheckInTime: string | null;
  trustedContact: { name: string; phone: string } | null;

  // Actions
  setUser: (user: Profile | null) => void;
  setRole: (role: UserRole) => void;
  toggleDemoMode: (enabled?: boolean) => void;
  setCurrentLocation: (location: Location) => void;
  setAlerts: (alerts: SafetyAlert[]) => void;
  addIncident: (incident: IncidentReport) => void;
  updateIncidentStatus: (id: string, status: 'verified' | 'rejected') => void;
  triggerSos: (lat: number, lng: number, desc?: string) => Promise<SOSAlert>;
  cancelSos: (id: string) => void;
  resolveSos: (id: string) => void;
  toggleSafetyMode: (enabled?: boolean) => void;
  checkIn: () => void;
  logout: () => void;
  loginAsDemoTourist: () => void;
  loginAsDemoAdmin: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: DEMO_TOURIST_PROFILE,
      role: 'tourist',
      isAuthenticated: true,
      isDemoMode: true,
      currentLocation: DEMO_LOCATIONS[0], // Chennai
      currentRating: DEMO_SAFETY_RATINGS['a1b2c3d4-e5f6-7890-abcd-ef1234567890'],
      locations: DEMO_LOCATIONS,
      alerts: DEMO_ALERTS,
      incidents: DEMO_INCIDENTS,
      activeSosAlerts: [],
      isSosActive: false,
      activeSos: null,
      isSafetyModeActive: false,
      checkInInterval: 30,
      lastCheckInTime: null,
      trustedContact: {
        name: 'Emergency Guardian',
        phone: '7424962369',
      },

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          role: user?.role || 'tourist',
        }),

      setRole: (role) => set({ role }),

      toggleDemoMode: (enabled) =>
        set((state) => ({
          isDemoMode: enabled !== undefined ? enabled : !state.isDemoMode,
        })),

      setCurrentLocation: (location) => {
        const rating = DEMO_SAFETY_RATINGS[location.id] || {
          id: `sr-${location.id}`,
          location_id: location.id,
          overall_score: 75,
          crime_score: 75,
          weather_score: 80,
          hazard_score: 75,
          community_score: 75,
          political_stability_score: 75,
          calculated_at: new Date().toISOString(),
          is_current: true,
        };
        set({ currentLocation: location, currentRating: rating });
      },

      setAlerts: (alerts) => set({ alerts }),

      addIncident: (incident) =>
        set((state) => ({
          incidents: [incident, ...state.incidents],
        })),

      updateIncidentStatus: (id, status) =>
        set((state) => {
          const updatedIncidents = state.incidents.map((inc) =>
            inc.id === id ? { ...inc, status, verified_at: new Date().toISOString() } : inc
          );

          // Recalculate local safety score if verified
          let updatedRating = state.currentRating;
          if (status === 'verified' && state.currentRating) {
            const newCrime = Math.max(20, state.currentRating.crime_score - 4);
            const newOverall = Math.round(
              newCrime * 0.3 +
                state.currentRating.weather_score * 0.2 +
                state.currentRating.hazard_score * 0.2 +
                state.currentRating.community_score * 0.15 +
                state.currentRating.political_stability_score * 0.15
            );
            updatedRating = {
              ...state.currentRating,
              crime_score: newCrime,
              overall_score: newOverall,
              calculated_at: new Date().toISOString(),
            };
          }

          return {
            incidents: updatedIncidents,
            currentRating: updatedRating,
          };
        }),

      triggerSos: async (lat, lng, desc) => {
        const newSos: SOSAlert = {
          id: `sos-${Date.now()}`,
          tourist_id: get().user?.id || 'demo-tourist-id',
          latitude: lat,
          longitude: lng,
          location_description: desc || `Near ${get().currentLocation.name}`,
          status: 'demo',
          is_demo: true,
          authority_notified: false,
          emergency_contact_notified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tourist: {
            id: get().user?.id || 'demo-tourist-id',
            name: get().user?.name || 'Demo Tourist',
            phone: get().user?.phone || '+91 9876543210',
            emergency_contact_name: get().trustedContact?.name,
            emergency_contact_phone: get().trustedContact?.phone,
          },
        };

        set((state) => ({
          isSosActive: true,
          activeSos: newSos,
          activeSosAlerts: [newSos, ...state.activeSosAlerts],
        }));

        return newSos;
      },

      cancelSos: (id) =>
        set((state) => ({
          isSosActive: false,
          activeSos: null,
          activeSosAlerts: state.activeSosAlerts.filter((s) => s.id !== id),
        })),

      resolveSos: (id) =>
        set((state) => ({
          activeSosAlerts: state.activeSosAlerts.map((s) =>
            s.id === id ? { ...s, status: 'resolved' as const, resolved_at: new Date().toISOString() } : s
          ),
          isSosActive: state.activeSos?.id === id ? false : state.isSosActive,
          activeSos: state.activeSos?.id === id ? null : state.activeSos,
        })),

      toggleSafetyMode: (enabled) =>
        set((state) => ({
          isSafetyModeActive: enabled !== undefined ? enabled : !state.isSafetyModeActive,
          lastCheckInTime: new Date().toISOString(),
        })),

      checkIn: () =>
        set({
          lastCheckInTime: new Date().toISOString(),
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          role: 'tourist',
          isSosActive: false,
          activeSos: null,
        }),

      loginAsDemoTourist: () =>
        set({
          user: DEMO_TOURIST_PROFILE,
          role: 'tourist',
          isAuthenticated: true,
        }),

      loginAsDemoAdmin: () =>
        set({
          user: DEMO_ADMIN_PROFILE,
          role: 'admin',
          isAuthenticated: true,
        }),
    }),
    {
      name: 'safewander-storage',
      version: 2, // bump version so old localStorage data is discarded
      migrate: () => ({
        // Reset trustedContact to the correct phone number
        trustedContact: {
          name: 'Emergency Guardian',
          phone: '7424962369',
        },
      }),
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        isDemoMode: state.isDemoMode,
        isSafetyModeActive: state.isSafetyModeActive,
        trustedContact: {
          name: state.trustedContact?.name || 'Emergency Guardian',
          phone: '7424962369', // always force-override to correct number
        },
      }),
    }
  )
);
