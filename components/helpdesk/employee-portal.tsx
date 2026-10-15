'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle2, LifeBuoy, LogOut, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { helpdesk, useNow } from '@/lib/helpdesk/store'
import { TEAMMATES } from '@/lib/helpdesk/seed'
import { formatAgo } from '@/lib/helpdesk/format'
import type { HelpdeskData, User } from '@/lib/helpdesk/types'
import { Avatar } from './avatar'
import { PriorityLabel, StatusPill } from './badges'
import { readTicketFields, TicketFields } from './ticket-fields'

export function EmployeePortal({ user, data }: { user: User; data: HelpdeskData }) {
  const now = useNow()
  const [formKey, setFormKey] = useState(0)
  const myTickets = data.tickets
    .filter((t) => t.requesterId === user.id)
    .sort((a, b) => b.createdAt - a.createdAt)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = readTicketFields(new FormData(event.currentTarget))
    if (!fields.subject || !fields.description) return
    helpdesk.createTicket({
      ...fields,
      requesterId: user.id,
      customerName: user.name,
      customerEmail: user.email,
    })
    toast.success('Ticket submitted', { description: 'The IT team has been notified.' })
    setFormKey((k) => k + 1)
  }

  return (
    <div className="min-h-dvh bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2 font-semibold text-zinc-950">
            <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <LifeBuoy className="size-4" aria-hidden="true" />
            </span>
            HelpDesk
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-zinc-900">{user.name}</p>
              <p className="text-xs text-zinc-500">{user.department}</p>
            </div>
            <Avatar name={user.name} size="sm" />
            <Button variant="ghost" size="sm" onClick={() => helpdesk.signOut()}>
              <LogOut aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:py-10">
        <section aria-labelledby="report-heading" className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h1 id="report-heading" className="text-balance text-xl font-semibold text-zinc-950">
            Report a technical issue
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Hardware, software, network, or access problems. Our IT team will pick it up from the inbox.
          </p>
          <form key={formKey} onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <TicketFields idPrefix="emp" defaultDepartment={user.department} />
            <div className="flex justify-end">
              <Button type="submit" className="h-10 px-4">
                <Send aria-hidden="true" />
                Submit ticket
              </Button>
            </div>
          </form>
        </section>

        <section aria-labelledby="my-tickets-heading" className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 id="my-tickets-heading" className="text-base font-semibold text-zinc-950">
              My tickets
            </h2>
            <span className="text-sm tabular-nums text-zinc-500">{myTickets.length}</span>
          </div>
          {myTickets.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center">
              <CheckCircle2 className="size-6 text-emerald-600" aria-hidden="true" />
              <p className="text-sm font-medium text-zinc-900">No tickets yet</p>
              <p className="text-sm text-zinc-500">Issues you report will appear here with live status.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {myTickets.map((t) => {
                const assignee = TEAMMATES.find((tm) => tm.id === t.assigneeId)
                return (
                  <li key={t.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs tabular-nums text-zinc-500">
                          #{t.number} · {formatAgo(t.createdAt, now)}
                        </p>
                        <p className="mt-0.5 truncate text-sm font-semibold text-zinc-950">{t.subject}</p>
                      </div>
                      <StatusPill status={t.status} />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 text-sm text-zinc-600">
                      <PriorityLabel priority={t.priority} />
                      <span className="truncate">{assignee ? `Handled by ${assignee.name}` : 'Awaiting assignment'}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
