// components/templates/TemplateRustic.tsx
type Event = {
  name: string
  date: string
  location: string
  description: string
  cover_image: string | null
  template_config: any
  slug: string
}

export default function TemplateRustic({ event }: { event: Event }) {
  const config = event.template_config || {}
  const eventDate = event.date
    ? new Date(event.date).toLocaleDateString('pt-PT', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })
    : null

  return (
    <div
      className="min-h-screen text-stone-800"
      style={{
        backgroundColor: '#f5f0e8',
        fontFamily: "'Georgia', serif",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8b89a' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Decorative border header */}
      <div className="text-center px-8 pt-16 pb-12">
        {/* Top ornament */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px flex-1 max-w-24 bg-stone-400" />
          <span className="text-2xl text-stone-500">❦</span>
          <div className="h-px flex-1 max-w-24 bg-stone-400" />
        </div>

        <p className="text-xs uppercase tracking-[0.4em] text-stone-500 mb-4">
          Together with their families
        </p>

        {config.coupleNames && (
          <h2 className="text-2xl text-stone-600 mb-2">{config.coupleNames}</h2>
        )}

        <h1
          className="text-5xl sm:text-7xl text-stone-800 my-4 leading-tight"
          style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic' }}
        >
          {event.name}
        </h1>

        {/* Bottom ornament */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="h-px flex-1 max-w-24 bg-stone-400" />
          <span className="text-2xl text-stone-500">❦</span>
          <div className="h-px flex-1 max-w-24 bg-stone-400" />
        </div>
      </div>

      {/* Cover image */}
      {event.cover_image && (
        <div className="mx-8 sm:mx-auto sm:max-w-2xl">
          <img
            src={event.cover_image}
            alt={event.name}
            className="w-full rounded-sm shadow-md"
            style={{ filter: 'sepia(15%)' }}
          />
        </div>
      )}

      {/* Details */}
      <div className="max-w-2xl mx-auto px-8 py-16 text-center">
        {event.description && (
          <p className="text-stone-600 italic text-lg leading-relaxed mb-10">
            {event.description}
          </p>
        )}

        <div
          className="border border-stone-400 rounded-sm p-8 inline-block"
          style={{
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(4px)'
          }}
        >
          {eventDate && (
            <p className="capitalize text-stone-700 text-lg">{eventDate}</p>
          )}
          {event.location && (
            <p className="text-stone-500 mt-2">{event.location}</p>
          )}
        </div>
      </div>

      <div className="border-t border-stone-300 py-6 text-center text-xs text-stone-400">
        Made with EventsDock
      </div>
    </div>
  )
}
