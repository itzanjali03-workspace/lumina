const AVATAR_COLORS = [
  'bg-teal-600',
  'bg-blue-500',
  'bg-violet-600',
  'bg-rose-500',
  'bg-emerald-600',
  'bg-indigo-500',
  'bg-amber-500',
  'bg-fuchsia-600',
  'bg-sky-600',
  'bg-orange-500',
]

export function avatarColor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

function unit(value: number, label: string) {
  return `${value} ${label}${value === 1 ? '' : 's'}`
}

export function formatRelative(timestamp: number, now: number) {
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000))
  if (seconds < 10) return 'Just now'
  if (seconds < 60) return unit(seconds, 'second')
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return unit(minutes, 'minute')
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return unit(hours, 'hour')
  return unit(Math.floor(hours / 24), 'day')
}

export function formatAgo(timestamp: number, now: number) {
  const relative = formatRelative(timestamp, now)
  return relative === 'Just now' ? 'just now' : `${relative} ago`
}

export async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}
