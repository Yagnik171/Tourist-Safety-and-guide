'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Radio,
  Navigation,
  MessageCircle,
  Users,
  Lock,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SafetyScoreRadial } from '@/components/safety/SafetyScoreRadial';
import { SafeWanderMap } from '@/components/map/SafeWanderMap';
import { DEMO_LOCATIONS, DEMO_INCIDENTS, DEMO_EMERGENCY_CONTACTS } from '@/lib/demo-data';
import { APP_NAME, APP_TAGLINE } from '@/constants';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />

      {/* ============================================================ */}
      {/* 1. HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/80">
        {/* Background glow orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Headline & CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Gen Travel Safety Intelligence</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Travel Freely.{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                  Travel Safely.
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl">
                Go from <strong className="text-white">&quot;Where am I going?&quot;</strong> to{' '}
                <strong className="text-white">&quot;How safe is it?&quot;</strong> in seconds. Real-time safety scores, community incident alerts, safest route navigation, and instant SOS assistance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Shield className="w-4 h-4" /> Explore Safety Dashboard
                </Link>
                <Link
                  href="/#how-it-works"
                  className="px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  See How It Works <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust & Verification Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Intelligence</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Authority Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Zero Key Required</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Live Interactive Map Preview + Floating Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 p-2">
                <SafeWanderMap
                  center={[13.0827, 80.2707]}
                  zoom={12}
                  locations={DEMO_LOCATIONS}
                  incidents={DEMO_INCIDENTS}
                  emergencyContacts={DEMO_EMERGENCY_CONTACTS}
                  className="h-[420px] w-full rounded-xl"
                />

                {/* Floating Safety Score Badge on Map */}
                <div className="absolute top-6 right-6 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3">
                  <SafetyScoreRadial score={72} size="sm" showLabel={false} />
                  <div>
                    <div className="text-xs font-bold text-white">Chennai City</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">🟢 Safe Zone Active</div>
                    <div className="text-[10px] text-slate-400">3 verified alerts nearby</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. WHY TOURIST SAFETY MATTERS */}
      {/* ============================================================ */}
      <section className="py-20 bg-slate-900/30 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Problem Statement</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Why Tourist Safety Demands a Modern Platform
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tourists often enter unfamiliar cities with zero visibility into local crime hotspots, scam corridors, or sudden hazards. SafeWander provides dynamic situational awareness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Uncertain Local Crime & Scam Risks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tourists are prime targets for overcharging, pickpocketing, and unsafe alleys without localized warning systems.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Navigation Apps Only Optimize Speed</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard map engines send tourists through poorly lit, high-incident shortcuts just to save 2 minutes. SafeWander prioritizes safety.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Emergency Delays & Language Barriers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When distress occurs, tourists struggle to know whom to call and where the nearest emergency station is. Our 1-tap SOS bridges this instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. HOW IT WORKS (5-STEP PROCESS) */}
      {/* ============================================================ */}
      <section id="how-it-works" className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">The Core Workflow</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              From &quot;Where am I?&quot; to Complete Safety in 5 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: '01', title: 'Locate', desc: 'Enter any city, tourist spot, or use live GPS coordinates.', icon: MapPin },
              { num: '02', title: 'Analyze', desc: 'Composite engine calculates dynamic 0-100 safety score.', icon: ShieldCheck },
              { num: '03', title: 'Alert', desc: 'Receive real-time weather, crowd, and crime warnings.', icon: ShieldAlert },
              { num: '04', title: 'Navigate', desc: 'Compare safest well-lit corridors against fastest routes.', icon: Navigation },
              { num: '05', title: 'Connect & Protect', desc: 'Live community chat and instant SOS distress dispatch.', icon: Radio },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 relative group hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-700 group-hover:text-cyan-400 transition-colors font-mono">
                      {step.num}
                    </span>
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SAFETY SCORE ENGINE SHOWCASE */}
      {/* ============================================================ */}
      <section id="safety-score" className="py-20 bg-slate-900/40 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col items-center">
                <SafetyScoreRadial score={82} size="xl" subtext="Live Composite Safety Score" />
                <div className="mt-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  🟢 SAFE DESTINATION
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Algorithmic Intelligence</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Multi-Pillar Safety Score Engine
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Rather than arbitrary numbers, SafeWander computes an aggregated score dynamically from 5 weighted data pillars and verified community incident density.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400">🛡️ Crime Score (30% Weight)</div>
                  <p className="text-slate-400">Theft rates, harassment reports, and police response times.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400">🌧️ Weather & Climate (20% Weight)</div>
                  <p className="text-slate-400">Precipitation, extreme heatwaves, and air quality index.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400">⚠️ Hazard Risk (20% Weight)</div>
                  <p className="text-slate-400">Road conditions, lighting infrastructure, and coastal hazards.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400">👥 Community & Stability (30% Weight)</div>
                  <p className="text-slate-400">Verified traveler experiences and civic stability index.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FINAL CALL TO ACTION */}
      {/* ============================================================ */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
            <Shield className="w-8 h-8" />
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white">
            Travel Smarter. Stay Safer.
          </h2>

          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience the complete platform today. Explore cities, calculate safe routes, join regional chats, and simulate the emergency SOS system.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-950/60 transition-all"
            >
              Start Exploring Platform
            </Link>
            <Link
              href="/admin"
              className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition-all"
            >
              Open Authority Operations Center
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
