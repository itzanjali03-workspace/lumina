'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useNow } from '@/lib/helpdesk/store'
import { matchesQuery, matchesView, viewTitle } from '@/lib/helpdesk/filters'
import type { HelpdeskData, InboxView, Priority, User } from '@/lib/helpdesk/types'
import { IconRail, type AdminSection } from './icon-rail'
import { InboxSidebar } from './inbox-sidebar'
import { TopBar } from './top-bar'
import { FilterMenu } from './filter-menu'
import { Pagination } from './pagination'
import { TicketTable } from './ticket-table'
import { NewTicketDialog } from './new-ticket-dialog'
import { TicketDetailSheet } from './ticket-detail-sheet'
import { AnalyticsPanel } from './analytics-panel'
import { SettingsPanel } from './settings-panel'

const PAGE_SIZE = 8

export function AdminConsole({ user, data }: { user: User; data: HelpdeskData }) {
  const now = useNow()
  const [section, setSection] = useState<AdminSection>('inbox')
  const [view, setView] = useState<InboxView>({ kind: 'all' })
  const [query, setQuery] = useState('')
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [newTicketOpen, setNewTicketOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const freshIds = useIncomingTicketAlerts(data)

  const filtered = useMemo(() => {
    const list = data.tickets.filter(
      (t) =>
        matchesView(t, view) &&
        matchesQuery(t, query) &&
        (priorities.length === 0 || priorities.includes(t.priority)),
    )
    return list.sort((a, b) => (sortDir === 'desc' ? b.lastMessageAt - a.lastMessageAt : a.lastMessageAt - b.lastMessageAt))
  }, [data.tickets, view, query, priorities, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageTickets = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const selectedTicket = data.tickets.find((t) => t.id === selectedId) ?? null
  const resolvedCount = data.tickets.filter((t) => t.status === 'solved' || t.status === 'closed').length

  function selectView(next: InboxView) {
    setView(next)
    setPage(1)
    setSection('inbox')
    setSidebarOpen(false)
  }

  function updateQuery(value: string) {
    setQuery(value)
    setPage(1)
    setSection('inbox')
  }

  const sidebar = (
    <InboxSidebar
      tickets={data.tickets}
      activeView={view}
      onSelectView={selectView}
      onNewTicket={() => {
        setSidebarOpen(false)
        setNewTicketOpen(true)
      }}
    />
  )

  return (
    <div className="flex h-dvh overflow-hidden bg-zinc-100">
      <IconRail user={user} section={section} onSectionChange={setSection} />

      <aside className="hidden w-64 shrink-0 lg:block">{sidebar}</aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 bg-zinc-100 p-0">
          <SheetTitle className="sr-only">Inbox navigation</SheetTitle>
          {sidebar}
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          query={query}
          onQueryChange={updateQuery}
          resolvedCount={resolvedCount}
          onOpenSidebar={() => setSidebarOpen(true)}
          onNewTicket={() => setNewTicketOpen(true)}
        />

        <main className="mb-2 mr-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm max-lg:ml-2">
          <div className="min-h-0 flex-1 overflow-y-auto">
            {section === 'analytics' && <AnalyticsPanel tickets={data.tickets} />}
            {section === 'settings' && <SettingsPanel users={data.users} />}
            {section === 'inbox' && (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 sm:px-5">
                  <h1 className="text-base font-semibold text-zinc-950">{viewTitle(view)}</h1>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSection('analytics')}
                      aria-label="View analytics"
                      className="flex size-9 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100"
                    >
                      <SlidersHorizontal className="size-4" aria-hidden="true" />
                    </button>
                    <Button onClick={() => setNewTicketOpen(true)} className="h-9 px-3">
                      <Plus aria-hidden="true" />
                      New ticket
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 px-4 pt-4 sm:px-5">
                  <label className="relative flex w-full items-center sm:w-60">
                    <span className="sr-only">Search tickets</span>
                    <Search className="pointer-events-none absolute left-3 size-4 text-zinc-500" aria-hidden="true" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => updateQuery(e.target.value)}
                      placeholder="Search tickets"
                      className="h-9 w-full rounded-lg border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </label>
                  <FilterMenu
                    selected={priorities}
                    onChange={(next) => {
                      setPriorities(next)
                      setPage(1)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
                  <p className="text-sm font-semibold tabular-nums text-zinc-950" aria-live="polite">
                    {filtered.length.toLocaleString()} {filtered.length === 1 ? 'ticket' : 'tickets'}
                  </p>
                  {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />}
                </div>

                <TicketTable
                  tickets={pageTickets}
                  now={now}
                  sortDir={sortDir}
                  onToggleSort={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
                  onViewTicket={setSelectedId}
                  freshIds={freshIds}
                />
              </>
            )}
          </div>
        </main>
      </div>

      <NewTicketDialog open={newTicketOpen} onOpenChange={setNewTicketOpen} />
      <TicketDetailSheet ticket={selectedTicket} now={now} onClose={() => setSelectedId(null)} />
    </div>
  )
}

function useIncomingTicketAlerts(data: HelpdeskData) {
  const knownIds = useRef<Set<string> | null>(null)
  const [freshIds, setFreshIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    if (!knownIds.current) {
      knownIds.current = new Set(data.tickets.map((t) => t.id))
      return
    }
    const incoming = data.tickets.filter((t) => !knownIds.current!.has(t.id))
    if (incoming.length === 0) return
    incoming.forEach((t) => knownIds.current!.add(t.id))

    const fromEmployees = incoming.filter((t) => t.requesterId !== null && !t.id.startsWith('tk_seed_'))
    if (fromEmployees.length === 0) return
    fromEmployees.forEach((t) =>
      toast(`New ticket from ${t.customerName}`, { description: `#${t.number} · ${t.subject}` }),
    )
    setFreshIds((prev) => new Set([...prev, ...fromEmployees.map((t) => t.id)]))
    window.setTimeout(() => {
      setFreshIds((prev) => {
        const next = new Set(prev)
        fromEmployees.forEach((t) => next.delete(t.id))
        return next
      })
    }, 15_000)
  }, [data.tickets])

  return freshIds
}
