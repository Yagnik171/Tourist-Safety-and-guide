import {
  SafetyScoreInput,
  SafetyScoreResult,
  RiskLevel,
} from '@/types';

// ============================================================
// Safety Score Weights (configurable)
// ============================================================

const WEIGHTS = {
  crime: 0.30,
  weather: 0.20,
  hazard: 0.20,
  community: 0.15,
  political_stability: 0.15,
} as const;

// Incident impact on crime score (per incident in last 30 days)
const INCIDENT_IMPACT = {
  high_severity: -5,
  medium_severity: -2,
  low_severity: -1,
};

// ============================================================
// Risk Level Classification
// ============================================================

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 75) return 'safe';
  if (score >= 55) return 'moderate';
  if (score >= 35) return 'caution';
  return 'high_risk';
}

export function getRiskLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    safe: 'SAFE',
    moderate: 'MODERATE',
    caution: 'CAUTION',
    high_risk: 'HIGH RISK',
  };
  return labels[level];
}

export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    safe: '#22c55e',      // green-500
    moderate: '#eab308',  // yellow-500
    caution: '#f97316',   // orange-500
    high_risk: '#ef4444', // red-500
  };
  return colors[level];
}

export function getRiskBgColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    safe: 'bg-green-500/10 text-green-400 border-green-500/30',
    moderate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    caution: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    high_risk: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  return colors[level];
}

// ============================================================
// Category Score Labeling
// ============================================================

export function getCategoryLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 35) return 'Poor';
  return 'Critical';
}

// ============================================================
// Main Safety Score Calculator
// ============================================================

export function calculateSafetyScore(input: SafetyScoreInput): SafetyScoreResult {
  const {
    crime_score,
    weather_score,
    hazard_score,
    community_score,
    political_stability_score,
    verified_incidents_30d = 0,
    high_severity_incidents = 0,
  } = input;

  // Adjust crime score based on recent verified incidents
  const medium_severity = verified_incidents_30d - high_severity_incidents;
  const incident_penalty =
    high_severity_incidents * Math.abs(INCIDENT_IMPACT.high_severity) +
    Math.max(0, medium_severity) * Math.abs(INCIDENT_IMPACT.medium_severity);

  const adjusted_crime = Math.max(10, crime_score - incident_penalty);

  // Weighted overall score
  const overall = Math.round(
    adjusted_crime * WEIGHTS.crime +
    weather_score * WEIGHTS.weather +
    hazard_score * WEIGHTS.hazard +
    community_score * WEIGHTS.community +
    political_stability_score * WEIGHTS.political_stability
  );

  const clampedOverall = Math.min(100, Math.max(0, overall));
  const risk_level = getRiskLevel(clampedOverall);

  // Generate explanation
  const explanation: string[] = [];

  if (adjusted_crime < crime_score) {
    explanation.push(
      `Crime score reduced from ${crime_score} to ${Math.round(adjusted_crime)} due to ${verified_incidents_30d} verified incidents in the last 30 days.`
    );
  }

  if (weather_score < 60) {
    explanation.push('Weather conditions present elevated risk. Check local forecasts before traveling.');
  }

  if (hazard_score < 60) {
    explanation.push('Significant hazards identified in this area. Exercise caution.');
  }

  if (community_score >= 80) {
    explanation.push('Strong community safety reporting in this area.');
  }

  if (risk_level === 'safe') {
    explanation.push('This location is generally safe for tourists. Standard precautions recommended.');
  } else if (risk_level === 'high_risk') {
    explanation.push('This area has elevated risk. Consider alternative locations or exercise extreme caution.');
  }

  return {
    overall_score: clampedOverall,
    risk_level,
    risk_label: getRiskLabel(risk_level),
    color: getRiskColor(risk_level),
    crime_score: Math.round(adjusted_crime),
    weather_score,
    hazard_score,
    community_score,
    political_stability_score,
    explanation,
  };
}

// ============================================================
// Score from SafetyRating DB record
// ============================================================

export function scoreFromRating(rating: {
  overall_score: number;
  crime_score: number;
  weather_score: number;
  hazard_score: number;
  community_score: number;
  political_stability_score: number;
}): SafetyScoreResult {
  const risk_level = getRiskLevel(rating.overall_score);
  return {
    overall_score: rating.overall_score,
    risk_level,
    risk_label: getRiskLabel(risk_level),
    color: getRiskColor(risk_level),
    crime_score: rating.crime_score,
    weather_score: rating.weather_score,
    hazard_score: rating.hazard_score,
    community_score: rating.community_score,
    political_stability_score: rating.political_stability_score,
    explanation: [],
  };
}

// ============================================================
// Category breakdown for display
// ============================================================

export interface ScoreCategory {
  key: string;
  label: string;
  score: number;
  icon: string;
  description: string;
}

export function getScoreCategories(result: SafetyScoreResult): ScoreCategory[] {
  return [
    {
      key: 'crime',
      label: 'Crime',
      score: result.crime_score,
      icon: 'shield',
      description: 'Theft, harassment and criminal activity levels',
    },
    {
      key: 'weather',
      label: 'Weather',
      score: result.weather_score,
      icon: 'cloud',
      description: 'Weather conditions and natural weather risks',
    },
    {
      key: 'hazard',
      label: 'Hazards',
      score: result.hazard_score,
      icon: 'alert-triangle',
      description: 'Physical hazards, infrastructure and road safety',
    },
    {
      key: 'community',
      label: 'Community',
      score: result.community_score,
      icon: 'users',
      description: 'Community-reported safety and local sentiment',
    },
    {
      key: 'political',
      label: 'Political',
      score: result.political_stability_score,
      icon: 'landmark',
      description: 'Political stability and civil unrest risk',
    },
  ];
}
