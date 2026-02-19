'use client'
// app/dashboard/[eventId]/settings/page.tsx
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { eventId } = useParams()
  const router = useRouter()
  const supabase = createClient()

  const [event, setEvent] = useState<any>(null)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()
      .then(({ data }) => {
        if (data) {
          setEvent(data)
          setName(data.name || '')
          setDate(data.date ? data.date.slice(0, 16) : '')
          setLocation(data.location || '')
          setDescription(data.description || '')
        }
      })
  }, [eventId])

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('events')
      .update({ name, date: date || null, location: location || null, description: description || null })
      .eq('id', eventId)

    if (error) toast.error(error.message)
    else toast.success('Settings saved!')
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    const { error } = await supabase.from('events').delete().eq('id', eventId)
    if (error) { toast.error(error.message); setDeleting(false); return }
    toast.success('Event deleted')
    router.push('/dashboard')
  }

  async function handleTogglePublish() {
    const newState = !event.is_published
    const { error } = await supabase
      .from('events')
      .update({ is_published: newState })
      .eq('id', eventId)
    if (error) toast.error(error.message)
    else {
      setEvent({ ...event, is_published: newState })
      toast.success(newState ? 'Event published!' : 'Event unpublished')
    }
  }

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center text-stone-400">Loading...</div>
  )

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href={`/dashboard/${eventId}`} className="text-stone-400 hover:text-stone-700 text-sm">
            ← Back
          </Link>
          <span className="text-stone-800 font-semibold">Event Settings</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">

        {/* Event details */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-900 mb-5">Event Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Event name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Date & time</label>
              <input
                type="datetime-local"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Location</label>
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Venue name or address"
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Description / message</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="A message for your guests..."
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-stone-500 resize-none"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-stone-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-stone-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Publish toggle */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-stone-900">Event status</h2>
              <p className="text-sm text-stone-500 mt-1">
                {event.is_published
                  ? 'Your event is live and guests can view it.'
                  : 'Your event is a draft. Only you can see it.'}
              </p>
            </div>
            <button
              onClick={handleTogglePublish}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                event.is_published
                  ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {event.is_published ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-xl border border-red-100 p-6">
          <h2 className="font-semibold text-red-700 mb-1">Danger zone</h2>
          <p className="text-sm text-stone-500 mb-4">
            Deleting this event will remove all guests and data permanently. This cannot be undone.
          </p>
          {confirmDelete && (
            <p className="text-sm text-red-600 font-medium mb-3">
              ⚠️ Are you sure? Click again to confirm deletion.
            </p>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : confirmDelete ? 'Yes, delete forever' : 'Delete event'}
          </button>
          {confirmDelete && (
            <button
              onClick={() => setConfirmDelete(false)}
              className="ml-3 text-sm text-stone-400 hover:text-stone-600"
            >
              Cancel
            </button>
          )}
        </div>

      </main>
    </div>
  )
}
