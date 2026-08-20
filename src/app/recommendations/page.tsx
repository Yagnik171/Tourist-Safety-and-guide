'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppStore } from '@/lib/store';
import { getRecommendationsForLocation } from '@/lib/demo-data';
import type { CityPlace } from '@/lib/demo-data';
import { ExternalLink, Hotel, Utensils, Landmark, ShoppingBag, HeartPulse, Trees, Star, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

const CATEGORY_ICON: Record<CityPlace['category'], React.ElementType> = {
  Hotel: Hotel,
  Restaurant: Utensils,
  Attraction: Landmark,
  Shopping: ShoppingBag,
  Healthcare: HeartPulse,
  Park: Trees,
};

const CATEGORY_COLOR: Record<CityPlace['category'], string> = {
  Hotel: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40',
  Restaurant: 'text-amber-400 bg-amber-950/60 border-amber-800/40',
  Attraction: 'text-violet-400 bg-violet-950/60 border-violet-800/40',
  Shopping: 'text-pink-400 bg-pink-950/60 border-pink-800/40',
  Healthcare: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40',
  Park: 'text-green-400 bg-green-950/60 border-green-800/40',
};

const SCORE_COLOR = (score: number) => {
  if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30';
  if (score >= 80) return 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30';
  return 'text-amber-400 border-amber-500/40 bg-amber-950/30';
};

const ALL_CATEGORIES: CityPlace['category'][] = ['Hotel', 'Restaurant', 'Attraction', 'Shopping', 'Healthcare', 'Park'];

export default function RecommendationsPage() {
  const { currentLocation } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<CityPlace['category'] | 'All'>('All');

  const allPlaces = getRecommendationsForLocation(currentLocation);
  const filtered = activeFilter === 'All'
    ? allPlaces
    : allPlaces.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          {/* Page Header */}
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Safe Places Directory
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Recommended Safe Places in{' '}
              <span className="text-cyan-400">{currentLocation.city}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Curated hotels, hygienic dining, and verified landmarks in{' '}
              <strong className="text-slate-300">{currentLocation.name}</strong>,{' '}
              {currentLocation.state} — each verified with high safety scores.
            </p>
          </div>

          {/* Active location indicator */}
          <div className="flex items-center gap-2 p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs w-fit">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Currently showing recommendations for:</span>
            <span className="font-bold text-white">{currentLocation.city}, {currentLocation.state}</span>
            <span className="text-slate-500">• {allPlaces.length} safe spots found</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                activeFilter === 'All'
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              All ({allPlaces.length})
            </button>
            {ALL_CATEGORIES.filter((cat) => allPlaces.some((p) => p.category === cat)).map((cat) => {
              const Icon = CATEGORY_ICON[cat];
              const count = allPlaces.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    activeFilter === cat
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-3 h-3" /> {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Place Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((place, idx) => {
              const Icon = CATEGORY_ICON[place.category];
              const iconStyle = CATEGORY_COLOR[place.category];
              const scoreStyle = SCORE_COLOR(place.safetyRating);
              return (
                <div
                  key={`${place.name}-${idx}`}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Icon + Score */}
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border ${iconStyle}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold font-mono flex items-center gap-1 ${scoreStyle}`}>
                        <ShieldCheck className="w-3 h-3" />
                        {place.safetyRating}/100
                      </span>
                    </div>

                    {/* Name + Category + Description */}
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        {place.category}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5 leading-snug group-hover:text-cyan-300 transition-colors">
                        {place.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {place.desc}
                      </p>
                    </div>
                  </div>

                  {/* Footer: Address + Navigate */}
                  <div className="pt-3 border-t border-slate-800 text-xs flex items-center justify-between gap-2">
                    <span className="text-slate-500 truncate flex items-center gap-1 max-w-[60%]">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {place.address}
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ', ' + currentLocation.city)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 shrink-0 transition-colors"
                    >
                      Navigate <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-bold">No places found for this category.</p>
              <button onClick={() => setActiveFilter('All')} className="text-xs text-cyan-400 mt-1 hover:underline">
                Show all recommendations
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
