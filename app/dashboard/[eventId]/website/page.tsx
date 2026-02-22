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
    color: '#B8860B',
    bg: '#FAF9F7',
  },
  {
    id: 'rustic',
    name: 'Rustic',
    description: 'Warm earthy tones, vintage feel',
    color: '#78564E',
    bg: '#F5F0E8',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Bold, black & white, graphic',
    color: '#111111',
    bg: '#F0F0F0',
  },
]

export default function WebsitePage() {
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
    supabase.from('events').select('*').eq('id', eventId).single()
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
    else toast.success('Changes saved')
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
      toast.success(newState ? 'Event is now live!' : 'Event unpublished')
    }
    setPublishing(false)
  }

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFAF6' }}>
      <div style={{ width: '24px', height: '24px', border: '2px solid #EDE8E0', borderTopColor: '#C47A3A', borderRadius: '99px' }}
        className="animate-spin" />
    </div>
  )

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const publicUrl = `${appUrl}/event/${event.slug}`

  return (
    <div className="min-h-screen" style={{ background: '#FDFAF6', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #EDE8E0' }} className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href={`/dashboard/${eventId}`} style={{ color: '#A08060', fontSize: '14px' }}
            className="hover:opacity-70 transition-opacity flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D0C4B4" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span style={{ color: '#2D2016', fontWeight: '600', fontSize: '14px' }}>Edit Website</span>
          <div className="ml-auto flex gap-2">
            <button onClick={save} disabled={saving}
              style={{ border: '1px solid #EDE8E0', background: 'white', color: '#7A6652', padding: '8px 18px', borderRadius: '99px', fontSize: '13px', cursor: 'pointer' }}
              className="hover:border-stone-400 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={togglePublish} disabled={publishing}
              style={{
                background: event.is_published ? '#FFEBEE' : '#2D2016',
                color: event.is_published ? '#C62828' : 'white',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '99px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
              className="hover:opacity-80 transition-opacity disabled:opacity-50">
              {publishing ? '...' : event.is_published ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8 grid sm:grid-cols-5 gap-8">

        {/* Left controls */}
        <div className="sm:col-span-2 space-y-5">

          {/* Template picker */}
          <div style={{ background: 'white', border: '1px solid #EDE8E0', borderRadius: '20px', padding: '20px' }}>
            <h2 style={{ fontWeight: '600', color: '#2D2016', fontSize: '14px', marginBottom: '14px' }}>Template</h2>
            <div className="space-y-2">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setTemplate(t.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '14px',
                    borderRadius: '14px',
                    border: template === t.id ? `2px solid ${t.color}` : '2px solid transparent',
                    background: template === t.id ? t.bg : '#FDFAF6',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: t.color, flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ fontWeight: '600', color: '#2D2016', fontSize: '13px', marginBottom: '2px' }}>{t.name}</p>
                    <p style={{ color: '#A08060', fontSize: '12px' }}>{t.description}</p>
                  </div>
                  {template === t.id && (
                    <div className="ml-auto">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Customization */}
          <div style={{ background: 'white', border: '1px solid #EDE8E0', borderRadius: '20px', padding: '20px' }}>
            <h2 style={{ fontWeight: '600', color: '#2D2016', fontSize: '14px', marginBottom: '14px' }}>Customize</h2>
            <div className="space-y-3">
              {[
                { key: 'headline', label: 'Headline', placeholder: event.name },
                { key: 'coupleNames', label: 'Names', placeholder: 'Ana & João' },
                { key: 'subtitle', label: 'Subtitle', placeholder: "We'd love for you to join us" },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#A08060', marginBottom: '5px' }}>
                    {field.label}
                  </label>
                  <input
                    value={config[field.key] || ''}
                    onChange={e => setConfig({ ...config, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%',
                      border: '1px solid #EDE8E0',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: '#2D2016',
                      background: '#FDFAF6',
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = '#C47A3A'}
                    onBlur={e => e.target.style.borderColor = '#EDE8E0'}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Published link */}
          {event.is_published && (
            <div style={{ background: '#F0FAF0', border: '1px solid #C8E6C9', borderRadius: '14px', padding: '14px' }}>
              <p style={{ fontSize: '12px', color: '#2E7D32', fontWeight: '600', marginBottom: '4px' }}>
                Live at:
              </p>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '12px', color: '#388E3C', wordBreak: 'break-all', textDecoration: 'underline' }}>
                {publicUrl}
              </a>
            </div>
          )}
        </div>

        {/* Right preview */}
        <div className="sm:col-span-3">
          <h2 style={{ fontWeight: '600', color: '#2D2016', fontSize: '14px', marginBottom: '12px' }}>Preview</h2>
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #EDE8E0',
            background: '#F5F0E8',
            height: '520px',
            position: 'relative',
          }}>
            {event.is_published ? (
              <iframe src={publicUrl} className="w-full h-full" title="Preview" />
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '24px',
              }}>
                <div style={{
                  width: '48px', height: '48px', background: 'white',
                  borderRadius: '14px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '14px',
                  border: '1px solid #EDE8E0',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C47A3A" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <p style={{ fontWeight: '600', color: '#2D2016', fontSize: '14px', marginBottom: '6px' }}>
                  Publish to see preview
                </p>
                <p style={{ color: '#A08060', fontSize: '12px' }}>
                  Save your changes then click Publish
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
