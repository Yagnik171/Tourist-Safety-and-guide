import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, Sparkles, Target, Users, Award } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/constants';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 py-16 px-4 md:px-8 max-w-5xl mx-auto space-y-12 w-full">
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">About {APP_NAME}</h1>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            {APP_TAGLINE} Built to empower travelers worldwide with verifiable situational safety intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <Target className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Our Mission</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eliminate information asymmetry in travel. Make every destination&apos;s safety transparent, quantifiable, and actionable.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <Users className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Community Driven</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crowdsourced reports verified by local safety authorities ensure ground reality is reflected in real-time.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Two-Phase Vision</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Phase 1 delivers the full-scale responsive web intelligence platform. Phase 2 introduces native Flutter/React Native mobile clients.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
