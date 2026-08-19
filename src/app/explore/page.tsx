'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, ShieldCheck, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SafetyScoreRadial } from '@/components/safety/SafetyScoreRadial';
import { useAppStore } from '@/lib/store';
import { DEMO_LOCATIONS, DEMO_SAFETY_RATINGS } from '@/lib/demo-data';

export default function ExplorePage() {
  const { setCurrentLocation } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = DEMO_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.state?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Multi-City Safety Intelligence</span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Explore Destinations & Safety Ratings
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Search any Indian urban center or tourist attraction to view composite safety scores and real-time advisories.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city (e.g. Chennai, Mumbai, Delhi, Bengaluru)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-xl"
            />
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

              return (
                <div
                  key={loc.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
                        <MapPin className="w-3.5 h-3.5" /> {loc.city}, {loc.state || 'India'}
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {loc.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {loc.description}
                      </p>
                    </div>

                    <SafetyScoreRadial score={rating.overall_score} size="sm" showLabel={false} />
                  </div>

                  {/* Micro stats */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Crime</div>
                      <div className="font-bold text-slate-200">{rating.crime_score}/100</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Weather</div>
                      <div className="font-bold text-slate-200">{rating.weather_score}/100</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Hazards</div>
                      <div className="font-bold text-slate-200">{rating.hazard_score}/100</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href="/dashboard"
                      onClick={() => setCurrentLocation(loc)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-cyan-950/40"
                    >
                      Set as Active Location
                    </Link>
                    <Link
                      href={`/location/${loc.id}`}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center"
                    >
                      Details →
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
