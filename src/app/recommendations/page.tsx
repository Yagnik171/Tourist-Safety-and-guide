'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppStore } from '@/lib/store';
import { DEMO_LOCATIONS } from '@/lib/demo-data';
import { Star, ShieldCheck, MapPin, ExternalLink, Hotel, Utensils, Landmark } from 'lucide-react';

export default function RecommendationsPage() {
  const { currentLocation } = useAppStore();

  const places = [
    {
      name: 'Taj Coromandel Hotel',
      category: 'Luxury Hotel',
      safetyRating: 95,
      address: 'Nungambakkam High Rd, Chennai',
      desc: '24/7 private security, verified concierge, safe access corridors.',
      icon: Hotel,
    },
    {
      name: 'Saravana Bhavan Vegetarian',
      category: 'Restaurant',
      safetyRating: 90,
      address: 'Nelson Manickam Rd, Chennai',
      desc: 'Hygienic traditional cuisine, family-safe dining, high footfall.',
      icon: Utensils,
    },
    {
      name: 'Government Museum Chennai',
      category: 'Cultural Attraction',
      safetyRating: 92,
      address: 'Pantheon Rd, Egmore, Chennai',
      desc: 'Well-guarded heritage precinct, secure ticketing and visitor assistance.',
      icon: Landmark,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Safe Places Directory
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Recommended Safe Places in {currentLocation.city}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Curated hotels, hygienic dining, and verified landmarks with high safety scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {places.map((place) => {
              const Icon = place.icon;
              return (
                <div
                  key={place.name}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                        Safety: {place.safetyRating}/100
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{place.category}</span>
                      <h3 className="text-base font-bold text-white mt-0.5">{place.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{place.desc}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span className="truncate max-w-[180px]">{place.address}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + currentLocation.city)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                    >
                      Navigate <ExternalLink className="w-3 h-3" />
                    </a>
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
