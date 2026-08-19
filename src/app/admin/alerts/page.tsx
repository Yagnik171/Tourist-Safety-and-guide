'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AlertCard } from '@/components/alerts/AlertCard';
import { useAppStore } from '@/lib/store';
import { Bell, Send, CheckCircle2, AlertTriangle, CloudRain, Flame } from 'lucide-react';
import type { AlertSeverity, AlertType, SafetyAlert } from '@/types';

export default function AdminAlertsPage() {
  const { alerts, setAlerts, currentLocation, locations } = useAppStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>('moderate');
  const [alertType, setAlertType] = useState<AlertType>('weather');
  const [selectedLocId, setSelectedLocId] = useState(currentLocation.id);
  const [isBroadcasted, setIsBroadcasted] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLoc = locations.find((l) => l.id === selectedLocId) || currentLocation;

    const newAlert: SafetyAlert = {
      id: `alert-${Date.now()}`,
      location_id: targetLoc.id,
      title,
      description,
      severity,
      alert_type: alertType,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      location: {
        id: targetLoc.id,
        name: targetLoc.name,
        city: targetLoc.city,
      },
    };

    setAlerts([newAlert, ...alerts]);
    setIsBroadcasted(true);
    setTitle('');
    setDescription('');
    setTimeout(() => setIsBroadcasted(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="admin" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Broadcast Center
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Safety Alert Broadcasting
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Broadcast immediate meteorological warnings, curfews, or crowd alerts to all active tourists in a designated region.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Bell className="w-5 h-5" /> Broadcast New Safety Bulletin
              </div>

              {isBroadcasted && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Alert successfully broadcasted to live tourist clients!
                </div>
              )}

              <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Target Region</label>
                  <select
                    value={selectedLocId}
                    onChange={(e) => setSelectedLocId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name} ({loc.city})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Alert Category</label>
                    <select
                      value={alertType}
                      onChange={(e) => setAlertType(e.target.value as AlertType)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500"
                    >
                      <option value="weather">Weather Warning</option>
                      <option value="crime">Crime Vigilance</option>
                      <option value="traffic">Traffic Obstruction</option>
                      <option value="natural_disaster">Natural Disaster</option>
                      <option value="health">Public Health / AQI</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Severity</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500"
                    >
                      <option value="info">Informational</option>
                      <option value="low">Low Risk</option>
                      <option value="moderate">Moderate Advisory</option>
                      <option value="high">High Warning</option>
                      <option value="critical">Critical Immediate</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Alert Headline</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Coastal High Tide Warning after 6 PM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Advisory Details & Instructions</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail specific instructions: areas to avoid, expected duration, precautions..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" /> Broadcast Alert to Active Tourists
                </button>
              </form>
            </div>

            {/* Active alerts list */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
                Currently Broadcasted Alerts ({alerts.length})
              </h3>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
