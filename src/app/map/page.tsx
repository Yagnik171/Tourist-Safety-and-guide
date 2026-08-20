'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SafeWanderMap } from '@/components/map/SafeWanderMap';
import { SafetyScoreRadial } from '@/components/safety/SafetyScoreRadial';
import { useAppStore } from '@/lib/store';
import { DEMO_LOCATIONS, DEMO_EMERGENCY_CONTACTS } from '@/lib/demo-data';
import type { Location, IncidentReport } from '@/types';
import { Shield, Layers, Phone, MapPin, Crosshair, Navigation, Sparkles } from 'lucide-react';

export default function MapPage() {
  const { currentLocation, currentRating, incidents, setCurrentLocation } = useAppStore();
  const [selectedLoc, setSelectedLoc] = useState<Location>(currentLocation);
  const [selectedInc, setSelectedInc] = useState<IncidentReport | null>(null);
  const [showZones, setShowZones] = useState(true);
  const [userLiveGps, setUserLiveGps] = useState<{ lat: number; lng: number } | null>(null);

  const handleSelectLocation = (loc: Location) => {
    setSelectedLoc(loc);
    setCurrentLocation(loc);
    setSelectedInc(null);
  };

  const handleSelectIncident = (inc: IncidentReport) => {
    setSelectedInc(inc);
  };

  const handleLiveLocationFound = (coords: { lat: number; lng: number }) => {
    setUserLiveGps(coords);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)] overflow-hidden">
          {/* Left Panel: Selected Location / Incident Safety Details */}
          <div className="w-full lg:w-96 shrink-0 bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-5">
              {/* Header */}
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Live Safety Spatial Intelligence
                </span>
                <h2 className="text-2xl font-black text-white mt-0.5">{selectedLoc.name}</h2>
                <p className="text-xs text-slate-400">{selectedLoc.city}, {selectedLoc.state || 'India'}</p>
              </div>

              {/* Live GPS Status Card */}
              {userLiveGps ? (
                <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      Live GPS Active
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">GPS Locked</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    {userLiveGps.lat.toFixed(5)}° N, {userLiveGps.lng.toFixed(5)}° E
                  </div>
                  <Link
                    href="/routes"
                    className="w-full py-1.5 px-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3 h-3" /> Calculate Safe Route from Here
                  </Link>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-2 text-slate-400">
                  <Crosshair className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Click <strong>&quot;Locate My Live GPS&quot;</strong> on the map to drop your real-time position pin.</span>
                </div>
              )}

              {/* Safety Score Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-300">Composite Score</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">🟢 Verified Safe Zone</div>
                  <div className="text-[10px] text-slate-500 mt-1">Calculated across 5 pillars</div>
                </div>
                <SafetyScoreRadial score={currentRating?.overall_score || 75} size="sm" showLabel={false} />
              </div>

              {/* Map Layer Controls */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" /> Layer Toggles
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  <button
                    onClick={() => setShowZones(!showZones)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      Safety Heat Zones
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

            {/* Quick emergency access */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-400" /> Local Police Dispatch
              </div>
              <p className="text-[11px] text-slate-400">National Emergency Control: Dial 112 / 100</p>
            </div>
          </div>

          {/* Right: Full-Height Interactive Map */}
          <div className="flex-1 h-full min-h-[400px]">
            <SafeWanderMap
              center={[selectedLoc.latitude, selectedLoc.longitude]}
              zoom={13}
              locations={DEMO_LOCATIONS}
              incidents={incidents}
              emergencyContacts={DEMO_EMERGENCY_CONTACTS}
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
