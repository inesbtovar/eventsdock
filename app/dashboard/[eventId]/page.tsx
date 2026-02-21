// app/dashboard/[eventId]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import GuestTable from '@/components/dashboard/GuestTable'
import GuestImport from '@/components/dashboard/GuestImport'

type Props = { params: Promise<{ eventId: string }> }

export default async function EventPage({ params }: Props) {
  const { eventId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('user_id', user.id)
    .single()

  if (!event) notFound()

  const { data: guests } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', eventId)
    .order('name')

  const confirmed = guests?.filter(g => g.rsvp_status === 'confirmed').length ?? 0
  const declined  = guests?.filter(g => g.rsvp_status === 'declined').length ?? 0
  const pending   = guests?.filter(g => g.rsvp_status === 'pending').length ?? 0
  const total     = guests?.length ?? 0

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const publicUrl = `${appUrl}/event/${event.slug}`

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="text-stone-400 hover:text-stone-700 text-sm transition-colors">
            ← Dashboard
          </Link>
          <span className="text-stone-300">/</span>
          <h1 className="text-stone-800 font-semibold text-sm">{event.name}</h1>
          <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${
            event.is_published
              ? 'bg-green-100 text-green-700'
              : 'bg-stone-100 text-stone-500'
          }`}>
            {event.is_published ? 'Live' : 'Draft'}
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Guests', value: total,     bg: 'bg-white' },
            { label: 'Confirmed',    value: confirmed,  bg: 'bg-green-50' },
            { label: 'Declined',     value: declined,   bg: 'bg-red-50' },
            { label: 'Pending',      value: pending,    bg: 'bg-yellow-50' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-xl border border-stone-200 p-5`}>
              <p className="text-3xl font-bold text-stone-900">{stat.value}</p>
              <p className="text-sm text-stone-500 mt-1">{stat.label}</p>
              {total > 0 && stat.label !== 'Total Guests' && (
                <p className="text-xs text-stone-400 mt-0.5">
                  {Math.round((stat.value / total) * 100)}%
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-white border border-stone-200 px-4 py-2 rounded-lg hover:border-stone-400 transition-colors"
          >
            🌐 View public site
          </a>
          <Link
            href={`/dashboard/${event.id}/website`}
            className="text-sm bg-white border border-stone-200 px-4 py-2 rounded-lg hover:border-stone-400 transition-colors"
          >
            🎨 Edit template
          </Link>
          <Link
            href={`/dashboard/${event.id}/settings`}
            className="text-sm bg-white border border-stone-200 px-4 py-2 rounded-lg hover:border-stone-400 transition-colors"
          >
            ⚙️ Settings
          </Link>
        </div>

        {/* Guest list */}
        <div className="bg-white rounded-xl border border-stone-200">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-stone-900 text-lg">Guest List</h2>
              <p className="text-stone-400 text-xs mt-0.5">
                Import Excel/CSV or copy individual RSVP links to share via WhatsApp
              </p>
            </div>
            <GuestImport eventId={event.id} />
          </div>
          <GuestTable guests={guests ?? []} eventSlug={event.slug} appUrl={appUrl} />
        </div>

      </main>
    </div>
  )
}
