'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppStore } from '@/lib/store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, ShieldCheck, Flag, Users } from 'lucide-react';

const CATEGORY_DATA = [
  { name: 'Theft', count: 18, fill: '#ef4444' },
  { name: 'Scam', count: 14, fill: '#f97316' },
  { name: 'Road Hazard', count: 9, fill: '#eab308' },
  { name: 'Harassment', count: 6, fill: '#ec4899' },
  { name: 'Unsafe Area', count: 12, fill: '#3b82f6' },
];

const REGIONAL_TREND_DATA = [
  { month: 'Jan', Chennai: 70, Mumbai: 66, Delhi: 62, Bengaluru: 75 },
  { month: 'Feb', Chennai: 71, Mumbai: 67, Delhi: 63, Bengaluru: 76 },
  { month: 'Mar', Chennai: 72, Mumbai: 68, Delhi: 64, Bengaluru: 77 },
  { month: 'Apr', Chennai: 73, Mumbai: 69, Delhi: 65, Bengaluru: 78 },
  { month: 'May', Chennai: 72, Mumbai: 69, Delhi: 65, Bengaluru: 78 },
];

export default function AdminAnalyticsPage() {
  const { incidents, locations } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="admin" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Platform Intelligence
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Safety Analytics & Risk Trends
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Data visualizations tracking incident categories, resolution velocity, and multi-city safety score trajectories.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1: Incidents by Category */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Flag className="w-4 h-4 text-cyan-400" /> Incidents by Category
                </h3>
                <span className="text-xs text-slate-400 font-mono">Last 30 Days</span>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CATEGORY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Bar dataKey="count" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Regional Safety Score Trends */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Multi-City Safety Score Trends
                </h3>
                <span className="text-xs text-slate-400 font-mono">2026 Trajectory</span>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REGIONAL_TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 90]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Line type="monotone" dataKey="Chennai" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Bengaluru" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Mumbai" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Delhi" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
