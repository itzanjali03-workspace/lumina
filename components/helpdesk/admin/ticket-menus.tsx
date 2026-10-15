'use client'

import { Check, ChevronDown, Eye, MoreHorizontal, Trash2, UserCheck, UserRound, CircleCheck } from 'lucide-react'
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
import { ADMIN_ID, TEAMMATES } from '@/lib/helpdesk/seed'
import { PRIORITIES, STATUSES, type Ticket } from '@/lib/helpdesk/types'
import { PRIORITY_META, PriorityIcon, STATUS_META, StatusPill } from '../badges'
import { Avatar } from '../avatar'

const triggerClass =
  'group/trigger inline-flex items-center gap-2 rounded-md px-1.5 py-1 -mx-1.5 text-sm text-zinc-800 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900/20 data-popup-open:bg-zinc-100'

const chevronClass =
  'size-5 rounded-md border border-zinc-200 bg-white p-0.5 text-zinc-500 opacity-0 transition-opacity group-hover/trigger:opacity-100 group-focus-visible/trigger:opacity-100 group-data-popup-open/trigger:opacity-100'

export function PriorityMenu({ ticket }: { ticket: Ticket }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={triggerClass}
        aria-label={`Priority: ${PRIORITY_META[ticket.priority].label}. Change priority`}
      >
        <PriorityIcon priority={ticket.priority} />
        <span>{PRIORITY_META[ticket.priority].label}</span>
        <ChevronDown aria-hidden="true" className={chevronClass} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Set priority</DropdownMenuLabel>
          {PRIORITIES.map((p) => (
            <DropdownMenuItem key={p} onClick={() => helpdesk.updateTicket(ticket.id, { priority: p })}>
              <PriorityIcon priority={p} />
              {PRIORITY_META[p].label}
              {ticket.priority === p && <Check className="ml-auto" aria-hidden="true" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function StatusMenu({ ticket }: { ticket: Ticket }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(triggerClass, 'gap-1')}
        aria-label={`Status: ${STATUS_META[ticket.status].label}. Change status`}
      >
        <StatusPill status={ticket.status} />
        <ChevronDown aria-hidden="true" className={chevronClass} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Set status</DropdownMenuLabel>
          {STATUSES.map((s) => (
            <DropdownMenuItem key={s} onClick={() => helpdesk.updateTicket(ticket.id, { status: s })}>
              <StatusPill status={s} />
              {ticket.status === s && <Check className="ml-auto" aria-hidden="true" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AssigneeMenu({ ticket }: { ticket: Ticket }) {
  const assignee = TEAMMATES.find((t) => t.id === ticket.assigneeId)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={triggerClass}
        aria-label={`Teammate: ${assignee?.name ?? 'Unassigned'}. Change teammate`}
      >
        {assignee ? (
          <Avatar name={assignee.name} size="xs" />
        ) : (
          <span className="flex size-5 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
            <UserRound className="size-3" aria-hidden="true" />
          </span>
        )}
        <span className="truncate">{assignee?.name ?? 'Unassigned'}</span>
        <ChevronDown aria-hidden="true" className={chevronClass} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Assign to</DropdownMenuLabel>
          {TEAMMATES.map((t) => (
            <DropdownMenuItem key={t.id} onClick={() => helpdesk.updateTicket(ticket.id, { assigneeId: t.id })}>
              <Avatar name={t.name} size="xs" />
              <span className="truncate">{t.id === ADMIN_ID ? `${t.name} (you)` : t.name}</span>
              {ticket.assigneeId === t.id && <Check className="ml-auto" aria-hidden="true" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => helpdesk.updateTicket(ticket.id, { assigneeId: null })}>
            <UserRound aria-hidden="true" />
            Unassigned
            {ticket.assigneeId === null && <Check className="ml-auto" aria-hidden="true" />}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function RowActionsMenu({ ticket, onView }: { ticket: Ticket; onView: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex size-8 items-center justify-center rounded-md text-zinc-600 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900/20 data-popup-open:bg-zinc-100"
        aria-label={`Actions for ticket from ${ticket.customerName}`}
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onView}>
          <Eye aria-hidden="true" />
          View details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => helpdesk.updateTicket(ticket.id, { assigneeId: ADMIN_ID })}>
          <UserCheck aria-hidden="true" />
          Assign to me
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => helpdesk.updateTicket(ticket.id, { status: 'solved' })}>
          <CircleCheck aria-hidden="true" />
          Mark as solved
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => helpdesk.deleteTicket(ticket.id)}>
          <Trash2 aria-hidden="true" />
          Delete ticket
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
