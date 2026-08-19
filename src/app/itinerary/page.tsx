'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Calendar, Plus, MapPin, ShieldCheck, Clock, Trash2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function ItineraryPage() {
  const { currentLocation, trustedContact } = useAppStore();

  const [days, setDays] = useState([
    {
      day: 1,
      date: 'Aug 25, 2026',
      title: 'Marina Beach & San Thome Cathedral',
      safetyScore: 84,
      activities: [
        { time: '07:00 AM', text: 'Sunrise walk at Marina Beach Promenade (High crowd, Safe)', safe: true },
        { time: '11:00 AM', text: 'Visit San Thome Basilica', safe: true },
        { time: '01:00 PM', text: 'Lunch at Saravana Bhavan (Verified Safe)', safe: true },
      ],
    },
    {
      day: 2,
      date: 'Aug 26, 2026',
      title: 'Mahabalipuram UNESCO Shore Temple Tour',
      safetyScore: 88,
      activities: [
        { time: '09:00 AM', text: 'Drive to Mahabalipuram via East Coast Road', safe: true },
        { time: '12:00 PM', text: 'Explore Shore Temple & Pancha Rathas', safe: true },
      ],
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Trip Management
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
                My Trip Itinerary & Safety Timeline
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Shared live with your trusted contact ({trustedContact?.name || 'Priya'}).
              </p>
            </div>

            <button
              onClick={() => alert('New Day Added to Itinerary (Demo)')}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50"
            >
              <Plus className="w-4 h-4" /> Add Trip Day
            </button>
          </div>

          <div className="space-y-6">
            {days.map((day) => (
              <div key={day.day} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-cyan-400">Day {day.day} • {day.date}</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{day.title}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                    Route Safety: {day.safetyScore}/100
                  </span>
                </div>

                <div className="space-y-2.5">
                  {day.activities.map((act, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-400 font-mono font-bold">{act.time}</span>
                        <span className="text-slate-200">{act.text}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Zone
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
