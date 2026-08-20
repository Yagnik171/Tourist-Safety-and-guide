'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Filter,
  Navigation,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SafetyScoreRadial } from '@/components/safety/SafetyScoreRadial';
import { useAppStore } from '@/lib/store';
import { DEMO_LOCATIONS, DEMO_SAFETY_RATINGS } from '@/lib/demo-data';

const REGION_FILTERS = [
  'All Places',
  'Tamil Nadu',
  'Andhra Pradesh',
  'Karnataka',
  'Maharashtra',
  'Kerala',
  'Rajasthan',
  'Delhi',
  'Uttar Pradesh',
  'Goa',
  'Punjab & Himalayas',
];

export default function ExplorePage() {
  const { setCurrentLocation, currentLocation } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Places');
  const [safetyFilter, setSafetyFilter] = useState<'all' | 'safe' | 'moderate'>('all');

  const filteredLocations = DEMO_LOCATIONS.filter((loc) => {
    // 1. Search Query
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      loc.name.toLowerCase().includes(query) ||
      loc.city.toLowerCase().includes(query) ||
      loc.state?.toLowerCase().includes(query) ||
      loc.description?.toLowerCase().includes(query);

    // 2. Region Filter
    let matchesRegion = true;
    if (selectedRegion !== 'All Places') {
      if (selectedRegion === 'Punjab & Himalayas') {
        matchesRegion = loc.state === 'Punjab' || loc.state === 'Himachal Pradesh';
      } else {
        matchesRegion = loc.state === selectedRegion;
      }
    }

    // 3. Safety Level Filter
    const rating = DEMO_SAFETY_RATINGS[loc.id] || { overall_score: 75 };
    let matchesSafety = true;
    if (safetyFilter === 'safe') {
      matchesSafety = rating.overall_score >= 75;
    } else if (safetyFilter === 'moderate') {
      matchesSafety = rating.overall_score >= 55 && rating.overall_score < 75;
    }

    return matchesSearch && matchesRegion && matchesSafety;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-City Safety Intelligence • 22+ Famous Destinations</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Explore Destinations & Safety Ratings
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Discover famous tourist destinations across India. Review composite safety scores, crime vigilance, hazard indexes, and activate real-time protection.
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by city, temple, beach, or monument (e.g. Nellore, Tirupati, Taj Mahal, Munnar, Goa)..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-xl font-medium"
                />
              </div>

              {/* Safety Score Filter */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSafetyFilter('all')}
                  className={`px-4 py-3.5 rounded-2xl text-xs font-bold border transition-all ${
                    safetyFilter === 'all'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-lg'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  All ({DEMO_LOCATIONS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSafetyFilter('safe')}
                  className={`px-4 py-3.5 rounded-2xl text-xs font-bold border transition-all ${
                    safetyFilter === 'safe'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-lg'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-300'
                  }`}
                >
                  🟢 Safe (75+)
                </button>
                <button
                  type="button"
                  onClick={() => setSafetyFilter('moderate')}
                  className={`px-4 py-3.5 rounded-2xl text-xs font-bold border transition-all ${
                    safetyFilter === 'moderate'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-lg'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-300'
                  }`}
                >
                  🟡 Moderate
                </button>
              </div>
            </div>

            {/* State Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {REGION_FILTERS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedRegion === region
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-950/50'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Results count banner */}
          <div className="text-xs text-slate-400 flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span>
              Showing <strong className="text-white">{filteredLocations.length}</strong> of{' '}
              <strong className="text-white">{DEMO_LOCATIONS.length}</strong> destinations
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Destination Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((loc) => {
              const rating = DEMO_SAFETY_RATINGS[loc.id] || {
                overall_score: 75,
                crime_score: 70,
                weather_score: 80,
                hazard_score: 75,
                community_score: 75,
                political_stability_score: 75,
              };

              const isActive = currentLocation.id === loc.id;

              return (
                <div
                  key={loc.id}
                  className={`bg-slate-900/90 border rounded-2xl p-6 transition-all duration-200 hover:shadow-2xl hover:shadow-cyan-950/30 flex flex-col justify-between space-y-4 group ${
                    isActive
                      ? 'border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                      : 'border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{loc.city}, {loc.state || 'India'}</span>
                        </div>
                        <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors leading-snug">
                          {loc.name}
                        </h3>
                      </div>

                      <SafetyScoreRadial score={rating.overall_score} size="sm" showLabel={false} />
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {loc.description}
                    </p>
                  </div>

                  {/* 3 Pillar Micro Stats */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Crime</div>
                      <div className="font-bold text-slate-200 font-mono">{rating.crime_score}/100</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Weather</div>
                      <div className="font-bold text-slate-200 font-mono">{rating.weather_score}/100</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Hazards</div>
                      <div className="font-bold text-slate-200 font-mono">{rating.hazard_score}/100</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentLocation(loc)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                          isActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/40'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active Destination
                          </>
                        ) : (
                          'Set as Active Region'
                        )}
                      </button>

                      <Link
                        href={`/location/${loc.id}`}
                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center transition-colors"
                      >
                        Details →
                      </Link>
                    </div>

                    <Link
                      href="/routes"
                      onClick={() => setCurrentLocation(loc)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3 h-3 text-cyan-400" /> Plan Safe Route to {loc.city}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
