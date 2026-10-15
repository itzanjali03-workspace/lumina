'use client'

import { RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { helpdesk } from '@/lib/helpdesk/store'
import { TEAMMATES } from '@/lib/helpdesk/seed'
import type { User } from '@/lib/helpdesk/types'
import { Avatar } from '../avatar'

export function SettingsPanel({ users }: { users: User[] }) {
  const employees = users.filter((u) => u.role === 'employee')
  return (
    <div className="flex max-w-3xl flex-col gap-6 p-4 sm:p-5">
      <h1 className="text-base font-semibold text-zinc-950">Workspace settings</h1>

      <section className="rounded-xl border border-zinc-200">
        <h2 className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-900">Support team</h2>
        <ul className="divide-y divide-zinc-100">
          {TEAMMATES.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={t.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-zinc-900">{t.name}</p>
                <p className="text-xs text-zinc-500">{t.title}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-zinc-200">
        <h2 className="border-b border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-900">
          Registered employees <span className="font-normal text-zinc-500">({employees.length})</span>
        </h2>
        <ul className="divide-y divide-zinc-100">
          {employees.map((u) => (
            <li key={u.id} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={u.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900">{u.name}</p>
                <p className="truncate text-xs text-zinc-500">{u.email}</p>
              </div>
              <span className="text-xs text-zinc-500">{u.department}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Demo data</h2>
          <p className="text-sm text-zinc-500">Restore the original sample tickets. Accounts are kept.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            helpdesk.resetDemoData()
            toast.success('Demo tickets restored')
          }}
        >
          <RotateCcw aria-hidden="true" />
          Reset tickets
        </Button>
      </section>
    </div>
  )
}
