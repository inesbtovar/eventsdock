// app/api/guests/import/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import * as XLSX from 'xlsx'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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

  // Verify ownership
  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('id', eventId)
    .eq('user_id', user.id)
    .single()

  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  // Parse Excel/CSV
  let rows: Record<string, unknown>[]
  try {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    rows = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[]
  } catch {
    return NextResponse.json({ error: 'Could not parse file. Please upload a valid .xlsx, .xls or .csv file.' }, { status: 400 })
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: 'The file appears to be empty.' }, { status: 400 })
  }

  // Smart column detection — tries many possible header names
  // Works with messy Excel files that have lots of other columns
  function detect(row: Record<string, unknown>, candidates: string[]): string {
    const keys = Object.keys(row)
    for (const candidate of candidates) {
      const match = keys.find(k =>
        k.toLowerCase().trim().replace(/[\s_\-\.]/g, '') ===
        candidate.toLowerCase().replace(/[\s_\-\.]/g, '')
      )
      if (match && row[match] != null && String(row[match]).trim() !== '') {
        return String(row[match]).trim()
      }
    }
    return ''
  }

  const NAME_KEYS  = ['name', 'nome', 'guest', 'convidado', 'guestname', 'fullname', 'nomecompleto', 'pessoa', 'person', 'invitado']
  const EMAIL_KEYS = ['email', 'e-mail', 'email address', 'emailaddress', 'correo', 'correio', 'mail']
  const PHONE_KEYS = ['phone', 'telefone', 'tel', 'mobile', 'telemóvel', 'telemovel', 'celular', 'phonenumber', 'contacto', 'contact']

  const guests = rows
    .map(row => {
      const name  = detect(row, NAME_KEYS)
      const email = detect(row, EMAIL_KEYS)
      const phone = detect(row, PHONE_KEYS)
      if (!name) return null
      return {
        event_id: eventId,
        name,
        email: email || null,
        phone: phone || null,
        rsvp_token: nanoid(12),
        rsvp_status: 'pending',
        plus_one: false,
      }
    })
    .filter(Boolean)

  if (guests.length === 0) {
    return NextResponse.json({
      error: 'No guests found. Make sure your file has a column named "Name" or "Nome".',
    }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('guests')
    .insert(guests)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    imported: data.length,
    skipped: rows.length - data.length,
  })
}
