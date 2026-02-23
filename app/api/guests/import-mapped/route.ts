// app/api/guests/import-mapped/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { eventId, guests: rawGuests } = body

    if (!eventId || !rawGuests?.length) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // Verify ownership
    const { data: event } = await supabase
      .from('events').select('id').eq('id', eventId).eq('user_id', user.id).single()
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    const guests = rawGuests
      .filter((g: any) => g.name?.trim())
      .map((g: any) => ({
        event_id: eventId,
        name: g.name.trim(),
        email: g.email?.trim() || null,
        phone: g.phone?.trim() || null,
        dietary: g.dietary?.trim() || null,
        plus_one: g.plusOne ?? false,
        rsvp_token: nanoid(12),
        rsvp_status: 'pending',
      }))

    if (guests.length === 0) {
      return NextResponse.json({ error: 'No valid guests to import' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('guests').insert(guests).select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, imported: data.length })

  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 })
  }
}