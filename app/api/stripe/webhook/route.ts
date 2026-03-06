// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover' as any,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getPlanFromPriceId(priceId: string): string {
  console.log('getPlanFromPriceId:', priceId)
  console.log('STARTER_PRICE_ID:', process.env.STRIPE_STARTER_PRICE_ID)
  console.log('PRO_PRICE_ID:', process.env.STRIPE_PRO_PRICE_ID)
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  return 'free'
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('WEBHOOK: No stripe-signature header')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('WEBHOOK: Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('WEBHOOK: Received event:', event.type, event.id)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    console.log('WEBHOOK: Session metadata:', session.metadata)
    console.log('WEBHOOK: Session customer:', session.customer)
    console.log('WEBHOOK: Session subscription:', session.subscription)

    const userId = session.metadata?.user_id

    if (!userId) {
      console.error('WEBHOOK ERROR: No user_id in session metadata — checkout route is missing metadata: { user_id }')
      return NextResponse.json({ error: 'No user_id in metadata' }, { status: 200 }) // return 200 so Stripe doesn't retry
    }

    const subscriptionId = session.subscription as string

    let plan = 'starter' // fallback

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const priceId = subscription.items.data[0].price.id
      plan = getPlanFromPriceId(priceId)
      console.log('WEBHOOK: Resolved plan:', plan, 'from priceId:', priceId)
    } catch (err) {
      console.error('WEBHOOK: Failed to retrieve subscription, using fallback plan:', err)
    }

    console.log(`WEBHOOK: Updating user ${userId} to plan ${plan}`)

    const { data, error } = await supabase
      .from('profiles')
      .update({
        plan,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscriptionId,
      })
      .eq('id', userId)
      .select()

    if (error) {
      console.error('WEBHOOK ERROR: Supabase update failed:', error)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }

    console.log('WEBHOOK: Supabase update result:', data)

    if (!data || data.length === 0) {
      console.error(`WEBHOOK ERROR: No row found in profiles for user_id: ${userId}`)
      // Try to insert if row doesn't exist
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          plan,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscriptionId,
        })
      if (insertError) {
        console.error('WEBHOOK ERROR: Insert also failed:', insertError)
      } else {
        console.log('WEBHOOK: Inserted new profile row for user:', userId)
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription

    const { data: userData, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (fetchError || !userData) {
      console.error('WEBHOOK: Could not find user for deleted subscription:', subscription.id)
    } else {
      await supabase
        .from('profiles')
        .update({ plan: 'free', stripe_subscription_id: null })
        .eq('id', userData.id)
      console.log('WEBHOOK: Downgraded user', userData.id, 'to free')
    }
  }

  return NextResponse.json({ received: true })
}