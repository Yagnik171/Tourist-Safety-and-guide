'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Location, IncidentReport, EmergencyContact, Route } from '@/types';
import { Shield, AlertTriangle, Hospital, Phone, Navigation, MapPin } from 'lucide-react';
import { getRiskColor, getRiskLevel } from '@/lib/services/safety-score';

interface SafeWanderMapProps {
  center?: [number, number];
  zoom?: number;
  locations?: Location[];
  incidents?: IncidentReport[];
  emergencyContacts?: EmergencyContact[];
  activeRoute?: Route | null;
  onSelectLocation?: (location: Location) => void;
  onSelectIncident?: (incident: IncidentReport) => void;
  className?: string;
  showSafetyZones?: boolean;
}

// Dynamically import Leaflet components to prevent SSR window issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

export const SafeWanderMap: React.FC<SafeWanderMapProps> = ({
  center = [13.0827, 80.2707],
  zoom = 12,
  locations = [],
  incidents = [],
  emergencyContacts = [],
  activeRoute = null,
  onSelectLocation,
  onSelectIncident,
  className = 'h-[500px] w-full',
  showSafetyZones = true,
}) => {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    setMounted(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  if (!mounted || !L) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl ${className}`}>
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-3" />
        <span className="text-sm font-medium text-slate-400">Loading Interactive Safety Map...</span>
      </div>
    );
  }

  // Create custom Leaflet HTML DivIcons
  const createLocationIcon = (score: number = 75) => {
    const risk = getRiskLevel(score);
    const color = getRiskColor(risk);
    return L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="
        background: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 15px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: black;
        font-weight: 800;
        font-size: 11px;
      ">${score}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  const createIncidentIcon = (severity: string) => {
    const bg = severity === 'high' || severity === 'critical' ? '#ef4444' : '#f97316';
    return L.divIcon({
      className: 'incident-map-marker',
      html: `<div style="
        background: ${bg};
        width: 24px;
        height: 24px;
        border-radius: 6px;
        border: 2px solid white;
        box-shadow: 0 0 10px ${bg};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">⚠️</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const createEmergencyIcon = (type: string) => {
    const color = type === 'police' ? '#3b82f6' : type === 'hospital' ? '#ec4899' : '#10b981';
    const symbol = type === 'police' ? '👮' : type === 'hospital' ? '🏥' : '🚑';
    return L.divIcon({
      className: 'emergency-map-marker',
      html: `<div style="
        background: ${color};
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      ">${symbol}</div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-800 ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        {/* Dark-themed OpenStreetMap CartoDB Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Safety Zones (Heat circles) */}
        {showSafetyZones &&
          locations.map((loc) => {
            const mockScore = loc.city === 'Chennai' ? 72 : loc.city === 'Bengaluru' ? 78 : 65;
            const risk = getRiskLevel(mockScore);
            const color = getRiskColor(risk);

            return (
              <React.Fragment key={`zone-${loc.id}`}>
                <Circle
                  center={[loc.latitude, loc.longitude]}
                  radius={2500}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.15,
                    weight: 1.5,
                  }}
                />
                <Marker
                  position={[loc.latitude, loc.longitude]}
                  icon={createLocationIcon(mockScore)}
                  eventHandlers={{
                    click: () => onSelectLocation && onSelectLocation(loc),
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1.5 min-w-[180px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{loc.name}</span>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold"
                          style={{ backgroundColor: `${color}20`, color }}
                        >
                          {mockScore}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{loc.description || `${loc.city}, ${loc.country}`}</p>
                      <button
                        onClick={() => onSelectLocation && onSelectLocation(loc)}
                        className="w-full mt-2 py-1 px-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
                      >
                        Explore Safety Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

        {/* Verified & Pending Incidents Markers */}
        {incidents.map((inc) => {
          if (!inc.latitude || !inc.longitude) return null;
          return (
            <Marker
              key={`inc-${inc.id}`}
              position={[inc.latitude, inc.longitude]}
              icon={createIncidentIcon(inc.severity)}
              eventHandlers={{
                click: () => onSelectIncident && onSelectIncident(inc),
              }}
            >
              <Popup>
                <div className="p-1 space-y-1.5 min-w-[200px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs uppercase font-extrabold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {inc.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {inc.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{inc.title}</h4>
                  <p className="text-xs text-slate-300">{inc.description}</p>
                  <div className="text-[10px] text-slate-400">{inc.address}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Emergency Services Markers */}
        {emergencyContacts.map((contact) => {
          if (!contact.latitude || !contact.longitude) return null;
          return (
            <Marker
              key={`ec-${contact.id}`}
              position={[contact.latitude, contact.longitude]}
              icon={createEmergencyIcon(contact.type)}
            >
              <Popup>
                <div className="p-1 space-y-1 min-w-[170px]">
                  <div className="font-bold text-sm text-white">{contact.organization}</div>
                  <div className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {contact.phone}
                  </div>
                  <p className="text-xs text-slate-300">{contact.address}</p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="block text-center mt-2 py-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                  >
                    Call Immediately
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Active Route Polyline */}
        {activeRoute && activeRoute.points.length > 1 && (
          <Polyline
            positions={activeRoute.points.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: activeRoute.safety_score >= 75 ? '#10b981' : '#f59e0b',
              weight: 5,
              opacity: 0.85,
              dashArray: activeRoute.name.includes('Safest') ? undefined : '6, 8',
            }}
          />
        )}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-[11px] space-y-1.5 shadow-xl text-slate-300">
        <div className="font-bold text-slate-200 mb-1 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-cyan-400" /> Safety Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Safe (75-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Moderate (55-74)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Caution / Incident</span>
        </div>
      </div>
    </div>
  );
};
