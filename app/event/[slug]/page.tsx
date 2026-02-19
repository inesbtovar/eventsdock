// app/event/[slug]/page.tsx
// This is the public event website guests see
import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TemplateElegant from '@/components/templates/TemplateElegant'
import TemplateRustic from '@/components/templates/TemplateRustic'
import TemplateModern from '@/components/templates/TemplateModern'

export default async function PublicEventPage({ params }: { params: { slug: string } }) {
  const admin = createAdminClient()

  const { data: event } = await admin
    .from('events')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!event) notFound()

  const templates: Record<string, React.ComponentType<any>> = {
    elegant: TemplateElegant,
    rustic: TemplateRustic,
    modern: TemplateModern,
  }

  const Template = templates[event.template] ?? TemplateElegant

  return <Template event={event} />
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const admin = createAdminClient()
  const { data: event } = await admin
    .from('events')
    .select('name, description')
    .eq('slug', params.slug)
    .single()

  return {
    title: event?.name ?? 'Event Invitation',
    description: event?.description ?? 'You are invited!',
  }
}
