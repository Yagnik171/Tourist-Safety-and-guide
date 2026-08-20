'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Bell, MapPin, User, ChevronDown, Radio, LogIn, Sparkles, ShieldAlert, LogOut } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { SOSButton } from '@/components/sos/SOSButton';
import { APP_NAME } from '@/constants';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    user,
    role,
    isAuthenticated,
    isDemoMode,
    currentLocation,
    locations,
    setCurrentLocation,
    alerts,
    logout,
    loginAsDemoTourist,
    loginAsDemoAdmin,
  } = useAppStore();

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isPublicPage = ['/', '/about', '/features', '/how-it-works', '/contact', '/login', '/register'].includes(pathname);
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Brand Logo & Tag */}
        <div className="flex items-center gap-4">
          <Link href={isAuthenticated ? (role === 'admin' ? '/admin' : '/dashboard') : '/'} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-md shadow-cyan-950/50 group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-white tracking-tight leading-none">
                {APP_NAME}
              </span>
              <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                {isAdminPage ? 'Authority Ops' : 'Safety Platform'}
              </span>
            </div>
          </Link>

          {/* Quick Location Selector (when authenticated) */}
          {isAuthenticated && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold">{currentLocation.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-2xl z-50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase px-2.5 py-1">Select Region (22+ Places)</div>
                  {locations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setCurrentLocation(loc);
                        setIsLocationDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors',
                        currentLocation.id === loc.id
                          ? 'bg-cyan-950/60 text-cyan-400'
                          : 'text-slate-300 hover:bg-slate-800'
                      )}
                    >
                      <span>{loc.name}</span>
                      <span className="text-[10px] text-slate-400">{loc.city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Navigation Links for Public Pages */}
        {isPublicPage && (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/#features" className="hover:text-cyan-400 transition-colors">Features</Link>
            <Link href="/#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</Link>
            <Link href="/#safety-score" className="hover:text-cyan-400 transition-colors">Safety Scoring</Link>
            <Link href="/#community" className="hover:text-cyan-400 transition-colors">Community</Link>
          </nav>
        )}

        {/* Right: Actions, Notifications, SOS, Profile */}
        <div className="flex items-center gap-3">
          {/* Demo Mode switcher */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-[11px] text-cyan-300">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Demo Mode</span>
          </div>

          {/* SOS Distress Button (Always Available) */}
          <SOSButton />

          {/* Alerts Notification Bell */}
          {isAuthenticated && (
            <Link
              href="/alerts"
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white">
                  {alerts.length}
                </span>
              )}
            </Link>
          )}

          {/* Auth controls */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-xs text-white">
                  {user?.name?.[0] || 'U'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                      Role: {role}
                    </span>
                  </div>

                  {/* Switch Demo Roles */}
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        loginAsDemoTourist();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center justify-between"
                    >
                      <span>Switch to Tourist View</span>
                      {role === 'tourist' && <span className="text-cyan-400 font-bold">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        loginAsDemoAdmin();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center justify-between"
                    >
                      <span>Switch to Admin Ops View</span>
                      {role === 'admin' && <span className="text-cyan-400 font-bold">✓</span>}
                    </button>
                  </div>

                  <div className="border-t border-slate-800 pt-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-md shadow-cyan-950/50"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
