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
  responded_at: string | null
}

type Props = {
  guests: Guest[]
  eventSlug: string
  appUrl: string
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
}

export default function GuestTable({ guests, eventSlug, appUrl }: Props) {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'declined' | 'pending'>('all')

  const filtered = filter === 'all' ? guests : guests.filter(g => g.rsvp_status === filter)

  function copyLink(token: string) {
    const link = `${appUrl}/event/${eventSlug}/rsvp/${token}`
    navigator.clipboard.writeText(link)
    toast.success('Link copied!')
  }

  function whatsappLink(guest: Guest) {
    const link = `${appUrl}/event/${eventSlug}/rsvp/${guest.rsvp_token}`
    const msg = encodeURIComponent(`Hi ${guest.name}! You're invited 🎉 RSVP here: ${link}`)
    return `https://wa.me/${guest.phone?.replace(/\D/g, '')}?text=${msg}`
  }

  if (guests.length === 0) {
    return (
      <div className="p-12 text-center text-stone-400">
        <p className="text-4xl mb-3">📋</p>
        <p className="font-medium text-stone-600">No guests yet</p>
        <p className="text-sm mt-1">Import an Excel/CSV file to add guests</p>
      </div>
    )
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="px-6 py-3 border-b border-stone-100 flex gap-2">
        {(['all', 'confirmed', 'declined', 'pending'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full capitalize font-medium transition-colors ${
              filter === f
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left">
              <th className="px-6 py-3 font-medium text-stone-500">Name</th>
              <th className="px-6 py-3 font-medium text-stone-500">Contact</th>
              <th className="px-6 py-3 font-medium text-stone-500">Status</th>
              <th className="px-6 py-3 font-medium text-stone-500">Responded</th>
              <th className="px-6 py-3 font-medium text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(guest => (
              <tr key={guest.id} className="border-b border-stone-50 hover:bg-stone-50">
                <td className="px-6 py-3">
                  <p className="font-medium text-stone-900">{guest.name}</p>
                  {guest.plus_one_name && (
                    <p className="text-xs text-stone-400">+1: {guest.plus_one_name}</p>
                  )}
                </td>
                <td className="px-6 py-3 text-stone-500">
                  <p>{guest.email || '—'}</p>
                  <p className="text-xs">{guest.phone || ''}</p>
                </td>
                <td className="px-6 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[guest.rsvp_status]}`}>
                    {guest.rsvp_status}
                  </span>
                </td>
                <td className="px-6 py-3 text-stone-400 text-xs">
                  {guest.responded_at
                    ? new Date(guest.responded_at).toLocaleDateString('pt-PT')
                    : '—'}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyLink(guest.rsvp_token)}
                      className="text-xs text-stone-500 hover:text-stone-900 underline"
                    >
                      Copy link
                    </button>
                    {guest.phone && (
                      <a
                        href={whatsappLink(guest)}
                        target="_blank"
                        className="text-xs text-green-600 hover:text-green-800 underline"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
