'use client'
// components/dashboard/GuestImport.tsx
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'

type Props = { eventId: string }

type Mode = 'idle' | 'add' | 'importing'

export default function GuestImport({ eventId }: Props) {
  const [mode, setMode] = useState<Mode>('idle')
  const [importing, setImporting] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Add guest form state
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [phone, setPhone]       = useState('')
  const [dietary, setDietary]   = useState('')
  const [plusOne, setPlusOne]   = useState(false)

  function reset() {
    setName(''); setEmail(''); setPhone(''); setDietary(''); setPlusOne(false)
    setMode('idle')
  }

  // --- Excel/CSV import ---
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setMode('importing')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('eventId', eventId)

    try {
      const res = await fetch('/api/guests/import', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      toast.success(`${data.imported} guests imported!${data.skipped > 0 ? ` (${data.skipped} rows skipped)` : ''}`)
      window.location.reload()
    } catch (err: any) {
      toast.error(err.message || 'Import failed')
      setMode('idle')
    } finally {
      setImporting(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // --- Manual add ---
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast.error('Name is required'); return }
    setSaving(true)

    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, name, email, phone, dietary, plusOne }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      toast.success(`${name} added!`)
      reset()
      window.location.reload()
    } catch (err: any) {
      toast.error(err.message || 'Failed to add guest')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Buttons */}
      {mode === 'idle' && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Add manually */}
          <button
            onClick={() => setMode('add')}
            style={{
              background: '#2D2016',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '99px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            className="hover:opacity-80 transition-opacity"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add guest
          </button>

          {/* Import Excel */}
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFile}
            className="hidden"
            id="guest-file-input"
          />
          <label
            htmlFor="guest-file-input"
            style={{
              border: '1px solid #EDE8E0',
              background: 'white',
              color: '#7A6652',
              padding: '8px 16px',
              borderRadius: '99px',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            className="hover:border-stone-400 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import Excel
          </label>
        </div>
      )}

      {/* Importing spinner */}
      {mode === 'importing' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A08060', fontSize: '13px' }}>
          <div style={{ width: '16px', height: '16px', border: '2px solid #EDE8E0', borderTopColor: '#C47A3A', borderRadius: '99px' }}
            className="animate-spin" />
          Importing...
        </div>
      )}

      {/* Add guest modal */}
      {mode === 'add' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
        }}
          onClick={(e) => { if (e.target === e.currentTarget) reset() }}
        >
          <div style={{
            background: 'white',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '440px',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #F5F0E8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{ fontWeight: '600', color: '#2D2016', fontSize: '16px', margin: 0 }}>
                Add guest
              </h3>
              <button onClick={reset} style={{
                background: '#F5F0E8', border: 'none', borderRadius: '99px',
                width: '28px', height: '28px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#7A6652',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAdd} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#7A6652', marginBottom: '5px' }}>
                    Full name <span style={{ color: '#C47A3A' }}>*</span>
                  </label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Maria Silva"
                    required
                    autoFocus
                    style={{
                      width: '100%',
                      border: '1px solid #EDE8E0',
                      borderRadius: '10px',
                      padding: '9px 12px',
                      fontSize: '14px',
                      color: '#2D2016',
                      background: '#FDFAF6',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = '#C47A3A'}
                    onBlur={e => e.target.style.borderColor = '#EDE8E0'}
                  />
                </div>

                {/* Email + Phone side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#7A6652', marginBottom: '5px' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="maria@email.com"
                      style={{
                        width: '100%',
                        border: '1px solid #EDE8E0',
                        borderRadius: '10px',
                        padding: '9px 12px',
                        fontSize: '14px',
                        color: '#2D2016',
                        background: '#FDFAF6',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = '#C47A3A'}
                      onBlur={e => e.target.style.borderColor = '#EDE8E0'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#7A6652', marginBottom: '5px' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="912 345 678"
                      style={{
                        width: '100%',
                        border: '1px solid #EDE8E0',
                        borderRadius: '10px',
                        padding: '9px 12px',
                        fontSize: '14px',
                        color: '#2D2016',
                        background: '#FDFAF6',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = '#C47A3A'}
                      onBlur={e => e.target.style.borderColor = '#EDE8E0'}
                    />
                  </div>
                </div>

                {/* Dietary */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#7A6652', marginBottom: '5px' }}>
                    Dietary restrictions
                  </label>
                  <input
                    value={dietary}
                    onChange={e => setDietary(e.target.value)}
                    placeholder="e.g. vegetarian, gluten-free..."
                    style={{
                      width: '100%',
                      border: '1px solid #EDE8E0',
                      borderRadius: '10px',
                      padding: '9px 12px',
                      fontSize: '14px',
                      color: '#2D2016',
                      background: '#FDFAF6',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = '#C47A3A'}
                    onBlur={e => e.target.style.borderColor = '#EDE8E0'}
                  />
                </div>

                {/* Plus one toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FDFAF6',
                  border: '1px solid #EDE8E0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#2D2016' }}>Plus one</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#A08060' }}>Guest may bring a companion</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlusOne(!plusOne)}
                    style={{
                      width: '40px',
                      height: '22px',
                      borderRadius: '99px',
                      border: 'none',
                      background: plusOne ? '#2D2016' : '#D0C4B4',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: plusOne ? '20px' : '2px',
                      width: '18px',
                      height: '18px',
                      background: 'white',
                      borderRadius: '99px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                </div>

              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={reset}
                  style={{
                    flex: 1,
                    background: '#F5F0E8',
                    color: '#7A6652',
                    border: 'none',
                    padding: '11px',
                    borderRadius: '99px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 2,
                    background: '#2D2016',
                    color: 'white',
                    border: 'none',
                    padding: '11px',
                    borderRadius: '99px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                  className="hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
