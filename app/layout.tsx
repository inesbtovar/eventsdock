// app/layout.tsx
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

import { SpeedInsights } from "@vercel/speed-insights/next"

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EventsDock — Event Planning Made Simple',
  description: 'Manage guests, send invitations, and create beautiful event websites in one place.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1c1917',
              color: '#e7e5e4',
              border: '1px solid #292524',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#86efac', secondary: '#1c1917' } },
            error: { iconTheme: { primary: '#fca5a5', secondary: '#1c1917' } },
          }}
        />
      </body>
    </html>
  )
}
