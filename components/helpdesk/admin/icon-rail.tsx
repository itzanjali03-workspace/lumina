'use client'

import { BarChart3, CircleHelp, Inbox, LifeBuoy, LogOut, RotateCcw, Settings, type LucideIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { helpdesk } from '@/lib/helpdesk/store'
import type { User } from '@/lib/helpdesk/types'
import { Avatar } from '../avatar'

export type AdminSection = 'inbox' | 'analytics' | 'settings'

const ITEMS: { id: AdminSection; label: string; icon: LucideIcon }[] = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function IconRail({
  user,
  section,
  onSectionChange,
}: {
  user: User
  section: AdminSection
  onSectionChange: (section: AdminSection) => void
}) {
  return (
    <nav
      aria-label="Primary"
      className="flex w-16 shrink-0 flex-col items-center gap-2 bg-zinc-950 py-3 text-zinc-400"
    >
      <span className="mb-3 flex size-9 items-center justify-center rounded-lg bg-white text-zinc-950">
        <LifeBuoy className="size-5" aria-hidden="true" />
        <span className="sr-only">Relay Helpdesk</span>
      </span>

      {ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          title={label}
          aria-label={label}
          aria-current={section === id ? 'page' : undefined}
          onClick={() => onSectionChange(id)}
          className={cn(
            'flex size-10 items-center justify-center rounded-lg transition-colors',
            section === id ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-900 hover:text-zinc-100',
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </button>
      ))}

      <div className="mt-auto flex flex-col items-center gap-3">
        <a
          href="mailto:it-support@company.com"
          title="Help"
          aria-label="Help"
          className="flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-zinc-900 hover:text-zinc-100"
        >
          <CircleHelp className="size-5" aria-hidden="true" />
        </a>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account menu"
            className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Avatar name={user.name} size="sm" />
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-zinc-950 bg-emerald-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col">
                <span className="text-sm font-medium text-zinc-900">{user.name}</span>
                <span className="font-normal">{user.email}</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => helpdesk.resetDemoData()}>
              <RotateCcw aria-hidden="true" />
              Reset demo tickets
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => helpdesk.signOut()}>
              <LogOut aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
