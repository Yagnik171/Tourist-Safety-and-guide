'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppStore } from '@/lib/store';
import { INCIDENT_CATEGORY_LABELS } from '@/constants';
import type { IncidentCategory, IncidentSeverity, IncidentReport } from '@/types';
import { Flag, Send, CheckCircle2, MapPin } from 'lucide-react';

export default function ReportPage() {
  const router = useRouter();
  const { currentLocation, user, addIncident } = useAppStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('theft');
  const [severity, setSeverity] = useState<IncidentSeverity>('medium');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(currentLocation.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newInc: IncidentReport = {
        id: `inc-${Date.now()}`,
        reporter_id: user?.id || 'demo-tourist',
        location_id: currentLocation.id,
        category,
        title,
        description,
        severity,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        address,
        status: 'pending',
        incident_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reporter: {
          id: user?.id || 'demo-tourist',
          name: user?.name || 'Verified Tourist',
          verification_status: 'verified',
        },
      };

      addIncident(newInc);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Community Protection
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Submit a Safety Incident Report
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Help keep the tourist community informed. All submitted reports enter our verification queue before updating global safety scores.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Report Successfully Received</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your report has been tagged as <span className="text-amber-400 font-bold">Pending Verification</span>. Once verified by local authorities, it will reflect on the live safety map.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => router.push('/incidents')}
                    className="py-2.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    View All Incidents
                  </button>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setTitle('');
                      setDescription('');
                    }}
                    className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Submit Another Report
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Incident Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500"
                    >
                      {Object.entries(INCIDENT_CATEGORY_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Severity Assessment</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500"
                    >
                      <option value="low">Low (Minor disturbance)</option>
                      <option value="medium">Medium (Moderate concern)</option>
                      <option value="high">High (Theft / aggressive act)</option>
                      <option value="critical">Critical (Physical danger)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-slate-300">Location / Landmark</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Marina Beach, North Promenade near lighthouse"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-slate-300">Headline Summary</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Bag snatching reported near parking lot after sunset"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-slate-300">Detailed Description & Tips</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail the circumstances, exact time, perpetrators if identifiable, and advice for other tourists..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Report to Authority Verification Queue
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
