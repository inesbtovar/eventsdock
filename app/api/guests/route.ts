// app/api/guests/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'

// GET — list all guests for an event
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const eventId = request.nextUrl.searchParams.get('eventId')

  if (!eventId) {
    return NextResponse.json({ error: 'Missing eventId' }, { status: 400 })
  }

  // Verify the event belongs to this user
  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('id', eventId)
    .eq('user_id', user.id)
    .single()

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', eventId)
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ guests: data })
}

// POST — manually add a single guest
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { eventId, name, email, phone, plusOne } = body

  if (!eventId || !name?.trim()) {
    return NextResponse.json({ error: 'Missing eventId or name' }, { status: 400 })
  }

  // Verify ownership
  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('id', eventId)
    .eq('user_id', user.id)
    .single()

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('guests')
    .insert({
      event_id: eventId,
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      plus_one: plusOne ?? false,
      rsvp_token: nanoid(12),
      rsvp_status: 'pending',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ guest: data }, { status: 201 })
}

// DELETE — remove a guest
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const guestId = request.nextUrl.searchParams.get('guestId')

  if (!guestId) {
    return NextResponse.json({ error: 'Missing guestId' }, { status: 400 })
  }

  // Verify ownership through the event
  const { data: guest } = await supabase
    .from('guests')
    .select('id, event_id, events(user_id)')
    .eq('id', guestId)
    .single()

  if (!guest) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
  }

  const eventOwner = (guest.events as any)?.user_id
  if (eventOwner !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', guestId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
