'use client'
// app/dashboard/new/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 60)
    + '-' + Date.now().toString().slice(-4)
}

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const name = form.get('name') as string
    const date = form.get('date') as string
    const location = form.get('location') as string
    const description = form.get('description') as string

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) { router.push('/login'); return }

    const { data, error } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        name,
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

    if (error) { setError(error.message); setLoading(false); return }

    router.push(`/dashboard/${data.id}`)
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 w-full max-w-lg shadow-sm">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Create new event</h1>
        <p className="text-stone-500 text-sm mb-8">Fill in the details to get started</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Event name *
            </label>
            <input
              name="name"
              required
              placeholder="Ana & João's Wedding"
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Date
            </label>
            <input
              name="date"
              type="datetime-local"
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-stone-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Location
            </label>
            <input
              name="location"
              placeholder="Quinta da Serra, Sintra"
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-stone-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Description / Message
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Join us to celebrate..."
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-stone-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border border-stone-200 text-stone-600 py-3 rounded-lg text-sm font-medium hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-stone-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-stone-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create event →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
