// app/page.tsx
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-5 border-b border-stone-100">
        <span className="text-xl font-bold text-stone-900 tracking-tight">EventFlow</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors font-medium"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-stone-100 text-stone-600 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          ✨ Free while in early access
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold text-stone-900 leading-tight tracking-tight">
          Plan your event.<br />
          <span className="text-stone-400">All in one place.</span>
        </h1>
        <p className="mt-6 text-lg text-stone-500 max-w-xl mx-auto leading-relaxed">
          Upload your guest list, create a beautiful event website, and let guests RSVP with a single link — no account needed for them.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-stone-900 text-white px-8 py-4 rounded-xl text-sm font-semibold hover:bg-stone-700 transition-colors"
          >
            Create your event →
          </Link>
          <Link
            href="/event/demo-wedding"
            className="w-full sm:w-auto border border-stone-200 text-stone-600 px-8 py-4 rounded-xl text-sm font-medium hover:border-stone-400 transition-colors"
          >
            See a demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: '📋',
              title: 'Import your guest list',
              desc: 'Upload your existing Excel or CSV file. We handle the rest.',
            },
            {
              icon: '🌐',
              title: 'Beautiful event website',
              desc: 'Pick a template, customize it, and publish in minutes.',
            },
            {
              icon: '✉️',
              title: 'One link per guest',
              desc: 'Share via WhatsApp. Guests confirm with one tap — no account needed.',
            },
          ].map(f => (
            <div key={f.title} className="bg-stone-50 rounded-2xl p-8 border border-stone-100">
              <span className="text-4xl">{f.icon}</span>
              <h3 className="mt-4 font-semibold text-stone-900">{f.title}</h3>
              <p className="mt-2 text-sm text-stone-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-stone-900 text-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">How it works</h2>
          <div className="grid sm:grid-cols-4 gap-8">
            {[
              { step: '1', label: 'Create your event' },
              { step: '2', label: 'Upload guest list' },
              { step: '3', label: 'Publish your site' },
              { step: '4', label: 'Track RSVPs live' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-stone-700 text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <p className="text-stone-300 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24 px-6">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">Ready to start planning?</h2>
        <p className="text-stone-500 mb-8">Free to use. No credit card required.</p>
        <Link
          href="/register"
          className="inline-block bg-stone-900 text-white px-10 py-4 rounded-xl font-semibold hover:bg-stone-700 transition-colors"
        >
          Create your event free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-8 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} EventFlow. Made for weddings, birthdays & everything in between.
      </footer>
    </div>
  )
}
