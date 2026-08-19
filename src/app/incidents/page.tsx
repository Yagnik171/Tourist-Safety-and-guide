'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { IncidentCard, ReportModal } from '@/components/incidents/IncidentCard';
import { useAppStore } from '@/lib/store';
import { Flag, Plus, Filter, Search } from 'lucide-react';
import type { IncidentCategory } from '@/types';

export default function IncidentsPage() {
  const { incidents, currentLocation } = useAppStore();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = incidents.filter((inc) => {
    const matchesCat = filterCategory === 'all' || inc.category === filterCategory;
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Community Intelligence
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
                Reported Safety Incidents
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Real-time incident feed reported by tourists and verified by safety authorities in {currentLocation.city}.
              </p>
            </div>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-950/50"
            >
              <Plus className="w-4 h-4" /> Report New Incident
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search incidents (e.g. theft, beach, scam, pothole)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              <option value="theft">Theft</option>
              <option value="harassment">Harassment</option>
              <option value="scam">Scam</option>
              <option value="road_hazard">Road Hazard</option>
              <option value="unsafe_area">Unsafe Area</option>
            </select>
          </div>

          {/* Incident Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((inc) => (
              <IncidentCard key={inc.id} incident={inc} />
            ))}
          </div>
        </main>
      </div>

      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
}
