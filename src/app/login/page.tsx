'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Sparkles, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { useAppStore } from '@/lib/store';
import { DEMO_TOURIST_EMAIL, DEMO_ADMIN_EMAIL, DEMO_PASSWORD } from '@/constants';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsDemoTourist, loginAsDemoAdmin } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('admin')) {
      loginAsDemoAdmin();
      router.push('/admin');
    } else {
      loginAsDemoTourist();
      router.push('/dashboard');
    }
  };

  const handleQuickTourist = () => {
    loginAsDemoTourist();
    router.push('/dashboard');
  };

  const handleQuickAdmin = () => {
    loginAsDemoAdmin();
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">Sign In to SafeWander</h1>
            <p className="text-xs text-slate-400">Access real-time safety scores, routes & emergency alerts</p>
          </div>

          {/* Quick Demo Login Credentials Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 1-Click Demo Login
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickTourist}
                className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold hover:bg-cyan-500/20 text-xs transition-colors"
              >
                Tourist Mode →
              </button>
              <button
                type="button"
                onClick={handleQuickAdmin}
                className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold hover:bg-blue-500/20 text-xs transition-colors"
              >
                Admin Ops Mode →
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tourist@safewander.demo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all"
            >
              Sign In to Account
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-cyan-400 hover:underline font-semibold">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
