'use client'

import { Filter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PRIORITIES, type Priority } from '@/lib/helpdesk/types'
import { PRIORITY_META, PriorityIcon } from '../badges'

export function FilterMenu({
  selected,
  onChange,
}: {
  selected: Priority[]
  onChange: (next: Priority[]) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 outline-none transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-zinc-900/20 data-popup-open:bg-zinc-50">
        <Filter className="size-4" aria-hidden="true" />
        Filter
        {selected.length > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-zinc-950 text-[11px] font-semibold text-white">
            {selected.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {PRIORITIES.map((p) => (
            <DropdownMenuCheckboxItem
              key={p}
              checked={selected.includes(p)}
              closeOnClick={false}
              onCheckedChange={(checked) =>
                onChange(checked ? [...selected, p] : selected.filter((s) => s !== p))
              }
            >
              <PriorityIcon priority={p} />
              {PRIORITY_META[p].label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onChange([])}>Clear filters</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
