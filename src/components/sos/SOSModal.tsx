'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertOctagon,
  PhoneCall,
  Radio,
  CheckCircle,
  X,
  ShieldAlert,
  MapPin,
  MessageSquare,
  Send,
  ExternalLink,
  PhoneForwarded,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { SOS_DEMO_DISCLAIMER } from '@/constants';

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

  // ALWAYS use 7424962369 as the designated SOS emergency phone
  const SOS_TARGET_PHONE = '7424962369';
  const cleanPhone = SOS_TARGET_PHONE;

  // Fetch real geolocation if available
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
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
      triggerSos(coords.lat, coords.lng, `Emergency distress triggered near ${currentLocation.name}`);
      
      // Auto-trigger haptic vibration if supported on mobile
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([300, 100, 300, 100, 300]);
      }
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

  const mapsUrl = `https://maps.google.com/?q=${coords.lat.toFixed(5)},${coords.lng.toFixed(5)}`;
  const emergencyMessage = `🚨 EMERGENCY SOS ALERT! I am in danger and need immediate help. My Live GPS Location: ${mapsUrl} (Near ${currentLocation.name}, ${currentLocation.city})`;

  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(emergencyMessage)}`;
  const smsUrl = `sms:+91${cleanPhone}?body=${encodeURIComponent(emergencyMessage)}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative w-full max-w-lg bg-slate-900 border border-rose-500/50 rounded-3xl p-6 shadow-2xl shadow-rose-950/80 overflow-hidden"
      >
        {/* Top Header Badge */}
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-2.5 mb-5 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-bold uppercase tracking-wider">
              Emergency SOS • Target Phone: <span className="font-mono text-white underline">{cleanPhone}</span>
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSosActive ? (
          /* ACTIVE SOS STATE */
          <div className="text-center py-2 space-y-5">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-600/20 border-2 border-rose-500 text-rose-400 animate-sos-glow">
              <Radio className="w-10 h-10 animate-pulse text-rose-400" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-rose-400 tracking-wide uppercase">
                EMERGENCY SOS BROADCAST ACTIVE
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Distress broadcast transmitted. Fast 1-click links below to call or message <strong className="text-white font-mono">+91 {cleanPhone}</strong>.
              </p>
            </div>

            {/* GPS Context Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Locked Live GPS
                </span>
                <span className="font-mono text-cyan-400 font-bold">
                  {coords.lat.toFixed(5)}° N, {coords.lng.toFixed(5)}° E
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Location</span>
                <span className="text-white font-semibold">{currentLocation.name}, {currentLocation.city}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" /> Designated Guardian
                </span>
                <span className="text-white font-mono font-bold">
                  +91 {cleanPhone}
                </span>
              </div>
            </div>

            {/* Quick Action Dial & Messaging Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={`tel:${cleanPhone}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black py-3 px-4 rounded-xl shadow-lg shadow-rose-950/50 transition-all text-xs"
              >
                <PhoneCall className="w-4 h-4" /> 📞 Call +91 {cleanPhone}
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl shadow-lg shadow-emerald-950/50 transition-all text-xs"
              >
                <Send className="w-4 h-4" /> 🟢 WhatsApp SOS with GPS
              </a>

              <a
                href={smsUrl}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold py-3 px-4 rounded-xl border border-slate-700 transition-all text-xs"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" /> 💬 Send Direct SMS
              </a>

              <a
                href="tel:112"
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-950/50 transition-all text-xs"
              >
                <PhoneForwarded className="w-4 h-4" /> 🚓 Dial Police (112)
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCancelActiveSos}
                className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium py-2.5 rounded-xl border border-slate-700 transition-all text-xs"
              >
                Cancel Emergency Distress Mode
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
              className="text-7xl font-black text-rose-500 font-mono"
            >
              {countdown}
            </motion.div>

            <div>
              <h4 className="text-lg font-bold text-white">Broadcasting SOS in {countdown} seconds...</h4>
              <p className="text-xs text-slate-400 mt-1">
                Dispatching GPS coordinates to Guardian Phone (+91 {cleanPhone}) and Authority Control.
              </p>
            </div>

            <button
              onClick={handleCancelCountdown}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl border border-slate-700 transition-all text-xs"
            >
              Cancel Countdown
            </button>
          </div>
        ) : (
          /* TRIGGER PROMPT STATE */
          <div className="text-center py-4 space-y-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-600/20 text-rose-500 border border-rose-500/30">
              <AlertOctagon className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Trigger Emergency Distress</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                Starts a 3-second countdown and prepares immediate calling and GPS dispatch to your designated contact.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Location:</span>
                <span className="font-semibold text-white">{currentLocation.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Emergency Phone:</span>
                <span className="font-mono font-black text-rose-400 text-sm bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                  +91 {cleanPhone}
                </span>
              </div>
            </div>

            <button
              onClick={handleStartCountdown}
              className="w-full bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-rose-950/60 flex items-center justify-center gap-2 text-base transition-all transform active:scale-98"
            >
              <AlertOctagon className="w-6 h-6" /> CONFIRM & SEND SOS
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
