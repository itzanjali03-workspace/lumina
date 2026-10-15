import { ADMIN_ID } from './seed'
import type { InboxView, Ticket } from './types'

const ACTIVE_STATUSES = new Set(['open', 'pending', 'on_hold'])

export function matchesView(ticket: Ticket, view: InboxView) {
  switch (view.kind) {
    case 'all':
      return true
    case 'unassigned':
      return ticket.assigneeId === null && ACTIVE_STATUSES.has(ticket.status)
    case 'mine':
      return ticket.assigneeId === ADMIN_ID && ACTIVE_STATUSES.has(ticket.status)
    case 'status':
      return ticket.status === view.status
    case 'department':
      return ticket.department === view.department
  }
}

export function viewKey(view: InboxView) {
  if (view.kind === 'status') return `status:${view.status}`
  if (view.kind === 'department') return `department:${view.department}`
  return view.kind
}

export function viewTitle(view: InboxView) {
  switch (view.kind) {
    case 'all':
      return 'All'
    case 'unassigned':
      return 'Unassigned'
    case 'mine':
      return 'My open'
    case 'status':
      return { open: 'Open', pending: 'Pending', on_hold: 'On hold', solved: 'Solved', closed: 'Closed' }[view.status]
    case 'department':
      return view.department
  }
}

export function matchesQuery(ticket: Ticket, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    ticket.customerName.toLowerCase().includes(q) ||
    ticket.customerEmail.toLowerCase().includes(q) ||
    ticket.subject.toLowerCase().includes(q) ||
    `#${ticket.number}`.includes(q)
  )
}

export function countFor(tickets: Ticket[], view: InboxView) {
  return tickets.reduce((n, t) => (matchesView(t, view) ? n + 1 : n), 0)
}
