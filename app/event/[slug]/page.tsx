// app/event/[slug]/page.tsx
import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TemplateElegant from '@/components/templates/TemplateElegant'
import TemplateRustic from '@/components/templates/TemplateRustic'
import TemplateModern from '@/components/templates/TemplateModern'

type Props = { params: Promise<{ slug: string }> }

export default async function PublicEventPage({ params }: Props) {
  const { slug } = await params
  const admin = createAdminClient()

  const { data: event } = await admin
    .from('events')
    .select('*')
    .eq('slug', slug)
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

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const admin = createAdminClient()

  const { data: event } = await admin
    .from('events')
    .select('name, description')
    .eq('slug', slug)
    .single()

  return {
    title: event?.name ?? 'Event Invitation',
    description: event?.description ?? 'You are invited!',
  }
}
