'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { RouteCalculator } from '@/components/routes/RouteCalculator';
import { SafeWanderMap } from '@/components/map/SafeWanderMap';
import { useAppStore } from '@/lib/store';
import { DEMO_LOCATIONS, DEMO_EMERGENCY_CONTACTS } from '@/lib/demo-data';
import type { Route, RouteComparison } from '@/types';

export default function RoutesPage() {
  const { currentLocation, incidents } = useAppStore();
  const [activeRoute, setActiveRoute] = useState<Route | null>(null);

  const handleRouteCalculated = (comparison: RouteComparison, selected: Route) => {
    setActiveRoute(selected);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Risk-Aware Navigation
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Find the Safest Route
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Unlike traditional GPS that only optimizes for time, SafeWander computes routes avoiding unlit paths, high-theft density alleys, and hazard alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Route form & comparisons */}
            <div className="lg:col-span-5">
              <RouteCalculator onRouteCalculated={handleRouteCalculated} />
            </div>

            {/* Right: Map with active polyline overlay */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl">
                <SafeWanderMap
                  center={[currentLocation.latitude, currentLocation.longitude]}
                  zoom={13}
                  locations={DEMO_LOCATIONS}
                  incidents={incidents}
                  emergencyContacts={DEMO_EMERGENCY_CONTACTS}
                  activeRoute={activeRoute}
                  className="h-[520px] w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
