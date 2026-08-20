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
import { getEmergencyContactsForLocation, getAlertsForLocation, DEMO_SAFETY_RATINGS } from '@/lib/demo-data';

export default function DashboardPage() {
  const { currentLocation, currentRating, incidents, isSafetyModeActive } = useAppStore();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Dynamic location-aware rating
  const locationRating = DEMO_SAFETY_RATINGS[currentLocation.id] || currentRating || {
    overall_score: 75,
    crime_score: 70,
    weather_score: 80,
    hazard_score: 75,
    community_score: 80,
    political_stability_score: 75,
  };

  // Location-aware alerts & incidents
  const cityAlerts = getAlertsForLocation(currentLocation);
  const cityContacts = getEmergencyContactsForLocation(currentLocation);

  const cityIncidents = incidents.filter(
    (inc) => !inc.location_id || inc.location_id === currentLocation.id || inc.address?.includes(currentLocation.city)
  );

  const score = locationRating.overall_score;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          {/* Header row: Current Location Context & Quick Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                <MapPin className="w-4 h-4" /> You are currently exploring
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                {currentLocation.name}, {currentLocation.city}
              </h1>
              <p className="text-xs text-slate-400">
                {currentLocation.description || `${currentLocation.state || 'India'} • Situational Safety Monitored`}
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
                Composite Regional Safety Score ({currentLocation.city})
              </h3>
              <SafetyScoreRadial score={score} size="lg" />
              <div className="mt-4 text-xs text-slate-400 max-w-xs">
                Updated in real-time from active incident reports, weather advisories, and civic vigilance in {currentLocation.city}.
              </div>
            </div>

            {/* Quick Action Cards & Live Highlights */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/map"
                className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl group transition-all shadow-lg"
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
                  Inspect color-coded risk heatzones, verified police booths, and hospitals in {currentLocation.city}.
                </p>
              </Link>

              <Link
                href="/safety-mode"
                className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl group transition-all shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 group-hover:scale-105 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    {isSafetyModeActive ? 'Active' : 'Inactive'} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">Tourist Safety Mode</h4>
                <p className="text-xs text-slate-400">
                  Automated periodic GPS safety check-ins and dead-man timer while traveling in {currentLocation.city}.
                </p>
              </Link>

              <Link
                href="/community"
                className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl group transition-all shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/40 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                    Join Feed <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">Local Tourist Community</h4>
                <p className="text-xs text-slate-400">
                  Ask verified travelers about crowds, scams, and safest dining spots in {currentLocation.name}.
                </p>
              </Link>

              <Link
                href="/emergency"
                className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl group transition-all shadow-lg"
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
                  Direct contacts for {cityContacts[0]?.name || `${currentLocation.city} Police`} & Hospitals.
                </p>
              </Link>
            </div>
          </div>

          {/* 5-Pillar Score Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Detailed Safety Breakdown ({currentLocation.name})
            </h3>
            <SafetyBreakdownCard
              crimeScore={locationRating.crime_score}
              weatherScore={locationRating.weather_score}
              hazardScore={locationRating.hazard_score}
              communityScore={locationRating.community_score}
              politicalScore={locationRating.political_stability_score}
            />
          </div>

          {/* Active Alerts in Current Region */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Active Safety & Weather Advisories in {currentLocation.city}
              </h3>
              <Link href="/alerts" className="text-xs text-cyan-400 font-semibold hover:underline">
                View All Advisories ({cityAlerts.length})
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cityAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>

          {/* Local Emergency Services Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400" /> Nearest Emergency Responders ({currentLocation.city})
              </h3>
              <Link href="/emergency" className="text-xs text-cyan-400 font-semibold hover:underline">
                Full Emergency Directory →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {cityContacts.slice(0, 3).map((contact) => (
                <div key={contact.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{contact.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold uppercase">
                      {contact.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{contact.address}</p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="block text-center py-1.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400 font-bold transition-colors"
                  >
                    📞 {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
}
