'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SOSButton } from '@/components/sos/SOSButton';
import { useAppStore } from '@/lib/store';
import { Shield, Clock, CheckCircle2, AlertTriangle, Phone, MapPin, User, Bell } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function SafetyModePage() {
  const {
    isSafetyModeActive,
    toggleSafetyMode,
    checkInInterval,
    lastCheckInTime,
    checkIn,
    currentLocation,
    trustedContact,
  } = useAppStore();

  const [intervalMinutes, setIntervalMinutes] = useState(checkInInterval || 30);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const handleCheckInNow = () => {
    checkIn();
    setJustCheckedIn(true);
    setTimeout(() => setJustCheckedIn(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Dedicated Protection Mode
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Solo & Women Traveler Safety Mode
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Automate periodic check-in reminders, share live journey status with your trusted contact, and keep high-priority distress armed.
            </p>
          </div>

          {/* Master Toggle Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isSafetyModeActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'
                  }`}
                />
                <h3 className="text-lg font-bold text-white">
                  Safety Mode is {isSafetyModeActive ? 'ACTIVE' : 'INACTIVE'}
                </h3>
              </div>
              <p className="text-xs text-slate-400 max-w-lg">
                When enabled, SafeWander reminds you to check in every {intervalMinutes} minutes and alerts your emergency contact if check-ins are missed.
              </p>
            </div>

            <button
              onClick={() => toggleSafetyMode()}
              className={`px-8 py-3.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                isSafetyModeActive
                  ? 'bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/50'
              }`}
            >
              {isSafetyModeActive ? 'Turn Off Safety Mode' : 'Enable Safety Mode Now'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Check-in Tracker & Settings */}
            <div className="lg:col-span-7 space-y-6">
              {/* Check-in Tracker */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">Periodic Check-in Status</h3>
                  </div>
                  <span className="text-xs text-slate-400">Interval: Every {intervalMinutes}m</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Recorded Check-in:</span>
                    <span className="font-semibold text-white">
                      {lastCheckInTime ? formatRelativeTime(lastCheckInTime) : 'No check-in yet today'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Trip Location:</span>
                    <span className="font-semibold text-white">{currentLocation.name}, {currentLocation.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Emergency Contact:</span>
                    <span className="font-semibold text-cyan-400">
                      {trustedContact?.name || 'Priya'} ({trustedContact?.phone || '+91 9876543200'})
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckInNow}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {justCheckedIn ? '✓ Check-in Confirmed & Transmitted!' : 'I am Safe — Check In Now'}
                </button>
              </div>

              {/* Check-in Interval Configuration */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-cyan-400" /> Reminder Frequency
                </h3>
                <p className="text-xs text-slate-400">
                  Select how frequently SafeWander should prompt you to confirm your safety.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {[15, 30, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setIntervalMinutes(mins)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        intervalMinutes === mins
                          ? 'bg-cyan-950/60 border-cyan-500 text-cyan-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Every {mins} Mins
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Trusted Contacts & Predefined Safe Zones */}
            <div className="lg:col-span-5 space-y-6">
              {/* Emergency Contact Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" /> Trusted Emergency Contact
                </h3>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="font-bold text-white text-sm">{trustedContact?.name}</div>
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" /> {trustedContact?.phone}
                  </div>
                  <div className="text-[10px] text-emerald-400 pt-1">
                    ✓ Authorized to receive automatic SMS alerts during missed check-ins
                  </div>
                </div>
              </div>

              {/* Predefined Safe Havens in City */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" /> Safe Zones in {currentLocation.city}
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-200">Marina Police Booth</div>
                      <div className="text-[10px] text-slate-400">24/7 Security Personnel on duty</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400">0.8 km</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-200">Government General Hospital</div>
                      <div className="text-[10px] text-slate-400">Well-lit emergency reception</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400">2.1 km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
