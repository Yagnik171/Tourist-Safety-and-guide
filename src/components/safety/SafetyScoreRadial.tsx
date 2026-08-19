'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getRiskColor, getRiskLabel, getRiskLevel } from '@/lib/services/safety-score';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface SafetyScoreRadialProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  showCategoryScores?: boolean;
  className?: string;
  subtext?: string;
}

export const SafetyScoreRadial: React.FC<SafetyScoreRadialProps> = ({
  score,
  size = 'lg',
  showLabel = true,
  showCategoryScores = false,
  className,
  subtext = 'Overall Safety Score',
}) => {
  const riskLevel = getRiskLevel(score);
  const color = getRiskColor(riskLevel);
  const label = getRiskLabel(riskLevel);

  const sizeConfigs = {
    sm: { radius: 36, stroke: 6, width: 88, text: 'text-xl', labelText: 'text-[10px]' },
    md: { radius: 54, stroke: 8, width: 130, text: 'text-3xl', labelText: 'text-xs' },
    lg: { radius: 76, stroke: 10, width: 180, text: 'text-4xl font-extrabold', labelText: 'text-sm' },
    xl: { radius: 95, stroke: 12, width: 230, text: 'text-5xl font-black', labelText: 'text-base' },
  };

  const config = sizeConfigs[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const ShieldIcon = score >= 75 ? ShieldCheck : score >= 55 ? Shield : ShieldAlert;

  return (
    <div className={cn('flex flex-col items-center justify-center text-center', className)}>
      <div className="relative flex items-center justify-center" style={{ width: config.width, height: config.width }}>
        <svg
          className="transform -rotate-90"
          width={config.width}
          height={config.width}
        >
          {/* Background circle track */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={config.radius}
            stroke="#1e293b"
            strokeWidth={config.stroke}
            fill="transparent"
          />
          {/* Animated score arc */}
          <motion.circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={config.radius}
            stroke={color}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <span className={cn(config.text, 'tracking-tight text-white')}>
              {score}
            </span>
            <span
              className={cn(
                config.labelText,
                'font-bold tracking-wider uppercase mt-0.5 px-2 py-0.5 rounded-full border',
                score >= 75 && 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                score >= 55 && score < 75 && 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                score >= 35 && score < 55 && 'text-orange-400 bg-orange-500/10 border-orange-500/30',
                score < 35 && 'text-rose-400 bg-rose-500/10 border-rose-500/30'
              )}
            >
              {label}
            </span>
          </motion.div>
        </div>
      </div>

      {showLabel && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldIcon className="w-3.5 h-3.5" style={{ color }} />
          <span>{subtext}</span>
        </div>
      )}
    </div>
  );
};
