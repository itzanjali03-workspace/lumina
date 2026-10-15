'use client'

import { useEffect, useRef } from 'react'
import { CircleCheckBig, Menu, Plus, Search } from 'lucide-react'
import { TEAMMATES } from '@/lib/helpdesk/seed'
import { Avatar } from '../avatar'

export function TopBar({
  query,
  onQueryChange,
  resolvedCount,
  onOpenSidebar,
  onNewTicket,
}: {
  query: string
  onQueryChange: (value: string) => void
  resolvedCount: number
  onOpenSidebar: () => void
  onNewTicket: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 px-3 sm:px-4">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open inbox navigation"
        className="flex size-9 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-200 lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <div className="hidden items-center gap-2 rounded-full bg-zinc-200/70 px-3 py-1.5 text-sm md:flex">
        <CircleCheckBig className="size-4 text-zinc-700" aria-hidden="true" />
        <span className="font-semibold tabular-nums text-zinc-950">{resolvedCount}</span>
        <span className="text-zinc-600">Tickets resolved</span>
      </div>

      <label className="relative mx-auto flex w-full max-w-md items-center">
        <span className="sr-only">Search tickets</span>
        <Search className="pointer-events-none absolute left-3 size-4 text-zinc-500" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search text or go to..."
          className="h-9 w-full rounded-lg bg-zinc-200/70 pl-9 pr-16 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
        />
        <span className="pointer-events-none absolute right-2 hidden items-center gap-1 sm:flex" aria-hidden="true">
          <kbd className="rounded border border-zinc-300 bg-white px-1.5 text-[11px] font-medium text-zinc-500">Ctrl</kbd>
          <kbd className="rounded border border-zinc-300 bg-white px-1.5 text-[11px] font-medium text-zinc-500">K</kbd>
        </span>
      </label>

      <div className="flex items-center gap-2">
        <div className="hidden items-center rounded-full bg-zinc-200/70 py-0.5 pl-0.5 pr-2 sm:flex">
          <div className="flex -space-x-1.5">
            {TEAMMATES.slice(1, 4).map((t) => (
              <Avatar key={t.id} name={t.name} size="sm" className="ring-2 ring-zinc-100" />
            ))}
          </div>
          <span className="ml-1.5 text-xs font-medium text-zinc-600">+99</span>
          <span className="sr-only">teammates online</span>
        </div>
        <button
          type="button"
          onClick={onNewTicket}
          aria-label="Create new ticket"
          className="flex size-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
