'use client'
// components/dashboard/GuestImport.tsx
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'

export default function GuestImport({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('eventId', eventId)

    try {
      const res = await fetch('/api/guests/import', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      toast.success(`${data.imported} guests imported!`)
      window.location.reload()
    } catch (err: any) {
      toast.error(err.message || 'Import failed')
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFile}
        className="hidden"
        id="guest-import"
      />
      <label
        htmlFor="guest-import"
        className={`cursor-pointer text-sm bg-stone-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-stone-700 transition-colors ${
          loading ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {loading ? 'Importing...' : '📤 Import Excel/CSV'}
      </label>
      <p className="text-xs text-stone-400 mt-2 text-right">
        Columns: Name, Email, Phone
      </p>
    </div>
  )
}
