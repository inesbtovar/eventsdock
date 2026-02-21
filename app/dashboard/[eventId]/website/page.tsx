'use client'
// app/dashboard/[eventId]/website/page.tsx
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

const TEMPLATES = [
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'White & gold, timeless serif',
    preview: '🤍',
  },
  {
    id: 'rustic',
    name: 'Rustic',
    description: 'Warm earthy tones, vintage feel',
    preview: '🌿',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Bold, black & white, graphic',
    preview: '◼',
  },
]

export default function WebsitePage() {
  // useParams() is correct for client components — no async needed
  const params = useParams()
  const eventId = params.eventId as string

  const supabase = createClient()

  const [event, setEvent]       = useState<any>(null)
  const [template, setTemplate] = useState('elegant')
  const [config, setConfig]     = useState<any>({})
  const [saving, setSaving]     = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (!eventId) return
    supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()
      .then(({ data }) => {
        if (data) {
          setEvent(data)
          setTemplate(data.template || 'elegant')
          setConfig(data.template_config || {})
        }
      })
  }, [eventId])

  async function save() {
    setSaving(true)
    const { error } = await supabase
      .from('events')
      .update({ template, template_config: config })
      .eq('id', eventId)

    if (error) toast.error(error.message)
    else toast.success('Saved!')
    setSaving(false)
  }

  async function togglePublish() {
    setPublishing(true)
    const newState = !event.is_published
    const { error } = await supabase
      .from('events')
      .update({ is_published: newState, template, template_config: config })
      .eq('id', eventId)

    if (error) toast.error(error.message)
    else {
      setEvent({ ...event, is_published: newState })
      toast.success(newState ? 'Event published! 🎉' : 'Event unpublished')
    }
    setPublishing(false)
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
      </div>
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const publicUrl = `${appUrl}/event/${event.slug}`

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link
            href={`/dashboard/${eventId}`}
            className="text-stone-400 hover:text-stone-700 text-sm transition-colors"
          >
            ← Back
          </Link>
          <span className="text-stone-800 font-semibold text-sm">Edit Website</span>
          <div className="ml-auto flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="text-sm border border-stone-200 px-4 py-2 rounded-lg hover:bg-stone-50 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={togglePublish}
              disabled={publishing}
              className={`text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors ${
                event.is_published
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {publishing ? '...' : event.is_published ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8 grid sm:grid-cols-5 gap-8">

        {/* Left: controls */}
        <div className="sm:col-span-2 space-y-6">

          {/* Template picker */}
          <div>
            <h2 className="font-semibold text-stone-900 mb-3">Template</h2>
            <div className="space-y-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    template === t.id
                      ? 'border-stone-900 bg-white shadow-sm'
                      : 'border-stone-200 bg-white hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{t.preview}</span>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">{t.name}</p>
                      <p className="text-xs text-stone-500">{t.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Customization */}
          <div>
            <h2 className="font-semibold text-stone-900 mb-3">Customize</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-stone-500 mb-1">Main headline</label>
                <input
                  value={config.headline || ''}
                  onChange={e => setConfig({ ...config, headline: e.target.value })}
                  placeholder={event.name}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-500"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Couple / Host names</label>
                <input
                  value={config.coupleNames || ''}
                  onChange={e => setConfig({ ...config, coupleNames: e.target.value })}
                  placeholder="Ana & João"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-500"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Subtitle</label>
                <input
                  value={config.subtitle || ''}
                  onChange={e => setConfig({ ...config, subtitle: e.target.value })}
                  placeholder="We'd love for you to join us"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-500"
                />
              </div>
            </div>
          </div>

          {/* Published link */}
          {event.is_published && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs text-green-700 font-medium mb-1">✅ Live at:</p>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600 underline break-all"
              >
                {publicUrl}
              </a>
            </div>
          )}
        </div>

        {/* Right: preview */}
        <div className="sm:col-span-3">
          <h2 className="font-semibold text-stone-900 mb-3">Preview</h2>
          <div
            className="relative rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100"
            style={{ height: 520 }}
          >
            {event.is_published ? (
              <iframe
                src={publicUrl}
                className="w-full h-full"
                title="Event preview"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-6">
                  <p className="text-4xl mb-3">👁</p>
                  <p className="text-stone-600 font-medium text-sm">Publish to see preview</p>
                  <p className="text-stone-400 text-xs mt-1">
                    Save your changes then click Publish
                  </p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-stone-400 mt-2 text-center">
            Save then publish to see your live site
          </p>
        </div>

      </main>
    </div>
  )
}
