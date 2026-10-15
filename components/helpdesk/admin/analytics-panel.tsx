import { DEPARTMENTS, PRIORITIES, STATUSES, type Ticket } from '@/lib/helpdesk/types'
import { TEAMMATES } from '@/lib/helpdesk/seed'
import type { ReactNode } from 'react'
import { PRIORITY_META, PriorityIcon, StatusPill } from '../badges'

function BarList({ rows, total }: { rows: { key: string; label: ReactNode; value: number }[]; total: number }) {
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => (
        <li key={row.key} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-700">{row.label}</span>
            <span className="tabular-nums text-zinc-500">{row.value}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-zinc-900"
              style={{ width: `${total ? (row.value / total) * 100 : 0}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function AnalyticsPanel({ tickets }: { tickets: Ticket[] }) {
  const total = tickets.length
  const active = tickets.filter((t) => ['open', 'pending', 'on_hold'].includes(t.status)).length
  const urgent = tickets.filter((t) => t.priority === 'urgent' && t.status !== 'closed' && t.status !== 'solved').length
  const resolved = tickets.filter((t) => t.status === 'solved' || t.status === 'closed').length

  const stats = [
    { label: 'Total tickets', value: total },
    { label: 'Active', value: active },
    { label: 'Urgent & unresolved', value: urgent },
    { label: 'Resolution rate', value: `${total ? Math.round((resolved / total) * 100) : 0}%` },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-5">
      <h1 className="text-base font-semibold text-zinc-950">Analytics</h1>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 p-4">
            <dt className="text-sm text-zinc-500">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-950">{s.value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-zinc-200 p-4">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">By status</h2>
          <BarList
            total={total}
            rows={STATUSES.map((s) => ({
              key: s,
              label: <StatusPill status={s} />,
              value: tickets.filter((t) => t.status === s).length,
            }))}
          />
        </section>
        <section className="rounded-xl border border-zinc-200 p-4">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">By priority</h2>
          <BarList
            total={total}
            rows={PRIORITIES.map((p) => ({
              key: p,
              label: (
                <span className="inline-flex items-center gap-2">
                  <PriorityIcon priority={p} />
                  {PRIORITY_META[p].label}
                </span>
              ),
              value: tickets.filter((t) => t.priority === p).length,
            }))}
          />
        </section>
        <section className="rounded-xl border border-zinc-200 p-4">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">By department</h2>
          <BarList
            total={total}
            rows={DEPARTMENTS.map((d) => ({ key: d, label: d, value: tickets.filter((t) => t.department === d).length }))}
          />
        </section>
      </div>
      <section className="rounded-xl border border-zinc-200 p-4">
        <h2 className="mb-4 text-sm font-semibold text-zinc-900">Active workload by teammate</h2>
        <BarList
          total={active}
          rows={TEAMMATES.map((tm) => ({
            key: tm.id,
            label: tm.name,
            value: tickets.filter((t) => t.assigneeId === tm.id && ['open', 'pending', 'on_hold'].includes(t.status)).length,
          }))}
        />
      </section>
    </div>
  )
}
