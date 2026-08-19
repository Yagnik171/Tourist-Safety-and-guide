import { NextResponse, type NextRequest } from 'next/server';
import { DEMO_INCIDENTS } from '@/lib/demo-data';
import type { IncidentReport } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get('locationId');
  const status = searchParams.get('status');

  let filtered = [...DEMO_INCIDENTS];

  if (locationId) {
    filtered = filtered.filter((inc) => inc.location_id === locationId);
  }
  if (status) {
    filtered = filtered.filter((inc) => inc.status === status);
  }

  return NextResponse.json({
    data: filtered,
    error: null,
    status: 200,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newIncident: IncidentReport = {
      id: `inc-${Date.now()}`,
      reporter_id: body.reporter_id || 'demo-user',
      location_id: body.location_id,
      category: body.category,
      title: body.title,
      description: body.description,
      severity: body.severity || 'medium',
      latitude: body.latitude,
      longitude: body.longitude,
      address: body.address,
      status: 'pending', // Starts as pending until verified by admin
      incident_at: body.incident_at || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      data: newIncident,
      message: 'Incident submitted successfully. Awaiting verification.',
      error: null,
      status: 201,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { data: null, error: err instanceof Error ? err.message : 'Invalid incident data', status: 400 },
      { status: 400 }
    );
  }
}
