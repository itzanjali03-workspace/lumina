import { cn } from '@/lib/utils'
import { avatarColor, initials } from '@/lib/helpdesk/format'

const SIZES = {
  xs: 'size-5 text-[10px]',
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
} as const

export function Avatar({
  name,
  size = 'md',
  className,
  single = false,
}: {
  name: string
  size?: keyof typeof SIZES
  className?: string
  single?: boolean
}) {
  const label = single ? name.trim()[0]?.toUpperCase() : initials(name)
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white',
        avatarColor(name),
        SIZES[size],
        className,
      )}
    >
      {label}
    </span>
  )
}
