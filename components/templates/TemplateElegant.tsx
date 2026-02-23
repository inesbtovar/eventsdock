// components/templates/TemplateElegant.tsx
type Event = {
  name: string
  date: string
  location: string
  description: string
  cover_image: string | null
  template_config: {
    headline?: string
    subtitle?: string
    accentColor?: string
    coupleNames?: string
  }
  slug: string
}

export default function TemplateElegant({ event }: { event: Event }) {
  const config = event.template_config || {}
  const accent = config.accentColor || '#b8860b'
  const eventDate = event.date
    ? new Date(event.date).toLocaleDateString('pt-PT', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })
    : null

  return (
    <div className="min-h-screen bg-[#faf9f7] font-serif">
      {/* Hero */}
      <div
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20"
        style={{
          backgroundImage: event.cover_image
            ? `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${event.cover_image})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: event.cover_image ? undefined : '#1c1917',
        }}
      >
        <div className="max-w-2xl mx-auto">
          {config.coupleNames && (
            <p className="text-stone-300 text-sm uppercase tracking-[0.3em] mb-6">
              {config.coupleNames}
            </p>
          )}
          <h1
            className="text-5xl sm:text-7xl font-light text-white leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {config.headline || event.name}
          </h1>
          <div
            className="w-24 h-px mx-auto my-8"
            style={{ backgroundColor: accent }}
          />
          {config.subtitle && (
            <p className="text-stone-200 text-lg font-light">{config.subtitle}</p>
          )}
          {eventDate && (
            <p className="text-stone-300 mt-4">{eventDate}</p>
          )}
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="w-px h-16 bg-white/30 animate-pulse" />
        </div>
      </div>

      {/* Details section */}
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        {event.description && (
          <p className="text-stone-600 text-lg leading-relaxed mb-12 italic">
            "{event.description}"
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-8">
          {eventDate && (
            <div>
              <div
                className="w-8 h-px mx-auto mb-4"
                style={{ backgroundColor: accent }}
              />
              <h3 className="text-stone-400 text-xs uppercase tracking-widest mb-2">Date</h3>
              <p className="text-stone-800 capitalize">{eventDate}</p>
            </div>
          )}
          {event.location && (
            <div>
              <div
                className="w-8 h-px mx-auto mb-4"
                style={{ backgroundColor: accent }}
              />
              <h3 className="text-stone-400 text-xs uppercase tracking-widest mb-2">Location</h3>
              <p className="text-stone-800">{event.location}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-stone-200 py-8 text-center">
        <p className="text-xs text-stone-400 uppercase tracking-widest">
          Made with EventsDock
        </p>
      </div>
    </div>
  )
}
