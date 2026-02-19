// app/api/rsvp/[token]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

type Params = { params: { token: string } }

// GET — fetch guest + event info by RSVP token
// Public: no auth required
export async function GET(_request: NextRequest, { params }: Params) {
  const admin = createAdminClient()

  const { data: guest, error } = await admin
    .from('guests')
    .select(`
      id,
      name,
      rsvp_status,
      plus_one,
      plus_one_name,
      dietary,
      responded_at,
      event_id,
      events (
        id,
        name,
        slug,
        date,
        location,
        description,
        template,
        template_config,
        cover_image,
        is_published
      )
    `)
    .eq('rsvp_token', params.token)
    .single()

  if (error || !guest) {
    return NextResponse.json({ error: 'Invalid invitation link' }, { status: 404 })
  }

  // Check event is published (unless already responded)
  const event = guest.events as any
  if (!event?.is_published && guest.rsvp_status === 'pending') {
    return NextResponse.json({ error: 'This event is not available yet' }, { status: 404 })
  }

  return NextResponse.json({ guest })
}

// POST — submit RSVP response
// Public: no auth required
export async function POST(request: NextRequest, { params }: Params) {
  const admin = createAdminClient()

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { status, plusOneName, dietary, notes } = body

  if (!['confirmed', 'declined'].includes(status)) {
    return NextResponse.json(
      { error: 'Status must be "confirmed" or "declined"' },
      { status: 400 }
    )
  }

  // Check the token exists first
  const { data: existing } = await admin
    .from('guests')
    .select('id, rsvp_status')
    .eq('rsvp_token', params.token)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Invalid invitation link' }, { status: 404 })
  }

  const { data, error } = await admin
    .from('guests')
    .update({
      rsvp_status: status,
      plus_one_name: plusOneName?.trim() || null,
      dietary: dietary?.trim() || null,
      notes: notes?.trim() || null,
      responded_at: new Date().toISOString(),
    })
    .eq('rsvp_token', params.token)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, guest: data })
}
