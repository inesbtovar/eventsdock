// app/pricing/page.tsx
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#FDFAF6', fontFamily: "'Georgia', serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #EDE8E0' }} className="px-6 sm:px-12 py-5 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
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
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/login" style={{ color: '#7A6652', fontSize: '14px', fontFamily: 'system-ui, sans-serif' }} className="hover:opacity-70 transition-opacity">
            Sign in
          </Link>
          <Link href="/register" style={{
            background: '#2D2016',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: '500',
          }} className="hover:opacity-80 transition-opacity">
            Get started
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center px-6 pt-16 pb-12">
        <h1 style={{ color: '#2D2016', fontSize: '42px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          Simple, honest pricing
        </h1>
        <p style={{ color: '#7A6652', fontSize: '18px', marginTop: '12px', fontFamily: 'system-ui, sans-serif' }}>
          Start free, upgrade when you need more.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Free Plan */}
          <div style={{
            background: 'white',
            border: '1px solid #EDE8E0',
            borderRadius: '16px',
            padding: '32px',
          }}>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: '#7A6652', fontSize: '13px', fontFamily: 'system-ui, sans-serif', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Free</p>
              <div className="flex items-end gap-1 mt-2">
                <span style={{ color: '#2D2016', fontSize: '40px', fontWeight: '700' }}>€0</span>
                <span style={{ color: '#7A6652', fontSize: '14px', fontFamily: 'system-ui, sans-serif', marginBottom: '8px' }}>/month</span>
              </div>
              <p style={{ color: '#7A6652', fontSize: '14px', fontFamily: 'system-ui, sans-serif', marginTop: '8px' }}>
                Perfect for one-off events
              </p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0' }} className="space-y-3">
              {['1 active event', 'Up to 50 guests', 'RSVP tracking', 'Public event page', 'Email invitations'].map((feature) => (
                <li key={feature} className="flex items-center gap-2" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#4A3728' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8A87C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/register" style={{
              display: 'block',
              textAlign: 'center',
              border: '1.5px solid #2D2016',
              color: '#2D2016',
              padding: '11px',
              borderRadius: '9px',
              fontSize: '14px',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: '500',
            }} className="hover:bg-stone-50 transition-colors">
              Get started free
            </Link>
          </div>

          {/* Starter Plan */}
          <div style={{
            background: '#2D2016',
            border: '1px solid #2D2016',
            borderRadius: '16px',
            padding: '32px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#E8A87C',
              color: 'white',
              fontSize: '11px',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '99px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Most popular
            </div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: '#C4A882', fontSize: '13px', fontFamily: 'system-ui, sans-serif', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starter</p>
              <div className="flex items-end gap-1 mt-2">
                <span style={{ color: 'white', fontSize: '40px', fontWeight: '700' }}>€9</span>
                <span style={{ color: '#C4A882', fontSize: '14px', fontFamily: 'system-ui, sans-serif', marginBottom: '8px' }}>/month</span>
              </div>
              <p style={{ color: '#C4A882', fontSize: '14px', fontFamily: 'system-ui, sans-serif', marginTop: '8px' }}>
                For growing event planners
              </p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0' }} className="space-y-3">
              {['5 active events', 'Up to 200 guests', 'RSVP tracking', 'Custom event pages', 'Email invitations', 'Guest import (CSV/Excel)', 'Analytics dashboard'].map((feature) => (
                <li key={feature} className="flex items-center gap-2" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#F5EDE0' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8A87C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/register?plan=starter" style={{
              display: 'block',
              textAlign: 'center',
              background: '#E8A87C',
              color: 'white',
              padding: '11px',
              borderRadius: '9px',
              fontSize: '14px',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: '500',
            }} className="hover:opacity-90 transition-opacity">
              Start with Starter
            </Link>
          </div>

          {/* Pro Plan */}
          <div style={{
            background: 'white',
            border: '1px solid #EDE8E0',
            borderRadius: '16px',
            padding: '32px',
          }}>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: '#7A6652', fontSize: '13px', fontFamily: 'system-ui, sans-serif', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pro</p>
              <div className="flex items-end gap-1 mt-2">
                <span style={{ color: '#2D2016', fontSize: '40px', fontWeight: '700' }}>€19</span>
                <span style={{ color: '#7A6652', fontSize: '14px', fontFamily: 'system-ui, sans-serif', marginBottom: '8px' }}>/month</span>
              </div>
              <p style={{ color: '#7A6652', fontSize: '14px', fontFamily: 'system-ui, sans-serif', marginTop: '8px' }}>
                For professional planners
              </p>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0' }} className="space-y-3">
              {['Unlimited events', 'Unlimited guests', 'RSVP tracking', 'Custom event pages', 'Email invitations', 'Guest import (CSV/Excel)', 'Analytics dashboard', 'Priority support', 'Custom branding'].map((feature) => (
                <li key={feature} className="flex items-center gap-2" style={{ fontFamily: 'system-ui, sans-serif', fontSize: '14px', color: '#4A3728' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8A87C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/register?plan=pro" style={{
              display: 'block',
              textAlign: 'center',
              border: '1.5px solid #2D2016',
              color: '#2D2016',
              padding: '11px',
              borderRadius: '9px',
              fontSize: '14px',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: '500',
            }} className="hover:bg-stone-50 transition-colors">
              Start with Pro
            </Link>
          </div>

        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto px-6 pb-24">
        <h2 style={{ color: '#2D2016', fontSize: '26px', fontWeight: '700', textAlign: 'center', marginBottom: '32px' }}>
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: 'Can I switch plans later?',
              a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
            },
            {
              q: 'Do you offer refunds?',
              a: 'We offer a 14-day money-back guarantee on all paid plans. No questions asked.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit and debit cards via Stripe. Your payment info is never stored on our servers.',
            },
            {
              q: 'Is there a free trial for paid plans?',
              a: 'The Free plan lets you explore EventsDock with no time limit. Paid plans include a 14-day refund window.',
            },
          ].map(({ q, a }) => (
            <div key={q} style={{ borderBottom: '1px solid #EDE8E0', paddingBottom: '20px' }}>
              <p style={{ color: '#2D2016', fontWeight: '600', fontSize: '15px', marginBottom: '6px' }}>{q}</p>
              <p style={{ color: '#7A6652', fontSize: '14px', fontFamily: 'system-ui, sans-serif', lineHeight: '1.6' }}>{a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
