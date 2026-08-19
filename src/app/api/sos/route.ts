import { NextResponse, type NextRequest } from 'next/server';
import { DEMO_SOS_ALERTS } from '@/lib/demo-data';
import type { SOSAlert } from '@/types';

export async function GET() {
  return NextResponse.json({
    data: DEMO_SOS_ALERTS,
    error: null,
    status: 200,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newSos: SOSAlert = {
      id: `sos-${Date.now()}`,
      tourist_id: body.tourist_id || 'demo-tourist-id',
      latitude: body.latitude,
      longitude: body.longitude,
      location_description: body.location_description || 'Emergency triggered via mobile/web',
      status: 'demo',
      is_demo: true,
      authority_notified: false,
      emergency_contact_notified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      data: newSos,
      message: 'SOS distress signal transmitted. Emergency contacts notified.',
      error: null,
      status: 201,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { data: null, error: err instanceof Error ? err.message : 'Failed to process SOS', status: 400 },
      { status: 400 }
    );
  }
}
