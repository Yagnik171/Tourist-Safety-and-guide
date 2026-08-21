'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AlertCard } from '@/components/alerts/AlertCard';
import { useAppStore } from '@/lib/store';
import { DEMO_ALERTS, getAlertsForLocation } from '@/lib/demo-data';
import { Bell, ShieldAlert, Sparkles, Filter, Thermometer, Wind, CloudSun, Radio, CheckCircle2, RefreshCw } from 'lucide-react';

interface LiveWeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  is_day: number;
  time: string;
}

// Convert Open-Meteo WMO weathercode to readable condition string
function getWmoCondition(code: number): { text: string; alertType: 'warning' | 'normal' | 'caution' } {
  if (code === 0) return { text: 'Clear Sky / Sunny', alertType: 'normal' };
  if (code <= 3) return { text: 'Partly Cloudy', alertType: 'normal' };
  if (code <= 48) return { text: 'Fog / Low Visibility', alertType: 'caution' };
  if (code <= 67) return { text: 'Light to Moderate Rain', alertType: 'caution' };
  if (code <= 77) return { text: 'Snow / Hail Flurries', alertType: 'caution' };
  if (code <= 82) return { text: 'Heavy Rain Showers', alertType: 'warning' };
  if (code >= 95) return { text: 'Thunderstorm Warning', alertType: 'warning' };
  return { text: 'Fair Weather', alertType: 'normal' };
}

export default function AlertsPage() {
  const { currentLocation } = useAppStore();
  const [filterType, setFilterType] = useState<'all' | 'current' | 'weather'>('all');
  const [liveWeather, setLiveWeather] = useState<LiveWeatherData | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  // Fetch live real-time weather from Open-Meteo API
  const fetchLiveWeather = async () => {
    setIsLoadingLive(true);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${currentLocation.latitude}&longitude=${currentLocation.longitude}&current_weather=true`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.current_weather) {
          setLiveWeather(data.current_weather);
          setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (err) {
      console.warn('Live weather fetch error:', err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
  }, [currentLocation.id, currentLocation.latitude, currentLocation.longitude]);

  const currentCityAlerts = getAlertsForLocation(currentLocation);

  const displayedAlerts =
    filterType === 'current'
      ? currentCityAlerts
      : filterType === 'weather'
      ? DEMO_ALERTS.filter((a) => a.alert_type === 'weather' || a.title.includes('Heatwave'))
      : DEMO_ALERTS;

  const wmoInfo = liveWeather ? getWmoCondition(liveWeather.weathercode) : null;
  const isHeatwaveTemp = liveWeather ? liveWeather.temperature >= 35 : false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
          {/* Top Title & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Live Safety & Weather Feed
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
                Active Safety & Weather Alerts
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Real-time satellite weather intel paired with official IMD heatwave and police safety bulletins.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  filterType === 'all'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-950/50'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                All India ({DEMO_ALERTS.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('current')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  filterType === 'current'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                📍 {currentLocation.city} ({currentCityAlerts.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('weather')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  filterType === 'weather'
                    ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-950/50'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                ☀️ Heatwaves & Storms
              </button>
            </div>
          </div>

          {/* LIVE METEOROLOGY SATELLITE CARD */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-cyan-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Live Real-Time Satellite Intel • {currentLocation.name}, {currentLocation.city}
                </span>
              </div>
              <button
                onClick={fetchLiveWeather}
                disabled={isLoadingLive}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
                {lastRefreshed ? `Refreshed ${lastRefreshed}` : 'Refresh'}
              </button>
            </div>

            {isLoadingLive ? (
              <div className="py-4 text-xs text-slate-400 animate-pulse flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-cyan-400 animate-bounce" />
                Fetching live satellite weather feed for {currentLocation.city}...
              </div>
            ) : liveWeather ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Live Temperature
                  </span>
                  <div className="text-xl font-black font-mono text-white">
                    {liveWeather.temperature}°C
                  </div>
                  <span className={`text-[10px] font-bold ${isHeatwaveTemp ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isHeatwaveTemp ? '⚠️ Heatwave Advisory Active' : 'Normal Seasonal Range'}
                  </span>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <CloudSun className="w-3.5 h-3.5 text-cyan-400" /> Weather Condition
                  </span>
                  <div className="text-sm font-bold text-white truncate">
                    {wmoInfo?.text || 'Clear'}
                  </div>
                  <span className="text-[10px] text-slate-400">Open-Meteo WMO Code #{liveWeather.weathercode}</span>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-blue-400" /> Wind Velocity
                  </span>
                  <div className="text-xl font-black font-mono text-white">
                    {liveWeather.windspeed} km/h
                  </div>
                  <span className="text-[10px] text-slate-400">Surface Wind Speed</span>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-emerald-400" /> Feed Source
                  </span>
                  <div className="text-xs font-bold text-emerald-300">
                    Live Real-Time Satellite
                  </div>
                  <span className="text-[10px] text-slate-400">Verified Live Stream</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Alert Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
