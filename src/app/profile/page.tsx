'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppStore } from '@/lib/store';
import { User, Phone, Mail, Shield, CheckCircle2, Save, Globe } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser, trustedContact } = useAppStore();
  const [name, setName] = useState(user?.name || 'Demo Tourist');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [contactName, setContactName] = useState(trustedContact?.name || 'Priya');
  const [contactPhone, setContactPhone] = useState(trustedContact?.phone || '+91 9876543200');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({
        ...user,
        name,
        phone,
        emergency_contact_name: contactName,
        emergency_contact_phone: contactPhone,
      });
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Account & Safety Profile
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Tourist Profile & Emergency Settings
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Manage your personal identity, verification status, and primary SOS emergency contact details.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Identity Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-black text-xl text-white">
                  {name[0] || 'T'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{name}</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Traveler ID
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Your Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Shield className="w-5 h-5" /> Emergency SOS Contact Details
              </div>
              <p className="text-xs text-slate-400">
                This individual will receive instant SMS and coordinate dispatches when SOS is triggered or a scheduled check-in is missed.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Contact Name & Relation</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Priya (Sister)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Emergency Phone Number</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 9876543200"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shadow-md shadow-cyan-950/50"
              >
                <Save className="w-4 h-4" />
                {isSaved ? '✓ Profile Changes Saved!' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
