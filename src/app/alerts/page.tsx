'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AlertCard } from '@/components/alerts/AlertCard';
import { useAppStore } from '@/lib/store';
import { DEMO_ALERTS, getAlertsForLocation } from '@/lib/demo-data';
import { Bell, ShieldAlert, Sparkles, Filter } from 'lucide-react';

export default function AlertsPage() {
  const { currentLocation } = useAppStore();
  const [filterType, setFilterType] = useState<'all' | 'current' | 'weather'>('all');

  const currentCityAlerts = getAlertsForLocation(currentLocation);

  const displayedAlerts =
    filterType === 'current'
      ? currentCityAlerts
      : filterType === 'weather'
      ? DEMO_ALERTS.filter((a) => a.alert_type === 'weather' || a.title.includes('Heatwave'))
      : DEMO_ALERTS;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Live Regional Advisories
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
                Active Safety & Weather Alerts
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Official meteorology heatwaves, coastal high-tide warnings, and urban safety bulletins across India.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  filterType === 'all'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-950/50'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                All India ({DEMO_ALERTS.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('current')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  filterType === 'current'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                📍 {currentLocation.city} Only ({currentCityAlerts.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('weather')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  filterType === 'weather'
                    ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-950/50'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                ☀️ Heatwaves & Storms
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
