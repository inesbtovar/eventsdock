// lib/utils.ts

// Converts "Ana & João's Wedding" → "ana-joaos-wedding-3921"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // remove accents: ã→a, é→e
    .replace(/[^a-z0-9\s-]/g, '')       // remove special chars
    .trim()
    .replace(/\s+/g, '-')               // spaces → hyphens
    .replace(/-+/g, '-')                // collapse multiple hyphens
    .substring(0, 55)
    + '-' + Date.now().toString().slice(-4) // add suffix for uniqueness
}

// Format a date string for display
export function formatDate(
  dateString: string | null,
  locale = 'pt-PT',
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString(locale, options)
}

// Format date + time
export function formatDateTime(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Calculate guest stats from a list
export function getGuestStats(guests: { rsvp_status: string }[]) {
  return {
    total: guests.length,
    confirmed: guests.filter(g => g.rsvp_status === 'confirmed').length,
    declined: guests.filter(g => g.rsvp_status === 'declined').length,
    pending: guests.filter(g => g.rsvp_status === 'pending').length,
  }
}

// Build the RSVP link for a guest
export function getRsvpLink(appUrl: string, eventSlug: string, token: string): string {
  return `${appUrl}/event/${eventSlug}/rsvp/${token}`
}

// Build WhatsApp share link
export function getWhatsappLink(guestName: string, rsvpLink: string, phone?: string | null): string {
  const msg = encodeURIComponent(
    `Hi ${guestName}! You're invited 🎉 Confirm your attendance here: ${rsvpLink}`
  )
  if (phone) {
    const cleanPhone = phone.replace(/\D/g, '')
    return `https://wa.me/${cleanPhone}?text=${msg}`
  }
  return `https://wa.me/?text=${msg}`
}

// Status color classes
export function statusColor(status: string): string {
  const map: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
  }
  return map[status] ?? 'bg-stone-100 text-stone-500'
}
