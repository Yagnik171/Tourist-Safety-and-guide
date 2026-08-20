'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { Location, IncidentReport, EmergencyContact, Route } from '@/types';
import { Shield, Phone, Navigation, MapPin, Crosshair, Sparkles } from 'lucide-react';
import { getRiskColor, getRiskLevel } from '@/lib/services/safety-score';
import { useMap } from 'react-leaflet';

interface SafeWanderMapProps {
  center?: [number, number];
  zoom?: number;
  locations?: Location[];
  incidents?: IncidentReport[];
  emergencyContacts?: EmergencyContact[];
  activeRoute?: Route | null;
  onSelectLocation?: (location: Location) => void;
  onSelectIncident?: (incident: IncidentReport) => void;
  onLiveLocationFound?: (coords: { lat: number; lng: number }) => void;
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

// Map bounds controller to automatically fit and center route/markers/live GPS
function MapController({
  center,
  zoom,
  activeRoute,
  liveUserCoords,
  L,
}: {
  center: [number, number];
  zoom: number;
  activeRoute?: Route | null;
  liveUserCoords?: { lat: number; lng: number } | null;
  L: any;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !L) return;

    if (activeRoute && activeRoute.points.length > 1) {
      // Fit bounds to entire route
      const latLngs = activeRoute.points.map((p) => [p.lat, p.lng]);
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (liveUserCoords) {
      map.setView([liveUserCoords.lat, liveUserCoords.lng], 15, { animate: true });
    } else if (center) {
      map.setView(center, zoom);
    }
  }, [map, L, activeRoute, liveUserCoords, center, zoom]);

  return null;
}

export const SafeWanderMap: React.FC<SafeWanderMapProps> = ({
  center = [13.0827, 80.2707],
  zoom = 12,
  locations = [],
  incidents = [],
  emergencyContacts = [],
  activeRoute = null,
  onSelectLocation,
  onSelectIncident,
  onLiveLocationFound,
  className = 'h-[500px] w-full',
  showSafetyZones = true,
}) => {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);
  const [liveCoords, setLiveCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  // Function to capture live GPS location from browser/device
  const handleLocateMe = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLiveCoords(coords);
        setIsLocating(false);
        if (onLiveLocationFound) {
          onLiveLocationFound({ lat: coords.lat, lng: coords.lng });
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsLocating(false);
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? 'GPS location permission denied. Please allow location in your browser settings.'
            : 'Unable to retrieve live GPS position.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [onLiveLocationFound]);

  if (!mounted || !L) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl ${className}`}>
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-3" />
        <span className="text-sm font-medium text-slate-400">Loading Interactive Safety Map...</span>
      </div>
    );
  }

  // Live User Location Pulse Icon
  const createLiveUserIcon = () =>
    L.divIcon({
      className: 'live-user-marker',
      html: `<div style="
        position: relative;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(56, 189, 248, 0.4);
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #38bdf8;
          border: 3px solid white;
          box-shadow: 0 0 15px #38bdf8;
        "></div>
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

  // Custom Pin Icons
  const createStartPin = () =>
    L.divIcon({
      className: 'start-pin',
      html: `<div style="
        background: #10b981;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 900;
        font-size: 14px;
      ">A</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

  const createEndPin = () =>
    L.divIcon({
      className: 'end-pin',
      html: `<div style="
        background: #ef4444;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 900;
        font-size: 14px;
      ">B</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

  const createLocationIcon = (score = 75) => {
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

  const routeStartPoint = activeRoute && activeRoute.points.length > 0 ? activeRoute.points[0] : null;
  const routeEndPoint = activeRoute && activeRoute.points.length > 1 ? activeRoute.points[activeRoute.points.length - 1] : null;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-800 ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController center={center} zoom={zoom} activeRoute={activeRoute} liveUserCoords={liveCoords} L={L} />

        {/* CartoDB Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Live User GPS Location Pulse & Accuracy Buffer */}
        {liveCoords && (
          <>
            <Circle
              center={[liveCoords.lat, liveCoords.lng]}
              radius={liveCoords.accuracy || 150}
              pathOptions={{
                color: '#38bdf8',
                fillColor: '#38bdf8',
                fillOpacity: 0.15,
                weight: 1,
              }}
            />
            <Marker position={[liveCoords.lat, liveCoords.lng]} icon={createLiveUserIcon()}>
              <Popup>
                <div className="p-1 space-y-1 min-w-[170px]">
                  <div className="font-bold text-xs text-cyan-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> Your Live GPS Location
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    {liveCoords.lat.toFixed(5)}° N, {liveCoords.lng.toFixed(5)}° E
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold">
                    ✓ Real-Time GPS Tracking Active
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Safety Zones */}
        {showSafetyZones &&
          locations.map((loc) => {
            const mockScore = loc.city === 'Chennai' ? 72 : loc.city === 'Bengaluru' ? 78 : 80;
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

        {/* Incidents Markers */}
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
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Active Route Origin and Destination Markers */}
        {routeStartPoint && (
          <Marker position={[routeStartPoint.lat, routeStartPoint.lng]} icon={createStartPin()}>
            <Popup>
              <div className="p-1 font-bold text-xs text-emerald-400">
                🚩 Origin / Starting Point
              </div>
            </Popup>
          </Marker>
        )}

        {routeEndPoint && (
          <Marker position={[routeEndPoint.lat, routeEndPoint.lng]} icon={createEndPin()}>
            <Popup>
              <div className="p-1 font-bold text-xs text-rose-400">
                🏁 Destination Point
              </div>
            </Popup>
          </Marker>
        )}

        {/* Active Route Polyline */}
        {activeRoute && activeRoute.points.length > 1 && (
          <Polyline
            positions={activeRoute.points.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: activeRoute.safety_score >= 70 ? '#10b981' : '#f59e0b',
              weight: 6,
              opacity: 0.9,
              dashArray: activeRoute.name.includes('Safest') ? undefined : '6, 8',
            }}
          />
        )}
      </MapContainer>

      {/* Floating Locate Me GPS Action Button */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-2xl transition-all border ${
            liveCoords
              ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-cyan-950/60 ring-2 ring-cyan-400/40'
              : 'bg-slate-900/95 hover:bg-slate-800 text-white border-slate-700 shadow-black/80'
          }`}
          title="Track Live GPS Location"
        >
          <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-cyan-400' : liveCoords ? 'text-slate-950' : 'text-cyan-400'}`} />
          <span>{isLocating ? 'Locating GPS...' : liveCoords ? 'GPS Active (Centered)' : '🎯 Locate My Live GPS'}</span>
        </button>

        {locationError && (
          <div className="bg-rose-950/90 border border-rose-500 text-rose-200 text-[11px] p-2 rounded-xl max-w-xs shadow-xl">
            {locationError}
          </div>
        )}
      </div>

      {/* Floating Route Info Overlay if active */}
      {activeRoute && (
        <div className="absolute top-4 left-4 z-[1000] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl text-xs space-y-1 text-slate-300 max-w-xs">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span className="truncate">{activeRoute.name}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span>Distance: <strong className="text-white">{activeRoute.distance_km} km</strong></span>
            <span>Est: <strong className="text-white">~{activeRoute.duration_minutes} mins</strong></span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold pt-0.5">
            ✓ Auto-scaled map to route corridor
          </div>
        </div>
      )}

      {/* Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 text-[11px] space-y-1.5 shadow-xl text-slate-300">
        <div className="font-bold text-slate-200 mb-1 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-cyan-400" /> Safety Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>You Are Here (Live GPS)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Safe Route (Green)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Fastest / Shortcut (Amber)</span>
        </div>
      </div>
    </div>
  );
};
