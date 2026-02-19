// lib/types.ts

export type RsvpStatus = 'pending' | 'confirmed' | 'declined'

export type Template = 'elegant' | 'rustic' | 'modern'

export type TemplateConfig = {
  headline?: string
  subtitle?: string
  coupleNames?: string
  accentColor?: string
}

export type Event = {
  id: string
  user_id: string
  name: string
  slug: string
  date: string | null
  location: string | null
  description: string | null
  template: Template
  template_config: TemplateConfig
  cover_image: string | null
  is_published: boolean
  created_at: string
}

export type Guest = {
  id: string
  event_id: string
  name: string
  email: string | null
  phone: string | null
  rsvp_token: string
  rsvp_status: RsvpStatus
  plus_one: boolean
  plus_one_name: string | null
  dietary: string | null
  notes: string | null
  responded_at: string | null
  created_at: string
}

// Used in dashboard stats
export type GuestStats = {
  total: number
  confirmed: number
  declined: number
  pending: number
}
