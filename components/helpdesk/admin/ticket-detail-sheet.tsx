'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatAgo } from '@/lib/helpdesk/format'
import type { Ticket } from '@/lib/helpdesk/types'
import { Avatar } from '../avatar'
import { AssigneeMenu, PriorityMenu, StatusMenu } from './ticket-menus'

export function TicketDetailSheet({
  ticket,
  now,
  onClose,
}: {
  ticket: Ticket | null
  now: number
  onClose: () => void
}) {
  return (
    <Sheet open={ticket !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        {ticket && (
          <>
            <SheetHeader className="border-b border-zinc-200">
              <p className="text-xs font-medium tabular-nums text-zinc-500">#{ticket.number}</p>
              <SheetTitle className="text-pretty text-lg">{ticket.subject}</SheetTitle>
              <SheetDescription>
                Opened {formatAgo(ticket.createdAt, now)} · {ticket.department}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
              <div className="flex items-center gap-3">
                <Avatar name={ticket.customerName} single />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-950">{ticket.customerName}</p>
                  <p className="truncate text-sm text-zinc-500">{ticket.customerEmail}</p>
                </div>
              </div>

              <dl className="grid grid-cols-[7rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
                <dt className="text-zinc-500">Priority</dt>
                <dd className="pl-1.5">
                  <PriorityMenu ticket={ticket} />
                </dd>
                <dt className="text-zinc-500">Status</dt>
                <dd className="pl-1.5">
                  <StatusMenu ticket={ticket} />
                </dd>
                <dt className="text-zinc-500">Teammate</dt>
                <dd className="pl-1.5">
                  <AssigneeMenu ticket={ticket} />
                </dd>
              </dl>

              <section aria-labelledby="ticket-desc">
                <h3 id="ticket-desc" className="mb-2 text-sm font-medium text-zinc-900">
                  Description
                </h3>
                <p className="whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm leading-relaxed text-zinc-700">
                  {ticket.description}
                </p>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
