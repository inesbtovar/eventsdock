// components/templates/TemplateModern.tsx
type Event = {
  name: string
  date: string
  location: string
  description: string
  cover_image: string | null
  template_config: any
  slug: string
}

export default function TemplateModern({ event }: { event: Event }) {
  const config = event.template_config || {}
  const eventDate = event.date
    ? new Date(event.date).toLocaleDateString('pt-PT', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : null

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Arial Black', sans-serif" }}>
      {/* Bold header */}
      <div className="bg-black text-white px-6 sm:px-16 py-20 sm:py-32">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-stone-400 tracking-widest uppercase mb-6">
            You are invited
          </p>
          <h1 className="text-6xl sm:text-9xl font-black leading-none uppercase">
            {event.name}
          </h1>
          <div className="mt-8 flex flex-wrap gap-6 text-stone-400">
            {eventDate && <span>{eventDate}</span>}
            {event.location && <span>/ {event.location}</span>}
          </div>
        </div>
      </div>

      {/* Cover image if exists */}
      {event.cover_image && (
        <div className="h-64 sm:h-96 overflow-hidden">
          <img
            src={event.cover_image}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 sm:px-16 py-16">
        {event.description && (
          <p className="text-2xl font-light text-stone-700 leading-relaxed max-w-2xl">
            {event.description}
          </p>
        )}

        <div className="mt-12 grid sm:grid-cols-3 gap-8 border-t border-stone-200 pt-12">
          {eventDate && (
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">When</p>
              <p className="text-lg font-bold">{eventDate}</p>
            </div>
          )}
          {event.location && (
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Where</p>
              <p className="text-lg font-bold">{event.location}</p>
            </div>
          )}
          {config.coupleNames && (
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Hosted by</p>
              <p className="text-lg font-bold">{config.coupleNames}</p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-stone-100 py-6 px-16 flex justify-between items-center text-xs text-stone-400">
        <span>EventFlow</span>
        <span>{event.name}</span>
      </div>
    </div>
  )
}
