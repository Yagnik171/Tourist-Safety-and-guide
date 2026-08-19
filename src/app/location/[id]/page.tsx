'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SafetyScoreRadial } from '@/components/safety/SafetyScoreRadial';
import { SafetyBreakdownCard } from '@/components/safety/SafetyBreakdownCard';
import { AlertCard } from '@/components/alerts/AlertCard';
import { SafeWanderMap } from '@/components/map/SafeWanderMap';
import { DEMO_LOCATIONS, DEMO_SAFETY_RATINGS, DEMO_ALERTS, DEMO_INCIDENTS, DEMO_EMERGENCY_CONTACTS } from '@/lib/demo-data';
import { useAppStore } from '@/lib/store';
import { MapPin, Navigation, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function LocationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setCurrentLocation } = useAppStore();

  const id = params?.id as string;
  const location = DEMO_LOCATIONS.find((l) => l.id === id) || DEMO_LOCATIONS[0];
  const rating = DEMO_SAFETY_RATINGS[location.id] || DEMO_SAFETY_RATINGS['a1b2c3d4-e5f6-7890-abcd-ef1234567890'];

  const handleSetActive = () => {
    setCurrentLocation(location);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <button
            onClick={() => router.back()}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </button>

          {/* Location Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold uppercase">
                <MapPin className="w-4 h-4" /> {location.city}, {location.state || 'India'}
              </div>
              <h1 className="text-3xl font-black text-white">{location.name}</h1>
              <p className="text-xs text-slate-400 max-w-xl">{location.description}</p>
            </div>

            <button
              onClick={handleSetActive}
              className="py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/50 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Set as Active Travel Zone
            </button>
          </div>

          {/* Score & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
              <SafetyScoreRadial score={rating.overall_score} size="lg" />
              <p className="text-xs text-slate-400 mt-3">
                Calculated composite score for {location.name}
              </p>
            </div>

            <div className="lg:col-span-8">
              <SafetyBreakdownCard
                crimeScore={rating.crime_score}
                weatherScore={rating.weather_score}
                hazardScore={rating.hazard_score}
                communityScore={rating.community_score}
                politicalScore={rating.political_stability_score}
              />
            </div>
          </div>

          {/* Map Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Spatial Safety Overview ({location.city})
            </h3>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2">
              <SafeWanderMap
                center={[location.latitude, location.longitude]}
                zoom={13}
                locations={[location]}
                incidents={DEMO_INCIDENTS.filter(i => i.location_id === location.id)}
                emergencyContacts={DEMO_EMERGENCY_CONTACTS.filter(c => c.location_id === location.id)}
                className="h-[380px] w-full rounded-xl"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
