'use client'

import { useState, type ReactNode } from 'react'
import {
  Briefcase,
  Check,
  ChevronDown,
  Circle,
  CircleCheck,
  CircleDashed,
  Code2,
  Landmark,
  Palette,
  Plus,
  Square,
  TicketIcon,
  User,
  UserRoundX,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { countFor, viewKey } from '@/lib/helpdesk/filters'
import { DEPARTMENTS, type Department, type InboxView, type Ticket } from '@/lib/helpdesk/types'

const DEPARTMENT_ICONS: Record<Department, LucideIcon> = {
  Engineering: Code2,
  Design: Palette,
  Sales: Briefcase,
  HR: Users,
  Finance: Landmark,
}

const PRIMARY_VIEWS: { view: InboxView; label: string; icon: LucideIcon; showCount: boolean }[] = [
  { view: { kind: 'all' }, label: 'All', icon: TicketIcon, showCount: false },
  { view: { kind: 'unassigned' }, label: 'Unassigned', icon: UserRoundX, showCount: true },
  { view: { kind: 'mine' }, label: 'My open', icon: User, showCount: true },
]

const STATUS_VIEWS: { view: InboxView; label: string; icon: LucideIcon; showCount: boolean }[] = [
  { view: { kind: 'status', status: 'open' }, label: 'Open', icon: Circle, showCount: true },
  { view: { kind: 'status', status: 'pending' }, label: 'Pending', icon: CircleDashed, showCount: true },
  { view: { kind: 'status', status: 'on_hold' }, label: 'On hold', icon: Square, showCount: true },
  { view: { kind: 'status', status: 'solved' }, label: 'Solved', icon: Check, showCount: false },
  { view: { kind: 'status', status: 'closed' }, label: 'Closed', icon: CircleCheck, showCount: false },
]

export function InboxSidebar({
  tickets,
  activeView,
  onSelectView,
  onNewTicket,
}: {
  tickets: Ticket[]
  activeView: InboxView
  onSelectView: (view: InboxView) => void
  onNewTicket: () => void
}) {
  const activeKey = viewKey(activeView)

  const renderItem = ({ view, label, icon, showCount }: (typeof PRIMARY_VIEWS)[number]) => (
    <NavItem
      key={viewKey(view)}
      icon={icon}
      label={label}
      count={showCount ? countFor(tickets, view) : undefined}
      active={activeKey === viewKey(view)}
      onClick={() => onSelectView(view)}
    />
  )

  return (
    <nav aria-label="Inbox" className="flex h-full w-full flex-col overflow-y-auto px-3 pb-4">
      <div className="flex h-14 shrink-0 items-center justify-between px-2">
        <h2 className="text-base font-semibold text-zinc-950">Inbox</h2>
        <button
          type="button"
          onClick={onNewTicket}
          aria-label="Create new ticket"
          className="flex size-6 items-center justify-center rounded-md bg-zinc-950 text-white transition-colors hover:bg-zinc-800"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>

      <Section title="Views">
        {DEPARTMENTS.map((department) => {
          const view: InboxView = { kind: 'department', department }
          return (
            <NavItem
              key={department}
              icon={DEPARTMENT_ICONS[department]}
              label={department}
              count={countFor(tickets, view)}
              active={activeKey === viewKey(view)}
              onClick={() => onSelectView(view)}
            />
          )
        })}
      </Section>

      <Section title="Tickets">
        {PRIMARY_VIEWS.map(renderItem)}
        <li role="separator" className="mx-2 my-1.5 h-px bg-zinc-200" />
        {STATUS_VIEWS.map(renderItem)}
      </Section>
    </nav>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
      >
        {title}
        <ChevronDown className={cn('size-4 text-zinc-500 transition-transform', !open && '-rotate-90')} aria-hidden="true" />
      </button>
      {open && <ul className="mt-1 flex flex-col gap-0.5">{children}</ul>}
    </div>
  )
}

function NavItem({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: LucideIcon
  label: string
  count?: number
  active: boolean
  onClick: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
          active ? 'bg-zinc-200/70 font-medium text-zinc-950' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate text-left">{label}</span>
        {count !== undefined && <span className="text-xs tabular-nums text-zinc-500">{count}</span>}
      </button>
    </li>
  )
}
