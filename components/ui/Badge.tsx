// components/ui/Badge.tsx
import { statusColor } from '@/lib/utils'

type Props = {
  status: string
  className?: string
}

const labels: Record<string, string> = {
  confirmed: '✓ Confirmed',
  declined:  '✗ Declined',
  pending:   '· Pending',
  draft:     'Draft',
  published: 'Published',
}

export default function Badge({ status, className = '' }: Props) {
  return (
    <span
      className={`
        inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium
        ${statusColor(status)}
        ${className}
      `}
    >
      {labels[status] ?? status}
    </span>
  )
}
