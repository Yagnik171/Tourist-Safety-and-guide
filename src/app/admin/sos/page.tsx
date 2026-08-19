'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppStore } from '@/lib/store';
import { AlertOctagon, CheckCircle, MapPin, Phone, Radio, ExternalLink } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function AdminSosPage() {
  const { activeSosAlerts, activeSos, resolveSos } = useAppStore();

  const allSos = activeSos ? [activeSos, ...activeSosAlerts.filter(s => s.id !== activeSos.id)] : activeSosAlerts;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="admin" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
              Live Operations Feed
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              SOS Emergency Monitoring Center
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Real-time distress signals transmitted by tourists in danger. Coordinate emergency dispatches and track resolution.
            </p>
          </div>

          {allSos.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No Active Distress Signals</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                All historical SOS distress triggers have been resolved. The platform continues active background monitoring.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {allSos.map((sos) => (
                <div
                  key={sos.id}
                  className="bg-slate-900 border border-rose-500/50 rounded-2xl p-6 shadow-2xl space-y-4 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
                        <AlertOctagon className="w-5 h-5 animate-pulse" />
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-white">
                          Distress Signal from {sos.tourist?.name || 'Demo Tourist'}
                        </h4>
                        <span className="text-[11px] text-rose-400 font-semibold">
                          Transmitted {formatRelativeTime(sos.created_at)}
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase">
                      CRITICAL • {sos.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block">GPS Coordinates:</span>
                      <strong className="text-white font-mono text-sm">{sos.latitude.toFixed(5)}, {sos.longitude.toFixed(5)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Tourist Contact:</span>
                      <strong className="text-cyan-400">{sos.tourist?.phone || '+91 9876543210'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Emergency Contact:</span>
                      <strong className="text-emerald-400">{sos.tourist?.emergency_contact_name} ({sos.tourist?.emergency_contact_phone})</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <a
                      href={`https://www.google.com/maps?q=${sos.latitude},${sos.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Open Coordinates in Satellite Map
                    </a>
                    <button
                      onClick={() => resolveSos(sos.id)}
                      className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950/40"
                    >
                      <CheckCircle className="w-4 h-4" /> Mark Distress as Resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
