// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

// GET — list all events for the logged-in user
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('events')
    .select('*, guests(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ events: data })
}

// POST — create a new event
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, date, location, description } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Event name is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('events')
    .insert({
      user_id: user.id,
      name: name.trim(),
      slug: slugify(name),
      date: date || null,
      location: location || null,
      description: description || null,
      template: 'elegant',
      template_config: {},
      is_published: false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ event: data }, { status: 201 })
}

// PATCH — update event details
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, ...updates } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing event id' }, { status: 400 })
  }

  // Only allow safe fields to be updated
  const allowed = ['name', 'date', 'location', 'description', 'template', 'template_config', 'is_published', 'cover_image']
  const sanitized = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowed.includes(key))
  )

  const { data, error } = await supabase
    .from('events')
    .update(sanitized)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ event: data })
}

// DELETE — delete an event and all its guests (cascade in DB)
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = request.nextUrl.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing event id' }, { status: 400 })
  }

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
