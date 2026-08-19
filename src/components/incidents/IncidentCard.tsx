'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, AlertTriangle, CheckCircle, Clock, MapPin, XCircle, Plus, Send } from 'lucide-react';
import type { IncidentReport, IncidentCategory, IncidentSeverity } from '@/types';
import { INCIDENT_CATEGORY_LABELS } from '@/constants';
import { useAppStore } from '@/lib/store';
import { formatRelativeTime, cn } from '@/lib/utils';

interface IncidentCardProps {
  incident: IncidentReport;
  onVerify?: (id: string) => void;
  onReject?: (id: string) => void;
  isAdmin?: boolean;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onVerify,
  onReject,
  isAdmin = false,
}) => {
  const categoryLabel = INCIDENT_CATEGORY_LABELS[incident.category] || incident.category;

  const severityColors = {
    low: 'text-slate-400 bg-slate-800 border-slate-700',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    high: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    critical: 'text-red-400 bg-red-600/20 border-red-500',
  };

  const statusBadges = {
    pending: { label: 'Pending Verification', icon: Clock, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    verified: { label: 'Verified by Authority', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    rejected: { label: 'Rejected', icon: XCircle, color: 'text-slate-400 bg-slate-800 border-slate-700' },
  };

  const currentStatus = statusBadges[incident.status] || statusBadges.pending;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 space-y-3">
      {/* Top row: Category & Severity */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
            {categoryLabel}
          </span>
          <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border', severityColors[incident.severity])}>
            {incident.severity} Severity
          </span>
        </div>

        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border', currentStatus.color)}>
          <StatusIcon className="w-3 h-3" />
          {currentStatus.label}
        </span>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-sm font-bold text-white leading-snug">{incident.title}</h4>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{incident.description}</p>
      </div>

      {/* Meta info: Address, Time, Reporter */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate max-w-[200px]">{incident.address || 'Chennai Central'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{formatRelativeTime(incident.incident_at || incident.created_at)}</span>
          <span className="text-slate-300 font-medium">By: {incident.reporter?.name || 'Tourist'}</span>
        </div>
      </div>

      {/* Admin Action Buttons (When on Admin Dashboard) */}
      {isAdmin && incident.status === 'pending' && (
        <div className="pt-2 flex items-center gap-2 border-t border-slate-800">
          <button
            onClick={() => onVerify && onVerify(incident.id)}
            className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Verify & Apply Score Impact
          </button>
          <button
            onClick={() => onReject && onReject(incident.id)}
            className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================
// Incident Report Submission Modal
// ============================================================

export const ReportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { currentLocation, user, addIncident } = useAppStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('theft');
  const [severity, setSeverity] = useState<IncidentSeverity>('medium');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState(currentLocation.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newIncident: IncidentReport = {
        id: `inc-${Date.now()}`,
        reporter_id: user?.id || 'demo-user',
        location_id: currentLocation.id,
        category,
        title,
        description,
        severity,
        latitude: currentLocation.latitude + (Math.random() - 0.5) * 0.02,
        longitude: currentLocation.longitude + (Math.random() - 0.5) * 0.02,
        address,
        status: 'pending', // Starts as pending until Admin verification
        incident_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reporter: {
          id: user?.id || 'demo-user',
          name: user?.name || 'Verified Tourist',
          verification_status: 'verified',
        },
      };

      addIncident(newIncident);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
        >
          ✕
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Report Submitted Successfully</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Your incident report has been received and marked as <span className="text-amber-400 font-bold">Pending Verification</span>. Once verified by authority personnel, it will reflect on the live safety map.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-xs transition-colors"
            >
              Back to Safety Platform
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Report a Safety Incident</h3>
                <p className="text-xs text-slate-400">Help fellow tourists stay safe with your report</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Incident Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-500"
                >
                  {Object.entries(INCIDENT_CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-500"
                  >
                    <option value="low">Low (Minor inconvenience)</option>
                    <option value="medium">Medium (Moderate threat)</option>
                    <option value="high">High (Direct theft / hazard)</option>
                    <option value="critical">Critical (Immediate danger)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Location / Landmark</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-500"
                    placeholder="e.g. Marina Beach North End"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Incident Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-500"
                  placeholder="e.g. Phone theft by motorcycle near lighthouse"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-cyan-500"
                  placeholder="Provide details: time of occurrence, suspect description, specific safety precautions..."
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Submit Incident for Verification
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
