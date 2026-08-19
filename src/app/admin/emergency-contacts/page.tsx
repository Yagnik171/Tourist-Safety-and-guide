'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { DEMO_EMERGENCY_CONTACTS } from '@/lib/demo-data';
import { Phone, Plus, Shield, Hospital, Flame } from 'lucide-react';
import { EMERGENCY_TYPE_LABELS } from '@/constants';

export default function AdminEmergencyContactsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="admin" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Service Directory Ops
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
                Emergency Services Management
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Maintain regional hotlines, police dispatch booths, and 24/7 trauma hospitals.
              </p>
            </div>

            <button
              onClick={() => alert('Add Contact Dialog (Demo)')}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-950/50"
            >
              <Plus className="w-4 h-4" /> Add Emergency Contact
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_EMERGENCY_CONTACTS.map((contact) => (
              <div
                key={contact.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                    {EMERGENCY_TYPE_LABELS[contact.type] || contact.type}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">24/7 Verified</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{contact.organization}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{contact.address || 'Chennai Central'}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-400 font-bold">{contact.phone}</span>
                  <button className="text-slate-400 hover:text-white font-semibold">Edit Record</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
