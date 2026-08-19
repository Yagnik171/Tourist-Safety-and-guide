'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation, Clock, ShieldCheck, Zap, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { calculateSafeRoutes } from '@/lib/services/route-scoring';
import { useAppStore } from '@/lib/store';
import type { Route, RouteComparison } from '@/types';
import { cn } from '@/lib/utils';

interface RouteCalculatorProps {
  onRouteCalculated?: (comparison: RouteComparison, selected: Route) => void;
  className?: string;
}

export const RouteCalculator: React.FC<RouteCalculatorProps> = ({
  onRouteCalculated,
  className,
}) => {
  const { currentLocation, currentRating } = useAppStore();
  const [fromLoc, setFromLoc] = useState(`${currentLocation.name} Central`);
  const [toLoc, setToLoc] = useState('Marina Beach Lighthouse');
  const [routeResult, setRouteResult] = useState<RouteComparison | null>(null);
  const [selectedRouteType, setSelectedRouteType] = useState<'safest' | 'fastest'>('safest');
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      // Coordinates around current location
      const start = {
        lat: currentLocation.latitude - 0.02,
        lng: currentLocation.longitude - 0.02,
      };
      const end = {
        lat: currentLocation.latitude + 0.03,
        lng: currentLocation.longitude + 0.02,
      };

      const result = calculateSafeRoutes(start, end, currentRating?.overall_score || 72);
      setRouteResult(result);
      setIsCalculating(false);

      if (onRouteCalculated) {
        onRouteCalculated(result, result.safest);
      }
    }, 600);
  };

  const selectRoute = (type: 'safest' | 'fastest') => {
    setSelectedRouteType(type);
    if (routeResult && onRouteCalculated) {
      onRouteCalculated(routeResult, type === 'safest' ? routeResult.safest : routeResult.fastest);
    }
  };

  return (
    <div className={cn('bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            Safety-Aware Route Planner
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculates navigation paths factoring incident density, well-lit corridors, and safety scores.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleCalculate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Starting Point (From)</label>
            <input
              type="text"
              value={fromLoc}
              onChange={(e) => setFromLoc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              placeholder="e.g. Current Location / Hotel"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Destination (To)</label>
            <input
              type="text"
              value={toLoc}
              onChange={(e) => setToLoc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              placeholder="e.g. Tourist Attraction / Landmark"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isCalculating}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isCalculating ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Calculate Safest vs Fastest Route
            </>
          )}
        </button>
      </form>

      {/* Comparison Cards */}
      {routeResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pt-2 border-t border-slate-800/80"
        >
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
                'cursor-pointer rounded-xl p-4 border transition-all relative overflow-hidden',
                selectedRouteType === 'safest'
                  ? 'bg-emerald-950/30 border-emerald-500 shadow-lg shadow-emerald-950/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> RECOMMENDED SAFEST
                </span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {routeResult.safest.safety_score}/100
                </span>
              </div>

              <div className="text-sm font-semibold text-white mb-1">
                {routeResult.safest.name}
              </div>
              <p className="text-xs text-slate-400 mb-3">{routeResult.safest.summary}</p>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  {routeResult.safest.distance_km} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  ~{routeResult.safest.duration_minutes} mins
                </span>
              </div>
            </div>

            {/* FASTEST ROUTE CARD */}
            <div
              onClick={() => selectRoute('fastest')}
              className={cn(
                'cursor-pointer rounded-xl p-4 border transition-all relative overflow-hidden',
                selectedRouteType === 'fastest'
                  ? 'bg-amber-950/30 border-amber-500 shadow-lg shadow-amber-950/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                  <Zap className="w-3.5 h-3.5" /> FASTEST PATH
                </span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {routeResult.fastest.safety_score}/100
                </span>
              </div>

              <div className="text-sm font-semibold text-white mb-1">
                {routeResult.fastest.name}
              </div>
              <p className="text-xs text-slate-400 mb-3">{routeResult.fastest.summary}</p>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  {routeResult.fastest.distance_km} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  ~{routeResult.fastest.duration_minutes} mins
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
