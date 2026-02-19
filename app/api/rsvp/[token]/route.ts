// app/api/rsvp/[token]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// GET — fetch guest info by token (for showing their name on RSVP page)
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const admin = createAdminClient()
  
  const { data: guest, error } = await admin
    .from('guests')
    .select('id, name, rsvp_status, plus_one, event_id, events(name, date, location, template, template_config, is_published)')
    .eq('rsvp_token', params.token)
    .single()

  if (error || !guest) {
    return NextResponse.json({ error: 'Invalid invitation link' }, { status: 404 })
  }

  return NextResponse.json({ guest })
}

// POST — submit RSVP response
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const admin = createAdminClient()
  const body = await request.json()
  
  const { status, plusOneName, dietary, notes } = body

  if (!['confirmed', 'declined'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { data, error } = await admin
    .from('guests')
    .update({
      rsvp_status: status,
      plus_one_name: plusOneName || null,
      dietary: dietary || null,
      notes: notes || null,
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