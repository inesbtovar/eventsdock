// app/api/guests/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'

// GET — list guests for an event
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const eventId = request.nextUrl.searchParams.get('eventId')
  if (!eventId) return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })

  const { data: event } = await supabase
    .from('events').select('id').eq('id', eventId).eq('user_id', user.id).single()
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('guests').select('*').eq('event_id', eventId).order('name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ guests: data })
}

// POST — add a single guest manually
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { eventId, name, email, phone, plusOne, dietary } = body

  if (!eventId || !name?.trim()) {
    return NextResponse.json({ error: 'Event ID and name are required' }, { status: 400 })
  }

  const { data: event } = await supabase
    .from('events').select('id').eq('id', eventId).eq('user_id', user.id).single()
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('guests')
    .insert({
      event_id: eventId,
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      plus_one: plusOne ?? false,
      dietary: dietary?.trim() || null,
      rsvp_token: nanoid(12),
      rsvp_status: 'pending',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ guest: data }, { status: 201 })
}

// PATCH — edit a guest
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { guestId, name, email, phone, plusOne, dietary } = body

  if (!guestId) return NextResponse.json({ error: 'Missing guestId' }, { status: 400 })

  // Verify ownership via event
  const { data: guest } = await supabase
    .from('guests')
    .select('id, event_id, events(user_id)')
    .eq('id', guestId)
    .single()

  if (!guest || (guest.events as any)?.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('guests')
    .update({
      name: name?.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      plus_one: plusOne ?? false,
      dietary: dietary?.trim() || null,
    })
    .eq('id', guestId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ guest: data })
}

// DELETE — remove a guest
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const guestId = request.nextUrl.searchParams.get('guestId')
  if (!guestId) return NextResponse.json({ error: 'Missing guestId' }, { status: 400 })

  const { data: guest } = await supabase
    .from('guests')
    .select('id, events(user_id)')
    .eq('id', guestId)
    .single()

  if (!guest || (guest.events as any)?.user_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { error } = await supabase.from('guests').delete().eq('id', guestId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
