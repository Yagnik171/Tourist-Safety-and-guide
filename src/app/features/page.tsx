import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, Navigation, Radio, Users, Bell, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    { title: 'Composite Safety Score', desc: 'Weighted 0-100 score evaluating crime, weather, physical hazards, and civic stability.', icon: Shield },
    { title: 'Interactive Safety Map', desc: 'Leaflet-powered spatial map with heat zones, verified incident pins, and emergency services.', icon: Globe },
    { title: 'Safest Route Navigation', desc: 'Intelligent path planning prioritizing well-lit corridors and lower incident density.', icon: Navigation },
    { title: '1-Tap Emergency SOS', desc: 'Captures GPS coordinates and alerts designated contacts and operations center.', icon: Radio },
    { title: 'Solo & Women Safety Mode', desc: 'Automated periodic check-in timer with automated missed check-in alerts.', icon: Sparkles },
    { title: 'Regional Tourist Chat', desc: 'Live community channel for real-time local advice and situation updates.', icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12 w-full">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Platform Capabilities</span>
          <h1 className="text-3xl md:text-5xl font-black text-white">Full-Stack Safety Features</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Explore the complete suite of real-time safety, navigation, and emergency features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
                <div className="p-3 rounded-2xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 w-fit">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-6">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-950/50 inline-flex items-center gap-2"
          >
            Launch Safety Platform
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
