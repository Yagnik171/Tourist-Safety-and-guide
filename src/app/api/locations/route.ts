import { NextResponse } from 'next/server';
import { DEMO_LOCATIONS, DEMO_SAFETY_RATINGS } from '@/lib/demo-data';

export async function GET() {
  const locationsWithRatings = DEMO_LOCATIONS.map((loc) => ({
    ...loc,
    safety_rating: DEMO_SAFETY_RATINGS[loc.id] || null,
  }));

  return NextResponse.json({
    data: locationsWithRatings,
    error: null,
    status: 200,
  });
}
