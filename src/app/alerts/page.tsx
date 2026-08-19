'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AlertCard } from '@/components/alerts/AlertCard';
import { useAppStore } from '@/lib/store';
import { Bell, ShieldAlert, AlertTriangle, CloudRain, Flame } from 'lucide-react';

export default function AlertsPage() {
  const { alerts, currentLocation } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Live Regional Advisories
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Active Safety Alerts & Warnings
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Official meteorology advisories, coastal high-tide warnings, and urban safety bulletins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
