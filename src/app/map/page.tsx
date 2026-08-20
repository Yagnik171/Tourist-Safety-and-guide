'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SafeWanderMap } from '@/components/map/SafeWanderMap';
import { SafetyScoreRadial } from '@/components/safety/SafetyScoreRadial';
import { useAppStore } from '@/lib/store';
import { DEMO_LOCATIONS, getEmergencyContactsForLocation, getAlertsForLocation, DEMO_SAFETY_RATINGS } from '@/lib/demo-data';
import type { Location, IncidentReport } from '@/types';
import { Shield, Layers, Phone, MapPin, Crosshair, Navigation, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MapPage() {
  const { currentLocation, currentRating, incidents, setCurrentLocation } = useAppStore();
  const [selectedLoc, setSelectedLoc] = useState<Location>(currentLocation);
  const [selectedInc, setSelectedInc] = useState<IncidentReport | null>(null);
  const [showZones, setShowZones] = useState(true);
  const [userLiveGps, setUserLiveGps] = useState<{
    lat: number;
    lng: number;
    city?: string;
    state?: string;
    name?: string;
    address?: string;
  } | null>(null);

  const handleSelectLocation = (loc: Location) => {
    setSelectedLoc(loc);
    setCurrentLocation(loc);
    setSelectedInc(null);
  };

  const handleSelectIncident = (inc: IncidentReport) => {
    setSelectedInc(inc);
  };

  // Called when user clicks "🎯 Locate My Live GPS" on the map
  const handleLiveLocationFound = (coords: {
    lat: number;
    lng: number;
    city?: string;
    state?: string;
    name?: string;
    address?: string;
  }) => {
    setUserLiveGps(coords);

    // Build dynamic Live Location object
    const liveLoc: Location = {
      id: `loc-live-${coords.lat.toFixed(3)}-${coords.lng.toFixed(3)}`,
      name: coords.name || (coords.city ? `${coords.city} (Live GPS)` : 'My Live Location'),
      city: coords.city || 'Current Location',
      state: coords.state || 'India',
      country: 'India',
      latitude: coords.lat,
      longitude: coords.lng,
      description: coords.address || `Live GPS locked at ${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E`,
      timezone: 'Asia/Kolkata',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Update both local view and global app state
    setSelectedLoc(liveLoc);
    setCurrentLocation(liveLoc);
  };

  // Dynamic location-aware rating
  const locationRating = DEMO_SAFETY_RATINGS[selectedLoc.id] || currentRating || {
    overall_score: 80,
    crime_score: 75,
    weather_score: 80,
    hazard_score: 80,
    community_score: 85,
    political_stability_score: 80,
  };

  const localContacts = getEmergencyContactsForLocation(selectedLoc);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)] overflow-hidden">
          {/* Left Panel: Selected Location / Incident Safety Details */}
          <div className="w-full lg:w-96 shrink-0 bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-y-auto space-y-5 flex flex-col justify-between shadow-2xl">
            <div className="space-y-5">
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> Live Spatial Safety Intel
                  </span>
                  {userLiveGps && (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Tracked
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">{selectedLoc.name}</h2>
                <p className="text-xs text-slate-400 font-medium">
                  {selectedLoc.city}, {selectedLoc.state || 'India'}
                </p>
              </div>

              {/* Live GPS Active Status Card */}
              {userLiveGps ? (
                <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      Live GPS Centered
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">✓ Active</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    {userLiveGps.lat.toFixed(5)}° N, {userLiveGps.lng.toFixed(5)}° E
                  </div>
                  {userLiveGps.address && (
                    <div className="text-[10px] text-slate-400 truncate">
                      {userLiveGps.address}
                    </div>
                  )}
                  <Link
                    href="/routes"
                    className="w-full py-1.5 px-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-[11px] font-black flex items-center justify-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3 h-3" /> Calculate Safe Route from Here
                  </Link>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-2 text-slate-400">
                  <Crosshair className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Click <strong>&quot;Locate My Live GPS&quot;</strong> on the map to switch context to your exact spot.</span>
                </div>
              )}

              {/* Safety Score Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-300">Composite Safety Score</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    {locationRating.overall_score >= 75 ? '🟢 Verified Safe Zone' : '🟡 Moderate Caution Area'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Calculated across 5 pillars</div>
                </div>
                <SafetyScoreRadial score={locationRating.overall_score} size="sm" showLabel={false} />
              </div>

              {/* Map Layer Controls */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" /> Map Layers & Overlays
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <button
                    onClick={() => setShowZones(!showZones)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      Safety Heat Zones & Pins
                    </span>
                    <span className="text-[10px] font-bold text-cyan-400">{showZones ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>

              {/* Selected Incident Drawer */}
              {selectedInc && (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-400 uppercase">Selected Incident</span>
                    <button onClick={() => setSelectedInc(null)} className="text-slate-400">✕</button>
                  </div>
                  <div className="font-bold text-white text-sm">{selectedInc.title}</div>
                  <p className="text-slate-300 text-xs leading-relaxed">{selectedInc.description}</p>
                  <div className="text-[10px] text-slate-400">{selectedInc.address}</div>
                </div>
              )}
            </div>

            {/* Local Emergency Responder Contact */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <Phone className="w-3.5 h-3.5" /> {localContacts[0]?.name || `${selectedLoc.city} Police Control`}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">24x7</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{localContacts[0]?.address || 'Emergency Response Division'}</p>
              <a
                href={`tel:${localContacts[0]?.phone || '112'}`}
                className="block text-center py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold hover:bg-rose-900/60 transition-colors"
              >
                📞 Dial {localContacts[0]?.phone || '112'}
              </a>
            </div>
          </div>

          {/* Right: Full-Height Interactive Map */}
          <div className="flex-1 h-full min-h-[400px]">
            <SafeWanderMap
              center={[selectedLoc.latitude, selectedLoc.longitude]}
              zoom={13}
              locations={DEMO_LOCATIONS}
              incidents={incidents}
              emergencyContacts={localContacts}
              onSelectLocation={handleSelectLocation}
              onSelectIncident={handleSelectIncident}
              onLiveLocationFound={handleLiveLocationFound}
              showSafetyZones={showZones}
              className="h-full w-full"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
