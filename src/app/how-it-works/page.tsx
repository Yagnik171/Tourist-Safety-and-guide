import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MapPin, ShieldCheck, ShieldAlert, Navigation, Radio } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    { num: '01', title: 'Locate & Geofence', desc: 'Enter any city or permit GPS location capture.', icon: MapPin },
    { num: '02', title: 'Multi-Pillar Analysis', desc: 'The scoring engine evaluates crime, weather, hazards, and civic stability.', icon: ShieldCheck },
    { num: '03', title: 'Real-Time Alerts', desc: 'Receive instant meteorological and crime bulletins.', icon: ShieldAlert },
    { num: '04', title: 'Safe Pathfinding', desc: 'Calculate routes that steer clear of high incident density alleys.', icon: Navigation },
    { num: '05', title: 'Distress & Community', desc: '1-tap SOS distress transmission and regional traveler chat.', icon: Radio },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 py-16 px-4 md:px-8 max-w-5xl mx-auto space-y-12 w-full">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Platform Workflow</span>
          <h1 className="text-3xl md:text-5xl font-black text-white">How SafeWander Works</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            From initial search to continuous trip protection — a seamless 5-stage architecture.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-6"
              >
                <span className="text-3xl font-black text-cyan-400 font-mono shrink-0">{s.num}</span>
                <div className="p-3 rounded-2xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 shrink-0 hidden sm:flex">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-950/50 inline-flex items-center gap-2"
          >
            Try the Platform Live
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
