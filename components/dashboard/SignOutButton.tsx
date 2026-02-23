'use client'
// components/dashboard/SignOutButton.tsx
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      style={{ color: '#7A6652', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}
      className="hover:opacity-70 transition-opacity"
    >
      Sign out
    </button>
  )
}
