import { Route, RouteComparison, RoutePoint, RiskLevel } from '@/types';
import { getRiskLevel, getRiskColor } from './safety-score';

// ============================================================
// Route Safety Scoring Service
// ============================================================

// Simulates route scoring based on safety data
// In production, this would integrate with routing APIs (OSRM, GraphHopper)
// and real incident/zone data

interface RouteSegmentData {
  safety_score: number;
  incident_count: number;
  is_well_lit: boolean;
  is_main_road: boolean;
}

// Safety weight factors for route scoring
const ROUTE_WEIGHTS = {
  base_safety: 0.50,
  lighting: 0.15,
  road_type: 0.20,
  incident_density: 0.15,
};

/**
 * Calculate safety score for a route based on segment data
 */
function calculateRouteSafetyScore(segments: RouteSegmentData[]): number {
  if (segments.length === 0) return 70;

  const avg_base = segments.reduce((s, seg) => s + seg.safety_score, 0) / segments.length;
  const avg_lighting = segments.filter(s => s.is_well_lit).length / segments.length;
  const avg_main_road = segments.filter(s => s.is_main_road).length / segments.length;
  const total_incidents = segments.reduce((s, seg) => s + seg.incident_count, 0);
  const incident_penalty = Math.min(30, total_incidents * 3);

  const score = Math.round(
    avg_base * ROUTE_WEIGHTS.base_safety * 100 +
    avg_lighting * ROUTE_WEIGHTS.lighting * 100 +
    avg_main_road * ROUTE_WEIGHTS.road_type * 100 +
    (1 - total_incidents / Math.max(10, total_incidents + 1)) * ROUTE_WEIGHTS.incident_density * 100 -
    incident_penalty * 0.1
  );

  return Math.min(100, Math.max(10, score));
}

/**
 * Generate waypoints for a route (simplified Bezier interpolation)
 * In production, use OSRM or similar routing API
 */
function generateRoutePoints(
  start: RoutePoint,
  end: RoutePoint,
  via?: RoutePoint,
  numPoints: number = 8
): RoutePoint[] {
  const points: RoutePoint[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    let lat: number, lng: number;

    if (via) {
      // Quadratic Bezier
      lat = (1 - t) * (1 - t) * start.lat + 2 * (1 - t) * t * via.lat + t * t * end.lat;
      lng = (1 - t) * (1 - t) * start.lng + 2 * (1 - t) * t * via.lng + t * t * end.lng;
    } else {
      lat = start.lat + (end.lat - start.lat) * t;
      lng = start.lng + (end.lng - start.lng) * t;
    }

    points.push({ lat, lng });
  }

  return points;
}

/**
 * Calculate approximate distance between two points (Haversine)
 */
function haversineDistance(p1: RoutePoint, p2: RoutePoint): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Main route comparison function
 * Returns safest and fastest routes with safety scores
 */
export function calculateSafeRoutes(
  start: RoutePoint,
  end: RoutePoint,
  locationSafetyScore: number = 70
): RouteComparison {
  const directDistance = haversineDistance(start, end);

  // Safest route: slightly longer, via well-lit/populated areas
  const safestVia: RoutePoint = {
    lat: (start.lat + end.lat) / 2 + (end.lng - start.lng) * 0.08,
    lng: (start.lng + end.lng) / 2 - (end.lat - start.lat) * 0.08,
  };

  const safestPoints = generateRoutePoints(start, end, safestVia, 10);
  const safestDistance = directDistance * 1.2; // ~20% longer
  const safestDuration = Math.round((safestDistance / 5) * 60); // ~5 km/h walking
  const safestSafetyScore = Math.min(100, locationSafetyScore + 9);

  // Fastest route: direct, may go through less safe areas
  const fastestPoints = generateRoutePoints(start, end, undefined, 6);
  const fastestDistance = directDistance;
  const fastestDuration = Math.round((fastestDistance / 5) * 60);
  const fastestSafetyScore = Math.max(30, locationSafetyScore - 8);

  const safestRisk = getRiskLevel(safestSafetyScore);
  const fastestRisk = getRiskLevel(fastestSafetyScore);

  const safestRoute: Route = {
    points: safestPoints,
    distance_km: Math.round(safestDistance * 10) / 10,
    duration_minutes: safestDuration,
    safety_score: safestSafetyScore,
    risk_level: safestRisk,
    name: 'Safest Route',
    summary: 'Via well-lit, populated streets with fewer reported incidents',
    hazard_notes: safestSafetyScore < 70
      ? ['Some moderate risk zones along this route', 'Stay on main roads']
      : ['Primarily safe corridors', 'Well-lit throughout'],
  };

  const fastestRoute: Route = {
    points: fastestPoints,
    distance_km: Math.round(fastestDistance * 10) / 10,
    duration_minutes: fastestDuration,
    safety_score: fastestSafetyScore,
    risk_level: fastestRisk,
    name: 'Fastest Route',
    summary: 'Direct path, may include areas with higher incident density',
    hazard_notes: fastestSafetyScore < 60
      ? ['Passes through areas with reported incidents', 'Not recommended after dark']
      : ['Moderate risk areas present', 'Exercise normal caution'],
  };

  const scoreDiff = safestSafetyScore - fastestSafetyScore;
  const recommendation =
    scoreDiff >= 15
      ? `We strongly recommend the safest route. It is ${Math.round(scoreDiff)} points safer despite being ${Math.round((safestDistance - fastestDistance) * 10) / 10} km longer.`
      : scoreDiff >= 5
      ? `The safest route is recommended, offering ${scoreDiff} points better safety with only a minor detour.`
      : `Both routes have similar safety profiles. Choose based on your preference.`;

  return { safest: safestRoute, fastest: fastestRoute, recommendation };
}

/**
 * Get a human-readable description of route safety
 */
export function describeRouteSafety(score: number): string {
  if (score >= 85) return 'Excellent safety profile';
  if (score >= 70) return 'Good safety conditions';
  if (score >= 55) return 'Moderate safety — exercise caution';
  if (score >= 40) return 'Elevated risk — stay alert';
  return 'High risk — consider alternatives';
}
