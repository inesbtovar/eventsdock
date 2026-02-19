// app/api/guests/import/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import * as XLSX from 'xlsx'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const eventId = formData.get('eventId') as string | null

  if (!file || !eventId) {
    return NextResponse.json({ error: 'Missing file or eventId' }, { status: 400 })
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

  // Parse the file
  let rows: Record<string, unknown>[]
  try {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    rows = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[]
  } catch {
    return NextResponse.json({ error: 'Could not parse file. Make sure it is a valid .xlsx or .csv' }, { status: 400 })
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: 'The file is empty' }, { status: 400 })
  }

  // Normalize column names — accepts English and Portuguese headers
  function getField(row: Record<string, unknown>, keys: string[]): string {
    for (const key of keys) {
      const found = Object.keys(row).find(k => k.toLowerCase().trim() === key.toLowerCase())
      if (found && row[found]) return String(row[found]).trim()
    }
    return ''
  }

  const guests = rows
    .map(row => {
      const name  = getField(row, ['name', 'nome', 'guest', 'convidado'])
      const email = getField(row, ['email', 'e-mail', 'correo'])
      const phone = getField(row, ['phone', 'telefone', 'tel', 'mobile', 'telemóvel', 'telemovel'])

      if (!name) return null

      return {
        event_id: eventId,
        name,
        email: email || null,
        phone: phone || null,
        rsvp_token: nanoid(12),
        rsvp_status: 'pending',
      }
    })
    .filter(Boolean)

  if (guests.length === 0) {
    return NextResponse.json({
      error: 'No valid guests found. Make sure your file has a "Name" or "Nome" column.',
    }, { status: 400 })
  }

  // Use admin client to bypass RLS for bulk insert
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('guests')
    .insert(guests)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    imported: data.length,
    skipped: rows.length - data.length,
  })
}
