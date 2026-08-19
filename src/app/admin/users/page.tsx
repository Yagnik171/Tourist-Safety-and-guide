'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Users, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

const DEMO_USERS = [
  { id: 'u-1', name: 'Demo Tourist', email: 'tourist@safewander.demo', role: 'tourist', status: 'verified', location: 'Chennai' },
  { id: 'u-2', name: 'Admin User', email: 'admin@safewander.demo', role: 'admin', status: 'verified', location: 'Command Center' },
  { id: 'u-3', name: 'Priya Sharma', email: 'priya.s@example.com', role: 'tourist', status: 'verified', location: 'Marina Beach' },
  { id: 'u-4', name: 'Rahul Mehta', email: 'rahul.m@example.com', role: 'tourist', status: 'pending', location: 'Mumbai' },
  { id: 'u-5', name: 'Karthik Local Guide', email: 'karthik.guide@example.com', role: 'guide', status: 'verified', location: 'Chennai' },
];

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="admin" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Identity Verification
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Registered Users & Verification Directory
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Review tourist identity credentials and manage role-based authorization levels.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">User Name & Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Verification Status</th>
                    <th className="p-4">Active Region</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {DEMO_USERS.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{user.name}</div>
                        <div className="text-slate-400 text-[11px]">{user.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-semibold ${
                          user.status === 'verified' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {user.status === 'verified' ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                          {user.status === 'verified' ? 'Verified' : 'Pending Review'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{user.location}</td>
                      <td className="p-4 text-right">
                        <button className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold">
                          Inspect ID
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
