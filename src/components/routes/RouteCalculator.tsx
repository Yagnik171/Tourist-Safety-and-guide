'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Navigation,
  Clock,
  ShieldCheck,
  Zap,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { calculateSafeRoutesAsync, geocodeLocation } from '@/lib/services/route-scoring';
import { useAppStore } from '@/lib/store';
import type { Route, RouteComparison } from '@/types';
import { cn } from '@/lib/utils';

interface RouteCalculatorProps {
  onRouteCalculated?: (comparison: RouteComparison, selected: Route) => void;
  className?: string;
}

const POPULAR_ROUTES = [
  { from: 'Nellore', to: 'Chennai' },
  { from: 'Chennai Central', to: 'Marina Beach' },
  { from: 'Tirupati', to: 'Chennai' },
  { from: 'Chennai', to: 'Mahabalipuram' },
  { from: 'Bengaluru', to: 'Chennai' },
];

export const RouteCalculator: React.FC<RouteCalculatorProps> = ({
  onRouteCalculated,
  className,
}) => {
  const { currentLocation, currentRating } = useAppStore();
  const [fromLoc, setFromLoc] = useState('Nellore');
  const [toLoc, setToLoc] = useState('Chennai');
  const [resolvedFrom, setResolvedFrom] = useState('');
  const [resolvedTo, setResolvedTo] = useState('');
  const [routeResult, setRouteResult] = useState<RouteComparison | null>(null);
  const [selectedRouteType, setSelectedRouteType] = useState<'safest' | 'fastest'>('safest');
  const [isCalculating, setIsCalculating] = useState(false);

  // Auto-calculate on initial load for instant demonstration
  useEffect(() => {
    handleCalculateRoute('Nellore', 'Chennai');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCalculateRoute = async (origin = fromLoc, destination = toLoc) => {
    if (!origin.trim() || !destination.trim()) return;

    setIsCalculating(true);

    try {
      // 1. Geocode origin and destination
      const [startGeo, endGeo] = await Promise.all([
        geocodeLocation(origin),
        geocodeLocation(destination),
      ]);

      setResolvedFrom(startGeo.displayName);
      setResolvedTo(endGeo.displayName);

      // 2. Calculate routes with real road routing
      const result = await calculateSafeRoutesAsync(
        { lat: startGeo.lat, lng: startGeo.lng },
        { lat: endGeo.lat, lng: endGeo.lng },
        origin,
        destination,
        currentRating?.overall_score || 72
      );

      setRouteResult(result);
      setSelectedRouteType('safest');

      if (onRouteCalculated) {
        onRouteCalculated(result, result.safest);
      }
    } catch (err) {
      console.error('Route calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCalculateRoute(fromLoc, toLoc);
  };

  const handleSelectPreset = (preset: { from: string; to: string }) => {
    setFromLoc(preset.from);
    setToLoc(preset.to);
    handleCalculateRoute(preset.from, preset.to);
  };

  const selectRoute = (type: 'safest' | 'fastest') => {
    setSelectedRouteType(type);
    if (routeResult && onRouteCalculated) {
      onRouteCalculated(routeResult, type === 'safest' ? routeResult.safest : routeResult.fastest);
    }
  };

  return (
    <div className={cn('bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            Safety-Aware Route Navigation
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real turn-by-turn routing with highway patrol checkpoints, illumination rating, and hazard avoidance.
          </p>
        </div>
      </div>

      {/* Quick Search Preset Tags */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Popular Routes (1-Click)
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_ROUTES.map((preset) => (
            <button
              key={`${preset.from}-${preset.to}`}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs transition-colors"
            >
              {preset.from} → {preset.to}
            </button>
          ))}
        </div>
      </div>

      {/* Search Inputs */}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Starting Point (From)
            </label>
            <input
              type="text"
              value={fromLoc}
              onChange={(e) => setFromLoc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
              placeholder="e.g. Nellore / Chennai Central"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> Destination (To)
            </label>
            <input
              type="text"
              value={toLoc}
              onChange={(e) => setToLoc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
              placeholder="e.g. Chennai / Marina Beach"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isCalculating}
          className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isCalculating ? (
            <div className="flex items-center gap-2 text-slate-950">
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Calculating Real Road Directions & Safety Factors...</span>
            </div>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Find Safest Route ({fromLoc} → {toLoc})
            </>
          )}
        </button>
      </form>

      {/* Comparison Cards & Directions Details */}
      {routeResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pt-2 border-t border-slate-800/80"
        >
          {/* Resolved Names Context */}
          {resolvedFrom && resolvedTo && (
            <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
              <span>Origin: <strong className="text-white">{resolvedFrom}</strong></span>
              <span>Destination: <strong className="text-white">{resolvedTo}</strong></span>
            </div>
          )}

          {/* AI Recommendation banner */}
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{routeResult.recommendation}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SAFEST ROUTE CARD */}
            <div
              onClick={() => selectRoute('safest')}
              className={cn(
                'cursor-pointer rounded-xl p-4 border transition-all relative overflow-hidden space-y-2',
                selectedRouteType === 'safest'
                  ? 'bg-emerald-950/30 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> RECOMMENDED SAFEST
                </span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {routeResult.safest.safety_score}/100
                </span>
              </div>

              <div className="text-sm font-semibold text-white">
                {routeResult.safest.name}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{routeResult.safest.summary}</p>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-200 pt-1">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  {routeResult.safest.distance_km} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  ~{Math.floor(routeResult.safest.duration_minutes / 60) > 0 ? `${Math.floor(routeResult.safest.duration_minutes / 60)}h ` : ''}
                  {routeResult.safest.duration_minutes % 60} mins
                </span>
              </div>
            </div>

            {/* FASTEST ROUTE CARD */}
            <div
              onClick={() => selectRoute('fastest')}
              className={cn(
                'cursor-pointer rounded-xl p-4 border transition-all relative overflow-hidden space-y-2',
                selectedRouteType === 'fastest'
                  ? 'bg-amber-950/30 border-amber-500 shadow-lg shadow-amber-950/40 ring-1 ring-amber-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  <Zap className="w-3.5 h-3.5" /> FASTEST PATH
                </span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {routeResult.fastest.safety_score}/100
                </span>
              </div>

              <div className="text-sm font-semibold text-white">
                {routeResult.fastest.name}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{routeResult.fastest.summary}</p>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-200 pt-1">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  {routeResult.fastest.distance_km} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  ~{Math.floor(routeResult.fastest.duration_minutes / 60) > 0 ? `${Math.floor(routeResult.fastest.duration_minutes / 60)}h ` : ''}
                  {routeResult.fastest.duration_minutes % 60} mins
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
