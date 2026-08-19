'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CommunityChat } from '@/components/chat/CommunityChat';
import { useAppStore } from '@/lib/store';
import { MessageCircle, ShieldCheck, Users, Sparkles, MapPin } from 'lucide-react';

export default function CommunityPage() {
  const { currentLocation } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Regional Tourist Network
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              {currentLocation.city} Tourist Community
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Connect with fellow travelers and verified local guides in real-time. Share ground conditions, ask questions, and travel together safely.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <CommunityChat />
            </div>

            {/* Community Safety Guidelines & Active City Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" /> Verified Community Rules
                </div>
                <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
                  <li>• Post real-time updates regarding crowds, road closures, and beach safety.</li>
                  <li>• Do not share sensitive personal information or financial data.</li>
                  <li>• In imminent danger, use the top <strong>SOS Emergency Button</strong> immediately.</li>
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <MapPin className="w-5 h-5 text-cyan-400" /> Active Region
                </div>
                <div className="text-xs text-slate-300">
                  You are currently posting in the <strong className="text-white">{currentLocation.name}</strong> regional room. Switch regions using the top navigation bar anytime.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
