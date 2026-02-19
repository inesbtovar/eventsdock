// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: events } = await supabase
    .from('events')
    .select('*, guests(count)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-800">EventFlow</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-stone-500">{user.email}</span>
          <form action="/api/auth/signout" method="POST">
            <button className="text-sm text-stone-500 hover:text-stone-800">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">My Events</h2>
            <p className="text-stone-500 mt-1">Manage your events and guest lists</p>
          </div>
          <Link
            href="/dashboard/new"
            className="bg-stone-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors"
          >
            + New Event
          </Link>
        </div>

        {events && events.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((event) => {
              const guestCount = (event.guests as any)?.[0]?.count ?? 0
              return (
                <Link
                  key={event.id}
                  href={`/dashboard/${event.id}`}
                  className="bg-white rounded-xl border border-stone-200 p-6 hover:border-stone-400 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-stone-900 text-lg">{event.name}</h3>
                      {event.date && (
                        <p className="text-stone-500 text-sm mt-1">
                          {new Date(event.date).toLocaleDateString('pt-PT', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      )}
                      {event.location && (
                        <p className="text-stone-400 text-sm">{event.location}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      event.is_published 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-stone-100 text-stone-500'
                    }`}>
                      {event.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-4 text-sm text-stone-500">
                    <span>{guestCount} guests</span>
                    <span>Template: {event.template}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-stone-400">
            <p className="text-5xl mb-4">🎉</p>
            <p className="text-lg font-medium text-stone-600">No events yet</p>
            <p className="text-sm mt-1">Create your first event to get started</p>
          </div>
        )}
      </main>
    </div>
  )
}
