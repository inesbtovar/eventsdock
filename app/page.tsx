// app/page.tsx
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#FDFAF6', fontFamily: "'Georgia', serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #EDE8E0' }} className="px-6 sm:px-12 py-5 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div style={{ background: '#E8A87C', borderRadius: '10px' }} className="w-7 h-7 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <span style={{ color: '#2D2016', fontFamily: "'Georgia', serif", fontSize: '18px', fontWeight: '600' }}>
            EventsDock
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" style={{ color: '#7A6652', fontSize: '14px', fontFamily: 'system-ui, sans-serif' }} className="hover:opacity-70 transition-opacity">
            Sign in
          </Link>
          <Link href="/register" style={{
            background: '#2D2016',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '99px',
            fontSize: '14px',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: '500',
          }} className="hover:opacity-80 transition-opacity">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div style={{
          display: 'inline-block',
          background: '#FDF0E6',
          color: '#C47A3A',
          border: '1px solid #F0D5B8',
          borderRadius: '99px',
          padding: '6px 16px',
          fontSize: '13px',
          fontFamily: 'system-ui, sans-serif',
          marginBottom: '32px',
        }}>
          Free during early access
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 76px)',
          fontWeight: '400',
          color: '#2D2016',
          lineHeight: '1.15',
          letterSpacing: '-0.5px',
          marginBottom: '24px',
        }}>
          Plan your event,<br />
          <span style={{ color: '#C47A3A', fontStyle: 'italic' }}>beautifully.</span>
        </h1>

        <p style={{
          color: '#7A6652',
          fontSize: '18px',
          fontFamily: 'system-ui, sans-serif',
          lineHeight: '1.7',
          maxWidth: '520px',
          margin: '0 auto 40px',
          fontWeight: '400',
        }}>
          Upload your guest list, build a gorgeous event page, and let guests RSVP with a single link. No app downloads, no accounts needed for guests.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/register" style={{
            background: '#2D2016',
            color: 'white',
            padding: '14px 32px',
            borderRadius: '99px',
            fontSize: '15px',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: '500',
          }} className="hover:opacity-80 transition-opacity">
            Create your first event →
          </Link>
          <Link href="/login" style={{
            background: 'white',
            color: '#7A6652',
            padding: '14px 32px',
            borderRadius: '99px',
            fontSize: '15px',
            fontFamily: 'system-ui, sans-serif',
            border: '1px solid #EDE8E0',
          }} className="hover:border-stone-400 transition-colors">
            Sign in
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C47A3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              ),
              title: 'Import your guest list',
              desc: 'Upload your existing Excel or CSV file in seconds. We handle columns in English or Portuguese.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C47A3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              ),
              title: 'A website for your event',
              desc: 'Pick from beautiful templates and publish in minutes. Your guests will be impressed.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C47A3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              ),
              title: 'One link per guest',
              desc: 'Send via WhatsApp. Guests confirm with one tap — no account, no friction.',
            },
          ].map(f => (
            <div key={f.title} style={{
              background: 'white',
              border: '1px solid #EDE8E0',
              borderRadius: '20px',
              padding: '28px',
            }}>
              <div style={{
                background: '#FDF0E6',
                borderRadius: '12px',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                {f.icon}
              </div>
              <h3 style={{ color: '#2D2016', fontWeight: '600', fontSize: '16px', marginBottom: '8px', fontFamily: 'system-ui, sans-serif' }}>
                {f.title}
              </h3>
              <p style={{ color: '#7A6652', fontSize: '14px', lineHeight: '1.6', fontFamily: 'system-ui, sans-serif' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section style={{ background: '#2D2016' }} className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ color: '#FDF8F2', fontSize: '32px', fontWeight: '400', marginBottom: '16px' }}>
            Up and running in minutes
          </h2>
          <p style={{ color: '#A08060', fontSize: '15px', fontFamily: 'system-ui, sans-serif', marginBottom: '48px' }}>
            No learning curve. Just fill in the details and go.
          </p>
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { n: '1', label: 'Create your event' },
              { n: '2', label: 'Upload guest list' },
              { n: '3', label: 'Publish your site' },
              { n: '4', label: 'Track RSVPs live' },
            ].map(s => (
              <div key={s.n}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '99px',
                  background: '#E8A87C',
                  color: '#2D2016',
                  fontSize: '15px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontFamily: 'system-ui, sans-serif',
                }}>
                  {s.n}
                </div>
                <p style={{ color: '#C8A882', fontSize: '14px', fontFamily: 'system-ui, sans-serif' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24 px-6" style={{ background: '#FDFAF6' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '400', color: '#2D2016', marginBottom: '12px' }}>
          Ready to plan something special?
        </h2>
        <p style={{ color: '#7A6652', fontSize: '15px', fontFamily: 'system-ui, sans-serif', marginBottom: '32px' }}>
          Free to use. No credit card required.
        </p>
        <Link href="/register" style={{
          background: '#2D2016',
          color: 'white',
          padding: '14px 36px',
          borderRadius: '99px',
          fontSize: '15px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '500',
          display: 'inline-block',
        }} className="hover:opacity-80 transition-opacity">
          Create your event free →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #EDE8E0', background: 'white' }} className="py-8 text-center">
        <p style={{ color: '#B0A090', fontSize: '13px', fontFamily: 'system-ui, sans-serif' }}>
          © {new Date().getFullYear()} EventsDock. Made with care for weddings, birthdays & everything in between.
        </p>
      </footer>

    </div>
  )
}
