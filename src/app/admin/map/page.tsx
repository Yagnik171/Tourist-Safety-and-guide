'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SafeWanderMap } from '@/components/map/SafeWanderMap';
import { useAppStore } from '@/lib/store';
import { DEMO_LOCATIONS, DEMO_EMERGENCY_CONTACTS } from '@/lib/demo-data';

export default function AdminMapPage() {
  const { currentLocation, incidents } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="admin" />

        <main className="flex-1 p-4 md:p-6 flex flex-col h-[calc(100vh-4rem)] space-y-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Live Tactical Operations
            </span>
            <h1 className="text-2xl font-black text-white">Full-Screen Operations Map</h1>
          </div>

          <div className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-2xl p-2">
            <SafeWanderMap
              center={[currentLocation.latitude, currentLocation.longitude]}
              zoom={12}
              locations={DEMO_LOCATIONS}
              incidents={incidents}
              emergencyContacts={DEMO_EMERGENCY_CONTACTS}
              className="h-full w-full rounded-xl"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
