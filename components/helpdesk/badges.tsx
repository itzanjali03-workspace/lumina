import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronsUp,
  CircleCheck,
  CircleDashed,
  CirclePause,
  Play,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Priority, Status } from '@/lib/helpdesk/types'

export const PRIORITY_META: Record<Priority, { label: string; icon: LucideIcon | null; className: string }> = {
  urgent: { label: 'Urgent', icon: ChevronsUp, className: 'text-red-600' },
  high: { label: 'High', icon: ArrowUp, className: 'text-red-600' },
  medium: { label: 'Medium', icon: null, className: 'text-zinc-400' },
  low: { label: 'Low', icon: ArrowDown, className: 'text-emerald-600' },
}

export const STATUS_META: Record<Status, { label: string; icon: LucideIcon; className: string }> = {
  open: { label: 'Open', icon: Play, className: 'bg-blue-50 text-blue-700 ring-blue-200' },
  pending: { label: 'Pending', icon: CircleDashed, className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  on_hold: { label: 'On hold', icon: CirclePause, className: 'bg-violet-50 text-violet-700 ring-violet-200' },
  solved: { label: 'Solved', icon: Check, className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  closed: { label: 'Closed', icon: CircleCheck, className: 'bg-zinc-100 text-zinc-600 ring-zinc-200' },
}

export function PriorityIcon({ priority, className }: { priority: Priority; className?: string }) {
  const meta = PRIORITY_META[priority]
  if (!meta.icon) {
    return (
      <span aria-hidden="true" className={cn('flex size-4 items-center justify-center', className)}>
        <span className="size-1.5 rounded-full bg-zinc-400" />
      </span>
    )
  }
  const Icon = meta.icon
  return <Icon aria-hidden="true" className={cn('size-4', meta.className, className)} strokeWidth={2.25} />
}

export function PriorityLabel({ priority }: { priority: Priority }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-zinc-800">
      <PriorityIcon priority={priority} />
      {PRIORITY_META[priority].label}
    </span>
  )
}

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  const meta = STATUS_META[status]
  const Icon = meta.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        meta.className,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3" strokeWidth={2.25} />
      {meta.label}
    </span>
  )
}
