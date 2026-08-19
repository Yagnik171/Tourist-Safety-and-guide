import React from 'react';
import Link from 'next/link';
import { Shield, Heart, MapPin } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-slate-950">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-black text-lg text-white">{APP_NAME}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {APP_TAGLINE} Providing real-time tourist safety intelligence, community-driven reports, and safe navigation.
          </p>
          <div className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Initial focus: Chennai, Mumbai, Delhi, Bengaluru
          </div>
        </div>

        {/* Col 2: Features */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Safety Features</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li><Link href="/dashboard" className="hover:text-cyan-400">Real-Time Safety Score</Link></li>
            <li><Link href="/map" className="hover:text-cyan-400">Interactive Safety Map</Link></li>
            <li><Link href="/routes" className="hover:text-cyan-400">Safe Route Finder</Link></li>
            <li><Link href="/report" className="hover:text-cyan-400">Community Incident Reporting</Link></li>
            <li><Link href="/safety-mode" className="hover:text-cyan-400">Solo Traveler Safety Mode</Link></li>
          </ul>
        </div>

        {/* Col 3: Resources */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Emergency & Help</h4>
          <ul className="space-y-1.5 text-slate-400">
            <li><Link href="/emergency" className="hover:text-cyan-400">Emergency Numbers (112 / 100)</Link></li>
            <li><Link href="/community" className="hover:text-cyan-400">Tourist Community Forum</Link></li>
            <li><Link href="/translate" className="hover:text-cyan-400">Emergency Phrase Translator</Link></li>
            <li><Link href="/admin" className="hover:text-cyan-400">Authority Ops Portal</Link></li>
          </ul>
        </div>

        {/* Col 4: Demo Notice */}
        <div className="space-y-2 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Phase 1 Web Launch</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            This platform is architected for seamless Phase 2 native mobile integration (Flutter/React Native) via unified REST APIs.
          </p>
          <div className="text-[10px] text-slate-500 pt-1">
            © 2026 {APP_NAME}. Built with Next.js, TypeScript & Supabase.
          </div>
        </div>
      </div>
    </footer>
  );
};
