'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppStore } from '@/lib/store';
import { MapPin, Plus, Shield } from 'lucide-react';
import { DEMO_LOCATIONS, DEMO_SAFETY_RATINGS } from '@/lib/demo-data';

export default function AdminLocationsPage() {
  const { locations } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="admin" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Geographic Management
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
                Monitored Cities & Geographic Boundaries
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Configure monitored zones, spatial coordinates, and safety scoring weights.
              </p>
            </div>

            <button
              onClick={() => alert('Add Region Dialog (Demo)')}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-950/50"
            >
              <Plus className="w-4 h-4" /> Add New Region
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEMO_LOCATIONS.map((loc) => {
              const rating = DEMO_SAFETY_RATINGS[loc.id];
              return (
                <div
                  key={loc.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs font-mono">
                      {rating?.overall_score || 75}/100
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{loc.name}</h3>
                    <p className="text-xs text-slate-400">{loc.city}, {loc.country}</p>
                  </div>

                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 space-y-1 font-mono">
                    <div>Lat: {loc.latitude.toFixed(4)}</div>
                    <div>Lng: {loc.longitude.toFixed(4)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
