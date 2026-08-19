'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Radio,
  MapPin,
  Navigation,
  MessageCircle,
  Flag,
  Phone,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Calendar,
  Compass,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SafetyScoreRadial } from '@/components/safety/SafetyScoreRadial';
import { SafetyBreakdownCard } from '@/components/safety/SafetyBreakdownCard';
import { AlertCard } from '@/components/alerts/AlertCard';
import { IncidentCard, ReportModal } from '@/components/incidents/IncidentCard';
import { SOSButton } from '@/components/sos/SOSButton';
import { useAppStore } from '@/lib/store';
import { DEMO_EMERGENCY_CONTACTS } from '@/lib/demo-data';

export default function DashboardPage() {
  const { currentLocation, currentRating, alerts, incidents, isSafetyModeActive } = useAppStore();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const cityIncidents = incidents.filter(
    (inc) => !inc.location_id || inc.location_id === currentLocation.id || inc.address?.includes(currentLocation.city)
  );

  const cityAlerts = alerts.filter(
    (a) => !a.location_id || a.location_id === currentLocation.id
  );

  const score = currentRating?.overall_score || 72;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          {/* Header row: Current Location Context & Quick Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                <MapPin className="w-4 h-4" /> You are currently exploring
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                {currentLocation.name}, {currentLocation.city}
              </h1>
              <p className="text-xs text-slate-400">
                {currentLocation.description || 'Tamil Nadu, India • Situational Safety Monitored'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 transition-colors"
              >
                <Flag className="w-4 h-4 text-cyan-400" />
                Report Incident
              </button>
              <Link
                href="/routes"
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-2 transition-colors shadow-md shadow-cyan-950/50"
              >
                <Navigation className="w-4 h-4" />
                Safest Route
              </Link>
            </div>
          </div>

          {/* MAIN SAFETY SCORE GAUGE & INSIGHTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Circular score gauge */}
            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
                Composite Regional Safety Score
              </h3>
              <SafetyScoreRadial score={score} size="lg" />
              <div className="mt-4 text-xs text-slate-400 max-w-xs">
                Updated in real-time from active incident reports, weather advisories, and civic health indicators.
              </div>
            </div>

            {/* Quick Action Cards & Live Highlights */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/map"
                className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl group transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 group-hover:scale-105 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                    Open Map <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">Interactive Safety Map</h4>
                <p className="text-xs text-slate-400">
                  Inspect color-coded risk heatzones, verified theft pins, and safe corridor routes in {currentLocation.city}.
                </p>
              </Link>

              <Link
                href="/safety-mode"
                className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl group transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 group-hover:scale-105 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                    {isSafetyModeActive ? 'Active' : 'Configure'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">Solo & Women Safety Mode</h4>
                <p className="text-xs text-slate-400">
                  Automated 30-minute contact check-ins, trip monitoring, and persistent emergency access.
                </p>
              </Link>

              <Link
                href="/community"
                className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl group transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                    128 Online <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">Tourist Community Live Chat</h4>
                <p className="text-xs text-slate-400">
                  Ask fellow travelers about beach crowds, scams, and safest dining spots right now.
                </p>
              </Link>

              <Link
                href="/emergency"
                className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl group transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    Dial 112 / 100 <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">Emergency Directory</h4>
                <p className="text-xs text-slate-400">
                  Direct contact to {currentLocation.city} Police, General Hospital, and Tourist Assistance Booths.
                </p>
              </Link>
            </div>
          </div>

          {/* 5-Pillar Score Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Detailed Safety Breakdown ({currentLocation.city})
            </h3>
            <SafetyBreakdownCard
              crimeScore={currentRating?.crime_score || 68}
              weatherScore={currentRating?.weather_score || 75}
              hazardScore={currentRating?.hazard_score || 70}
              communityScore={currentRating?.community_score || 78}
              politicalScore={currentRating?.political_stability_score || 74}
            />
          </div>

          {/* Active Alerts in Current Region */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Active Safety Alerts in {currentLocation.city}
              </h3>
              <Link href="/alerts" className="text-xs text-cyan-400 font-semibold hover:underline">
                View All Alerts ({alerts.length})
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cityAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>

          {/* Recent Verified Incidents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Flag className="w-4 h-4 text-cyan-400" /> Recent Community Incidents
              </h3>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-xs text-cyan-400 font-semibold hover:underline"
              >
                + Submit Report
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cityIncidents.slice(0, 4).map((inc) => (
                <IncidentCard key={inc.id} incident={inc} />
              ))}
            </div>
          </div>
        </main>
      </div>

      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
}
