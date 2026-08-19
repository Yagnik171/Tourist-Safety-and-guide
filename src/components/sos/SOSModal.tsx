'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, PhoneCall, Radio, CheckCircle, X, ShieldAlert, MapPin } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { SOS_DEMO_DISCLAIMER } from '@/constants';
import { parseCoordinates } from '@/lib/utils';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose }) => {
  const { isSosActive, activeSos, triggerSos, cancelSos, currentLocation, trustedContact } = useAppStore();
  const [countdown, setCountdown] = useState<number>(3);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: currentLocation.latitude,
    lng: currentLocation.longitude,
  });

  // Fetch real geolocation if available
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Fallback to current selected location coords
          setCoords({ lat: currentLocation.latitude, lng: currentLocation.longitude });
        }
      );
    }
  }, [isOpen, currentLocation]);

  // Countdown timer before dispatching SOS
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (isCountingDown && countdown === 0) {
      setIsCountingDown(false);
      triggerSos(coords.lat, coords.lng, `Emergency triggered in ${currentLocation.name}`);
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown, coords, currentLocation, triggerSos]);

  const handleStartCountdown = () => {
    setCountdown(3);
    setIsCountingDown(true);
  };

  const handleCancelCountdown = () => {
    setIsCountingDown(false);
    setCountdown(3);
  };

  const handleCancelActiveSos = () => {
    if (activeSos) {
      cancelSos(activeSos.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-2xl shadow-rose-950/60 overflow-hidden"
      >
        {/* Top Disclaimer Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 mb-5 flex items-start gap-2.5 text-xs text-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block">Prototype Demo Notice</span>
            {SOS_DEMO_DISCLAIMER}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSosActive ? (
          /* ACTIVE SOS STATE */
          <div className="text-center py-4 space-y-5">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-600/20 border-2 border-rose-500 text-rose-400 animate-sos-glow">
              <Radio className="w-10 h-10 animate-pulse" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-rose-400 tracking-wide uppercase">
                EMERGENCY SOS ACTIVATED
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Your emergency distress broadcast is active.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> GPS Coordinates
                </span>
                <span className="font-mono text-white font-semibold">
                  {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Location Context</span>
                <span className="text-white font-medium">{currentLocation.name}, {currentLocation.city}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Emergency Contacts
                </span>
                <span className="text-emerald-300 font-medium">
                  {trustedContact?.name || 'Priya'} ({trustedContact?.phone || '+91 9876543200'})
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 text-cyan-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Authority Dashboard
                </span>
                <span className="text-cyan-300 font-medium">Transmitted in Live Operations Feed</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="tel:112"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-950/40 transition-all text-sm"
              >
                <PhoneCall className="w-4 h-4" /> Call National 112
              </a>
              <button
                onClick={handleCancelActiveSos}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl border border-slate-700 transition-all text-sm"
              >
                Cancel SOS Alert
              </button>
            </div>
          </div>
        ) : isCountingDown ? (
          /* COUNTDOWN STATE */
          <div className="text-center py-6 space-y-5">
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-black text-rose-500"
            >
              {countdown}
            </motion.div>

            <div>
              <h4 className="text-lg font-bold text-white">Sending SOS in {countdown} seconds...</h4>
              <p className="text-xs text-slate-400 mt-1">
                Distress signal will be dispatched to trusted contacts and authority center.
              </p>
            </div>

            <button
              onClick={handleCancelCountdown}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl border border-slate-700 transition-all"
            >
              Cancel Emergency Countdown
            </button>
          </div>
        ) : (
          /* TRIGGER PROMPT STATE */
          <div className="text-center py-4 space-y-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-600/20 text-rose-500 border border-rose-500/30">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Trigger Emergency Distress</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Pressing this button starts a 3-second countdown and immediately shares your live coordinates with designated emergency contacts.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Region:</span>
                <span className="font-semibold text-white">{currentLocation.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trusted Contact:</span>
                <span className="font-semibold text-white">{trustedContact?.name} ({trustedContact?.phone})</span>
              </div>
            </div>

            <button
              onClick={handleStartCountdown}
              className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 text-base transition-all transform active:scale-98"
            >
              <AlertOctagon className="w-5 h-5" /> CONFIRM & SEND SOS
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
