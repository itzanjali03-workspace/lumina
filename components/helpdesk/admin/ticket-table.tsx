'use client'

import { ArrowDown, ArrowUp, CornerUpLeft, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelative } from '@/lib/helpdesk/format'
import type { Ticket } from '@/lib/helpdesk/types'
import { Avatar } from '../avatar'
import { AssigneeMenu, PriorityMenu, RowActionsMenu, StatusMenu } from './ticket-menus'

export function TicketTable({
  tickets,
  now,
  sortDir,
  onToggleSort,
  onViewTicket,
  freshIds,
}: {
  tickets: Ticket[]
  now: number
  sortDir: 'asc' | 'desc'
  onToggleSort: () => void
  onViewTicket: (id: string) => void
  freshIds: Set<string>
}) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
          <Inbox className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-zinc-900">No tickets match</p>
        <p className="text-sm text-zinc-500">Try a different view, search, or filter.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] border-collapse text-left">
        <thead>
          <tr className="border-b border-zinc-200 text-sm text-zinc-600">
            <th scope="col" className="px-3 py-3 font-medium sm:pl-5">Customer</th>
            <th scope="col" className="px-3 py-3 font-medium">Subject</th>
            <th scope="col" className="px-3 py-3 font-medium">Priority</th>
            <th scope="col" className="px-3 py-3 font-medium">Teammate</th>
            <th scope="col" className="px-3 py-3 font-medium">Status</th>
            <th scope="col" className="px-3 py-3 font-medium" aria-sort={sortDir === 'desc' ? 'descending' : 'ascending'}>
              <button type="button" onClick={onToggleSort} className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-zinc-900">
                Last message
                {sortDir === 'desc' ? (
                  <ArrowDown className="size-3.5" aria-hidden="true" />
                ) : (
                  <ArrowUp className="size-3.5" aria-hidden="true" />
                )}
              </button>
            </th>
            <th scope="col" className="w-12 px-3 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className={cn(
                'border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-zinc-50',
                freshIds.has(ticket.id) && 'animate-in fade-in slide-in-from-top-1 bg-blue-50/50 duration-500',
              )}
            >
              <td className="px-3 py-3 sm:pl-5">
                <button
                  type="button"
                  onClick={() => onViewTicket(ticket.id)}
                  className="flex items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
                >
                  <Avatar name={ticket.customerName} single />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-zinc-950">
                      {ticket.customerName}
                      {freshIds.has(ticket.id) && (
                        <span className="rounded bg-blue-600 px-1 text-[10px] font-semibold uppercase text-white">New</span>
                      )}
                    </span>
                    <span className="block max-w-44 truncate text-xs text-zinc-500">{ticket.customerEmail}</span>
                  </span>
                </button>
              </td>
              <td className="max-w-56 px-3 py-3">
                <span className="flex items-center gap-2 text-sm text-zinc-800">
                  {ticket.isReply && (
                    <CornerUpLeft className="size-3.5 shrink-0 text-zinc-500" aria-label="Has reply" />
                  )}
                  <span className="truncate">{ticket.subject}</span>
                </span>
              </td>
              <td className="px-3 py-3">
                <PriorityMenu ticket={ticket} />
              </td>
              <td className="px-3 py-3">
                <AssigneeMenu ticket={ticket} />
              </td>
              <td className="px-3 py-3">
                <StatusMenu ticket={ticket} />
              </td>
              <td className="whitespace-nowrap px-3 py-3 text-sm text-zinc-700">
                <time dateTime={new Date(ticket.lastMessageAt).toISOString()}>
                  {formatRelative(ticket.lastMessageAt, now)}
                </time>
              </td>
              <td className="px-3 py-3 text-right">
                <RowActionsMenu ticket={ticket} onView={() => onViewTicket(ticket.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
