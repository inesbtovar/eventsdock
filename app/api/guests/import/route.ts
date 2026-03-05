// app/api/guests/import/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import ExcelJS from 'exceljs'
import { nanoid } from 'nanoid'
import { canAddGuest } from '@/lib/plans'

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

  // Check guest limit
  const { allowed, reason } = await canAddGuest(eventId)
  if (!allowed) {
    return NextResponse.json({ error: reason, upgrade: true }, { status: 403 })
  }

  // Parse Excel/CSV with ExcelJS
  let rows: Record<string, unknown>[] = []
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = new ExcelJS.Workbook()

    const fileName = file.name.toLowerCase()
    if (fileName.endsWith('.csv')) {
      const { Readable } = await import('stream')
      const stream = Readable.from(buffer.toString('utf-8').split('\n').join('\n'))
      await workbook.csv.read(stream)
    } else {
      await workbook.xlsx.load(buffer)
    }

    const sheet = workbook.worksheets[0]
    if (!sheet) throw new Error('No worksheet found')

    const headers: string[] = []
    sheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colIndex) => {
      headers[colIndex - 1] = cell.value?.toString().trim() ?? ''
    })

    sheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return
      const obj: Record<string, unknown> = {}
      row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
        const header = headers[colIndex - 1]
        if (header) {
          const val = cell.value
          if (val === null || val === undefined) {
            obj[header] = ''
          } else if (typeof val === 'object' && 'text' in val) {
            obj[header] = (val as any).text
          } else if (typeof val === 'object' && 'result' in val) {
            obj[header] = (val as any).result
          } else {
            obj[header] = val
          }
        }
      })
      if (Object.values(obj).some(v => v !== '' && v != null)) {
        rows.push(obj)
      }
    })
  } catch {
    return NextResponse.json(
      { error: 'Could not parse file. Please upload a valid .xlsx, .xls or .csv file.' },
      { status: 400 }
    )
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: 'The file appears to be empty.' }, { status: 400 })
  }

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