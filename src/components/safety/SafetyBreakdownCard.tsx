'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CloudRain, AlertTriangle, Users, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SafetyBreakdownCardProps {
  crimeScore: number;
  weatherScore: number;
  hazardScore: number;
  communityScore: number;
  politicalScore: number;
  className?: string;
}

export const SafetyBreakdownCard: React.FC<SafetyBreakdownCardProps> = ({
  crimeScore,
  weatherScore,
  hazardScore,
  communityScore,
  politicalScore,
  className,
}) => {
  const categories = [
    {
      id: 'crime',
      name: 'Crime Safety',
      score: crimeScore,
      icon: Shield,
      desc: 'Theft, scams, local police response',
      color: crimeScore >= 75 ? 'emerald' : crimeScore >= 55 ? 'amber' : 'rose',
    },
    {
      id: 'weather',
      name: 'Weather & Climate',
      score: weatherScore,
      icon: CloudRain,
      desc: 'Rainfall, heatwaves, air quality index',
      color: weatherScore >= 75 ? 'emerald' : weatherScore >= 55 ? 'amber' : 'rose',
    },
    {
      id: 'hazards',
      name: 'Physical Hazards',
      score: hazardScore,
      icon: AlertTriangle,
      desc: 'Road conditions, terrain, lighting',
      color: hazardScore >= 75 ? 'emerald' : hazardScore >= 55 ? 'amber' : 'rose',
    },
    {
      id: 'community',
      name: 'Community Trust',
      score: communityScore,
      icon: Users,
      desc: 'Verified tourist reports & sentiment',
      color: communityScore >= 75 ? 'emerald' : communityScore >= 55 ? 'amber' : 'rose',
    },
    {
      id: 'political',
      name: 'Stability & Health',
      score: politicalScore,
      icon: Landmark,
      desc: 'Curfews, medical access, civil safety',
      color: politicalScore >= 75 ? 'emerald' : politicalScore >= 55 ? 'amber' : 'rose',
    },
  ];

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5', className)}>
      {categories.map((cat, idx) => {
        const Icon = cat.icon;
        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className="group relative bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-950/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-slate-800/80 text-cyan-400 group-hover:bg-cyan-950/40 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={cn(
                  'text-lg font-bold px-2 py-0.5 rounded-md text-sm border font-mono',
                  cat.score >= 75 && 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                  cat.score >= 55 && cat.score < 75 && 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                  cat.score < 55 && 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                )}
              >
                {cat.score}/100
              </span>
            </div>
            
            <h4 className="text-sm font-semibold text-slate-200 mb-1">{cat.name}</h4>
            <p className="text-xs text-slate-400 line-clamp-2">{cat.desc}</p>

            {/* Micro progress bar */}
            <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cat.score}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className={cn(
                  'h-full rounded-full',
                  cat.score >= 75 && 'bg-emerald-500',
                  cat.score >= 55 && cat.score < 75 && 'bg-amber-500',
                  cat.score < 55 && 'bg-rose-500'
                )}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
