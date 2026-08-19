import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format, parseISO } from 'date-fns';

// ---- Tailwind class merging ----

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---- Date formatting ----

export function formatRelativeTime(dateString: string): string {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return 'Unknown time';
  }
}

export function formatDate(dateString: string, fmt = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), fmt);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return dateString;
  }
}

// ---- Distance calculation ----

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)} km`;
}

// ---- String utilities ----

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function generateInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ---- Score / number utilities ----

export function clampScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function scoreToPercent(score: number): string {
  return `${clampScore(score)}%`;
}

// ---- GPS / location utilities ----

export function parseCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}

export function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// ---- URL utilities ----

export function buildGoogleMapsUrl(lat: number, lng: number, label?: string): string {
  const base = 'https://www.google.com/maps';
  if (label) {
    return `${base}/search/?api=1&query=${encodeURIComponent(label)}&query_place_id=${lat},${lng}`;
  }
  return `${base}?q=${lat},${lng}`;
}

// ---- Phone utilities ----

export function formatPhoneForCall(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`;
}

// ---- Debounce ----

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// ---- Color by score ----

export function getScoreColorClass(score: number): string {
  if (score >= 75) return 'text-emerald-400';
  if (score >= 55) return 'text-amber-400';
  if (score >= 35) return 'text-orange-400';
  return 'text-rose-400';
}

export function getScoreBgClass(score: number): string {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 55) return 'bg-amber-500';
  if (score >= 35) return 'bg-orange-500';
  return 'bg-rose-500';
}

// ---- Error handling ----

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

// ---- Local storage helpers (client only) ----

export function safeLocalStorageGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function safeLocalStorageSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore
  }
}
