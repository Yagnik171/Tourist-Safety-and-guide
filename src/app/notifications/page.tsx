'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Bell, ShieldAlert, CheckCheck, Clock, Flag, Radio } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Heavy Rainfall Warning',
      message: 'IMD issued heavy rainfall advisory for coastal areas in Chennai. High tide after 5 PM.',
      type: 'alert',
      time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Incident Verified',
      message: 'Your report "Theft at Marina Beach" has been verified by Chennai City Police.',
      type: 'incident',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Safety Check-in Reminder',
      message: 'Scheduled 30-minute safety check-in. Confirm your status with your trusted contact.',
      type: 'checkin',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto space-y-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Activity Center
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
                Notifications & Safety Updates
              </h1>
            </div>

            <button
              onClick={markAllRead}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4" /> Mark all as read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  notif.read
                    ? 'bg-slate-900/50 border-slate-800'
                    : 'bg-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40 shrink-0">
                  <Bell className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                    <span className="text-[11px] text-slate-500">{formatRelativeTime(notif.time)}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
