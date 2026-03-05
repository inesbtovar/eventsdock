// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { priceId, plan } = await request.json()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  // Get or create Stripe customer
  const { data: planRow } = await supabase
    .from('plans')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = planRow?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/pricing`,
    metadata: {
      user_id: user.id,
      plan,
    },
  })

  return NextResponse.json({ url: session.url })
}