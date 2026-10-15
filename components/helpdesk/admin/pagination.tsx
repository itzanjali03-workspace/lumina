import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function pageItems(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'gap', total]
  if (current >= total - 3) return [1, 'gap', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'gap', current - 1, current, current + 1, 'gap', total]
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const base =
    'flex size-8 items-center justify-center rounded-md text-sm tabular-nums transition-colors disabled:pointer-events-none disabled:opacity-40'

  return (
    <nav aria-label="Pagination" className="flex items-center gap-0.5">
      <button
        type="button"
        className={cn(base, 'text-zinc-700 hover:bg-zinc-100')}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>
      {pageItems(page, totalPages).map((item, i) =>
        item === 'gap' ? (
          <span key={`gap-${i}`} className={cn(base, 'text-zinc-400')} aria-hidden="true">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              base,
              item === page ? 'bg-zinc-100 font-semibold text-zinc-950' : 'text-zinc-600 hover:bg-zinc-50',
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className={cn(base, 'text-zinc-700 hover:bg-zinc-100')}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  )
}
