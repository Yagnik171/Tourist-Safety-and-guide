import { calculateSafeRoutes, describeRouteSafety } from '../lib/services/route-scoring';

describe('Route Scoring Service', () => {
  it('computes safest and fastest routes with comparative safety scores', () => {
    const start = { lat: 13.0827, lng: 80.2707 };
    const end = { lat: 13.0499, lng: 80.2824 };

    const comparison = calculateSafeRoutes(start, end, 75);

    expect(comparison.safest).toBeDefined();
    expect(comparison.fastest).toBeDefined();
    expect(comparison.safest.safety_score).toBeGreaterThan(comparison.fastest.safety_score);
    expect(comparison.safest.distance_km).toBeGreaterThanOrEqual(comparison.fastest.distance_km);
    expect(comparison.recommendation).toContain('safest');
  });

  it('describes safety levels accurately', () => {
    expect(describeRouteSafety(90)).toContain('Excellent');
    expect(describeRouteSafety(75)).toContain('Good');
    expect(describeRouteSafety(60)).toContain('Moderate');
    expect(describeRouteSafety(30)).toContain('High risk');
  });
});
