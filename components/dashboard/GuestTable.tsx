'use client'
// components/dashboard/GuestTable.tsx
import { useState } from 'react'
import toast from 'react-hot-toast'

type Guest = {
  id: string
  name: string
  email: string | null
  phone: string | null
  rsvp_status: string
  rsvp_token: string
  plus_one: boolean
  plus_one_name: string | null
  dietary: string | null
  responded_at: string | null
}

type Props = {
  guests: Guest[]
  eventSlug: string
  appUrl: string
}

type Filter = 'all' | 'confirmed' | 'declined' | 'pending'

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  confirmed: { bg: '#E8F5E9', color: '#2E7D32', label: 'Confirmed' },
  declined:  { bg: '#FFEBEE', color: '#C62828', label: 'Declined' },
  pending:   { bg: '#FFF8E1', color: '#E65100', label: 'Pending' },
}

export default function GuestTable({ guests, eventSlug, appUrl }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [copied, setCopied] = useState<string | null>(null)

  const filtered = filter === 'all' ? guests : guests.filter(g => g.rsvp_status === filter)

  function getRsvpLink(token: string) {
    return `${appUrl}/event/${eventSlug}/rsvp/${token}`
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(getRsvpLink(token))
    setCopied(token)
    toast.success('Link copied to clipboard')
    setTimeout(() => setCopied(null), 2000)
  }

  function getWhatsappLink(guest: Guest) {
    const link = getRsvpLink(guest.rsvp_token)
    const msg = encodeURIComponent(`Hi ${guest.name}! You're invited. Please RSVP here: ${link}`)
    if (guest.phone) return `https://wa.me/${guest.phone.replace(/\D/g, '')}?text=${msg}`
    return `https://wa.me/?text=${msg}`
  }

  const filterCounts = {
    all: guests.length,
    confirmed: guests.filter(g => g.rsvp_status === 'confirmed').length,
    declined:  guests.filter(g => g.rsvp_status === 'declined').length,
    pending:   guests.filter(g => g.rsvp_status === 'pending').length,
  }

  if (guests.length === 0) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center' }}>
        <div style={{
          width: '48px', height: '48px', background: '#FDF0E6', borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C47A3A" strokeWidth="1.8" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <p style={{ fontWeight: '600', color: '#2D2016', fontSize: '15px', marginBottom: '6px' }}>No guests yet</p>
        <p style={{ color: '#A08060', fontSize: '13px' }}>Import an Excel or CSV file to add guests</p>
      </div>
    )
  }

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid #F5F0E8', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {(['all', 'confirmed', 'declined', 'pending'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '5px 14px',
              borderRadius: '99px',
              fontSize: '12px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              background: filter === f ? '#2D2016' : '#F5F0E8',
              color: filter === f ? 'white' : '#7A6652',
              transition: 'all 0.15s',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} <span style={{ opacity: 0.7 }}>({filterCounts[f]})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #F5F0E8' }}>
              {['Name', 'Contact', 'Status', 'Responded', 'Actions'].map(h => (
                <th key={h} style={{
                  padding: '10px 20px',
                  textAlign: 'left',
                  fontWeight: '500',
                  color: '#A08060',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(guest => {
              const status = statusStyles[guest.rsvp_status] ?? statusStyles.pending
              return (
                <tr key={guest.id} style={{ borderBottom: '1px solid #FAF7F4' }}
                  className="hover:bg-stone-50 transition-colors">
                  <td style={{ padding: '14px 20px' }}>
                    <p style={{ fontWeight: '500', color: '#2D2016' }}>{guest.name}</p>
                    {guest.plus_one_name && (
                      <p style={{ color: '#A08060', fontSize: '12px', marginTop: '2px' }}>
                        +1: {guest.plus_one_name}
                      </p>
                    )}
                    {guest.dietary && (
                      <p style={{ color: '#B0A090', fontSize: '11px', marginTop: '1px' }}>
                        {guest.dietary}
                      </p>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#7A6652' }}>
                    {guest.email && <p>{guest.email}</p>}
                    {guest.phone && <p style={{ fontSize: '12px', color: '#A08060', marginTop: '2px' }}>{guest.phone}</p>}
                    {!guest.email && !guest.phone && <span style={{ color: '#C8A882' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      background: status.bg,
                      color: status.color,
                      padding: '3px 10px',
                      borderRadius: '99px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}>
                      {status.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#B0A090', fontSize: '12px' }}>
                    {guest.responded_at
                      ? new Date(guest.responded_at).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
                      : '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => copyLink(guest.rsvp_token)}
                        style={{
                          background: copied === guest.rsvp_token ? '#E8F5E9' : '#F5F0E8',
                          color: copied === guest.rsvp_token ? '#2E7D32' : '#7A6652',
                          border: 'none',
                          padding: '5px 12px',
                          borderRadius: '99px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.15s',
                        }}
                      >
                        {copied === guest.rsvp_token ? (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                        )}
                        {copied === guest.rsvp_token ? 'Copied' : 'Copy link'}
                      </button>
                      {guest.phone && (
                        <a href={getWhatsappLink(guest)} target="_blank" rel="noopener noreferrer"
                          style={{
                            background: '#E8F5E9',
                            color: '#2E7D32',
                            padding: '5px 12px',
                            borderRadius: '99px',
                            fontSize: '12px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                          className="hover:opacity-80 transition-opacity">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
