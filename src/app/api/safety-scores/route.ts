import { NextResponse, type NextRequest } from 'next/server';
import { calculateSafetyScore } from '@/lib/services/safety-score';
import { DEMO_SAFETY_RATINGS } from '@/lib/demo-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get('locationId');

  if (locationId && DEMO_SAFETY_RATINGS[locationId]) {
    const rawRating = DEMO_SAFETY_RATINGS[locationId];
    const scoreResult = calculateSafetyScore({
      crime_score: rawRating.crime_score,
      weather_score: rawRating.weather_score,
      hazard_score: rawRating.hazard_score,
      community_score: rawRating.community_score,
      political_stability_score: rawRating.political_stability_score,
    });

    return NextResponse.json({
      data: { ...rawRating, ...scoreResult },
      error: null,
      status: 200,
    });
  }

  return NextResponse.json({
    data: Object.values(DEMO_SAFETY_RATINGS),
    error: null,
    status: 200,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = calculateSafetyScore(body);

    return NextResponse.json({
      data: result,
      error: null,
      status: 200,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { data: null, error: err instanceof Error ? err.message : 'Invalid request payload', status: 400 },
      { status: 400 }
    );
  }
}
