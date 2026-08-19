import { calculateSafetyScore, getRiskLevel } from '../lib/services/safety-score';

describe('Safety Score Engine', () => {
  it('calculates baseline score correctly with standard weights', () => {
    const result = calculateSafetyScore({
      crime_score: 80,
      weather_score: 80,
      hazard_score: 80,
      community_score: 80,
      political_stability_score: 80,
    });

    expect(result.overall_score).toBe(80);
    expect(result.risk_level).toBe('safe');
    expect(result.risk_label).toBe('SAFE');
  });

  it('penalizes score when high-severity verified incidents exist', () => {
    const baseResult = calculateSafetyScore({
      crime_score: 80,
      weather_score: 80,
      hazard_score: 80,
      community_score: 80,
      political_stability_score: 80,
      verified_incidents_30d: 0,
      high_severity_incidents: 0,
    });

    const penalizedResult = calculateSafetyScore({
      crime_score: 80,
      weather_score: 80,
      hazard_score: 80,
      community_score: 80,
      political_stability_score: 80,
      verified_incidents_30d: 4,
      high_severity_incidents: 4, // 4 * -5 = -20 penalty on crime
    });

    expect(penalizedResult.overall_score).toBeLessThan(baseResult.overall_score);
    expect(penalizedResult.crime_score).toBe(60);
  });

  it('classifies risk levels accurately', () => {
    expect(getRiskLevel(85)).toBe('safe');
    expect(getRiskLevel(65)).toBe('moderate');
    expect(getRiskLevel(45)).toBe('caution');
    expect(getRiskLevel(25)).toBe('high_risk');
  });
});
