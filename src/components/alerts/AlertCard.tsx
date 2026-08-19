'use client';

import React from 'react';
import { AlertTriangle, CloudRain, ShieldAlert, Activity, Flame, Shield } from 'lucide-react';
import type { SafetyAlert } from '@/types';
import { formatRelativeTime, cn } from '@/lib/utils';

interface AlertCardProps {
  alert: SafetyAlert;
  onViewOnMap?: () => void;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onViewOnMap,
  className,
}) => {
  const typeIcons = {
    weather: CloudRain,
    crime: ShieldAlert,
    traffic: Activity,
    natural_disaster: Flame,
    political: Shield,
    health: Activity,
    general: AlertTriangle,
  };

  const severityStyles = {
    info: 'border-blue-500/30 bg-blue-950/20 text-blue-400',
    low: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400',
    moderate: 'border-amber-500/30 bg-amber-950/20 text-amber-400',
    high: 'border-orange-500/40 bg-orange-950/30 text-orange-400',
    critical: 'border-rose-500/60 bg-rose-950/40 text-rose-400 animate-pulse',
  };

  const Icon = typeIcons[alert.alert_type] || AlertTriangle;

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all duration-200 backdrop-blur-sm relative overflow-hidden space-y-2.5',
        severityStyles[alert.severity] || severityStyles.moderate,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider">
            {alert.alert_type} Alert
          </span>
        </div>

        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800">
          {alert.severity}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-bold text-white">{alert.title}</h4>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.description}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
        <span>{alert.location?.name || 'Chennai'} • {formatRelativeTime(alert.created_at)}</span>
        {onViewOnMap && (
          <button
            onClick={onViewOnMap}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            View on Map →
          </button>
        )}
      </div>
    </div>
  );
};
