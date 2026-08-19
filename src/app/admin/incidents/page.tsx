'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { IncidentCard } from '@/components/incidents/IncidentCard';
import { useAppStore } from '@/lib/store';
import { Flag, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

export default function AdminIncidentsPage() {
  const { incidents, updateIncidentStatus, currentLocation, currentRating } = useAppStore();

  const pending = incidents.filter((i) => i.status === 'pending');
  const verified = incidents.filter((i) => i.status === 'verified');
  const rejected = incidents.filter((i) => i.status === 'rejected');

  const handleVerify = (id: string) => {
    updateIncidentStatus(id, 'verified');
  };

  const handleReject = (id: string) => {
    updateIncidentStatus(id, 'rejected');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="admin" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Verification Pipeline
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Community Incident Management & Verification
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Review tourist safety reports. When verified, the system automatically adjusts the regional safety score and propagates alerts to tourists on the live map.
            </p>
          </div>

          {/* Pending Verification Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Pending Verification ({pending.length})
              </h3>
              <span className="text-xs text-slate-400">
                Action will recalculate {currentLocation.city} safety score
              </span>
            </div>

            {pending.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-white">All Reports Verified</div>
                <p className="text-xs text-slate-400">There are no pending incident reports awaiting authority review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pending.map((inc) => (
                  <IncidentCard
                    key={inc.id}
                    incident={inc}
                    isAdmin={true}
                    onVerify={handleVerify}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Verified Incidents Section */}
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Verified Active Incidents ({verified.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verified.map((inc) => (
                <IncidentCard key={inc.id} incident={inc} isAdmin={false} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
