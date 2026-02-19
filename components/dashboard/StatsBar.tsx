// components/dashboard/StatsBar.tsx
import type { GuestStats } from '@/lib/types'

type Props = {
  stats: GuestStats
}

export default function StatsBar({ stats }: Props) {
  const items = [
    { label: 'Total', value: stats.total, bg: 'bg-white', text: 'text-stone-900' },
    { label: 'Confirmed', value: stats.confirmed, bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'Declined', value: stats.declined, bg: 'bg-red-50', text: 'text-red-600' },
    { label: 'Pending', value: stats.pending, bg: 'bg-yellow-50', text: 'text-yellow-700' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map(item => (
        <div
          key={item.label}
          className={`${item.bg} rounded-xl border border-stone-200 p-5`}
        >
          <p className={`text-3xl font-bold ${item.text}`}>{item.value}</p>
          <p className="text-sm text-stone-500 mt-1">{item.label}</p>
          {stats.total > 0 && item.label !== 'Total' && (
            <p className="text-xs text-stone-400 mt-1">
              {Math.round((item.value / stats.total) * 100)}%
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
