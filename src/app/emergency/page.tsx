'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SOSButton } from '@/components/sos/SOSButton';
import { useAppStore } from '@/lib/store';
import { getEmergencyContactsForLocation } from '@/lib/demo-data';
import { NATIONAL_EMERGENCY, EMERGENCY_TYPE_LABELS } from '@/constants';
import { Phone, Shield, Hospital, Flame, Radio, MapPin, ExternalLink, Sparkles } from 'lucide-react';

export default function EmergencyPage() {
  const { currentLocation, trustedContact } = useAppStore();

  const cityContacts = getEmergencyContactsForLocation(currentLocation);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Emergency Assistance & Contacts
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Emergency Services ({currentLocation.name}, {currentLocation.city})
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Verified 24/7 Police Headquarters, Government General Hospitals, Trauma Centers, and Tourist Helplines in {currentLocation.city}, {currentLocation.state || 'India'}.
            </p>
          </div>

          {/* Quick SOS Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Instant Distress Signal
              </span>
              <h3 className="text-xl font-bold text-white">Need Immediate Help in {currentLocation.city}?</h3>
              <p className="text-xs text-slate-300 max-w-md">
                Triggering SOS captures your GPS coordinates and immediately notifies designated emergency contacts and the central operations monitoring feed.
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <SOSButton variant="full" className="px-8 py-3.5" />
            </div>
          </div>

          {/* National India Helplines Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              National Emergency Hotlines (Pan-India)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <a
                href={`tel:${NATIONAL_EMERGENCY.emergency}`}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col items-center text-center space-y-2 group shadow-lg"
              >
                <div className="p-3 rounded-full bg-cyan-950/60 text-cyan-400 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-200">National Emergency</div>
                <div className="text-xl font-black text-cyan-400 font-mono">{NATIONAL_EMERGENCY.emergency}</div>
              </a>

              <a
                href={`tel:${NATIONAL_EMERGENCY.police}`}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col items-center text-center space-y-2 group shadow-lg"
              >
                <div className="p-3 rounded-full bg-blue-950/60 text-blue-400 group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-200">Police Control</div>
                <div className="text-xl font-black text-blue-400 font-mono">{NATIONAL_EMERGENCY.police}</div>
              </a>

              <a
                href={`tel:${NATIONAL_EMERGENCY.ambulance}`}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col items-center text-center space-y-2 group shadow-lg"
              >
                <div className="p-3 rounded-full bg-emerald-950/60 text-emerald-400 group-hover:scale-105 transition-transform">
                  <Hospital className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-200">Ambulance / Medical</div>
                <div className="text-xl font-black text-emerald-400 font-mono">{NATIONAL_EMERGENCY.ambulance}</div>
              </a>

              <a
                href={`tel:${NATIONAL_EMERGENCY.fire}`}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col items-center text-center space-y-2 group shadow-lg"
              >
                <div className="p-3 rounded-full bg-amber-950/60 text-amber-400 group-hover:scale-105 transition-transform">
                  <Flame className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-200">Fire & Rescue</div>
                <div className="text-xl font-black text-amber-400 font-mono">{NATIONAL_EMERGENCY.fire}</div>
              </a>
            </div>
          </div>

          {/* Local Verified Responders for the selected destination */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" /> Nearest Verified Responders in {currentLocation.city}
              </h3>
              <span className="text-xs text-slate-400">
                {cityContacts.length} verified responders loaded
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all shadow-xl"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                        {EMERGENCY_TYPE_LABELS[contact.type] || contact.type}
                      </span>
                      {contact.is_24x7 && (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          24x7 Active
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white leading-snug">{contact.name}</h4>
                    <p className="text-xs text-slate-400">{contact.organization}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{contact.address}</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <a
                      href={`tel:${contact.phone}`}
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/40"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Now: {contact.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
