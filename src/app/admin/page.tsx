'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SafeWanderMap } from '@/components/map/SafeWanderMap';
import { useAppStore } from '@/lib/store';
import { DEMO_LOCATIONS, DEMO_EMERGENCY_CONTACTS } from '@/lib/demo-data';
import { AlertOctagon, Flag, Bell, MapPin, CheckCircle, Phone, ArrowRight, ShieldAlert } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { incidents, alerts, activeSosAlerts, isSosActive, activeSos, resolveSos, updateIncidentStatus } = useAppStore();

  const pendingIncidents = incidents.filter((i) => i.status === 'pending');
  const verifiedIncidents = incidents.filter((i) => i.status === 'verified');

  const allSos = activeSos ? [activeSos, ...activeSosAlerts.filter(s => s.id !== activeSos.id)] : activeSosAlerts;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="admin" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Authority Operations Control Center
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
                Live Situational Safety Overview
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">Operations Center Live</span>
            </div>
          </div>

          {/* 4 Operations KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Active SOS */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Active SOS Distress</span>
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                  <AlertOctagon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-rose-500 font-mono">
                {allSos.length > 0 ? allSos.length : '0'}
              </div>
              <p className="text-[11px] text-slate-400">
                {allSos.length > 0 ? 'Immediate action required' : 'No active distress signals'}
              </p>
            </div>

            {/* KPI 2: Pending Incident Reports */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Pending Reports</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Flag className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-amber-400 font-mono">
                {pendingIncidents.length}
              </div>
              <Link href="/admin/incidents" className="text-[11px] text-cyan-400 hover:underline">
                Review & Verify Reports →
              </Link>
            </div>

            {/* KPI 3: Active Safety Alerts */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Alerts</span>
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Bell className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-cyan-400 font-mono">
                {alerts.length}
              </div>
              <p className="text-[11px] text-slate-400">Broadcasted across 4 cities</p>
            </div>

            {/* KPI 4: Regions Monitored */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Monitored Regions</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-blue-400 font-mono">
                {DEMO_LOCATIONS.length}
              </div>
              <p className="text-[11px] text-slate-400">Chennai, Mumbai, Delhi, Bengaluru</p>
            </div>
          </div>

          {/* Active SOS Monitoring Feed (If any SOS active) */}
          {allSos.length > 0 && (
            <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertOctagon className="w-5 h-5 animate-pulse" />
                  <span>ACTIVE EMERGENCY DISTRESS SIGNALS ({allSos.length})</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-rose-600 text-white font-bold animate-pulse">
                  PRIORITY: CRITICAL
                </span>
              </div>

              <div className="space-y-3">
                {allSos.map((sos) => (
                  <div
                    key={sos.id}
                    className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-white text-sm">
                        Distress from: {sos.tourist?.name || 'Demo Tourist'} ({sos.tourist?.phone || '+91 9876543210'})
                      </div>
                      <div className="text-slate-400">
                        GPS Coordinates: <strong className="text-white font-mono">{sos.latitude.toFixed(4)}, {sos.longitude.toFixed(4)}</strong> • Transmitted {formatRelativeTime(sos.created_at)}
                      </div>
                      <div className="text-emerald-400">
                        Emergency Contact: {sos.tourist?.emergency_contact_name} ({sos.tourist?.emergency_contact_phone})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.google.com/maps?q=${sos.latitude},${sos.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                      >
                        Open in Maps
                      </a>
                      <button
                        onClick={() => resolveSos(sos.id)}
                        className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                      >
                        ✓ Mark Resolved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Operations Map */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Live Operations Spatial Map
            </h3>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl">
              <SafeWanderMap
                center={[13.0827, 80.2707]}
                zoom={12}
                locations={DEMO_LOCATIONS}
                incidents={incidents}
                emergencyContacts={DEMO_EMERGENCY_CONTACTS}
                className="h-[480px] w-full rounded-xl"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
