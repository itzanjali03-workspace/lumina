'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Headset, LifeBuoy, Loader2, ShieldCheck, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { helpdesk } from '@/lib/helpdesk/store'
import { DEPARTMENTS, type Department } from '@/lib/helpdesk/types'
import { DEMO_PASSWORD } from '@/lib/helpdesk/seed'

type Mode = 'signin' | 'register'

export const selectClassName =
  'h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signin')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '')
    const password = String(form.get('password') ?? '')
    setError(null)

    if (mode === 'register') {
      const name = String(form.get('name') ?? '').trim()
      const department = String(form.get('department') ?? '') as Department
      if (name.length < 2) return setError('Please enter your full name.')
      if (password.length < 8) return setError('Password must be at least 8 characters.')
      setPending(true)
      const result = await helpdesk.register({ name, email, department, password })
      setPending(false)
      if (!result.ok) setError(result.error)
      return
    }

    setPending(true)
    const result = await helpdesk.signIn(email, password)
    setPending(false)
    if (!result.ok) setError(result.error)
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <LifeBuoy className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-zinc-950">Relay Helpdesk</span>
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-balance text-xl font-semibold tracking-tight text-zinc-950">
            {mode === 'signin' ? 'Sign in to your workspace' : 'Create your account'}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {mode === 'signin'
              ? 'Report IT issues or manage the support queue.'
              : 'Employees can submit and track IT tickets.'}
          </p>

          <div role="tablist" aria-label="Authentication mode" className="mt-6 grid grid-cols-2 rounded-lg bg-zinc-100 p-1">
            {(['signin', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m)
                  setError(null)
                }}
                className={cn(
                  'rounded-md py-1.5 text-sm font-medium transition-colors',
                  mode === m ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-800',
                )}
              >
                {m === 'signin' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate={false}>
            {mode === 'register' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" autoComplete="name" required placeholder="Taylor Reed" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="department">Department</Label>
                  <select id="department" name="department" required className={selectClassName} defaultValue="Engineering">
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={mode === 'register' ? 8 : undefined}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
              {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
              {mode === 'signin' ? 'Sign in' : 'Create account'}
              {!pending && <ArrowRight aria-hidden="true" />}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-zinc-400">
            <span className="h-px flex-1 bg-zinc-200" />
            Quick demo access
            <span className="h-px flex-1 bg-zinc-200" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <DemoButton
              icon={ShieldCheck}
              title="Admin demo"
              subtitle="admin@company.com"
              onClick={() => helpdesk.demoLogin('admin')}
            />
            <DemoButton
              icon={UserRound}
              title="Employee demo"
              subtitle="jordan.lee@company.com"
              onClick={() => helpdesk.demoLogin('employee')}
            />
          </div>
          <p className="mt-4 text-center text-xs text-zinc-500">
            Demo accounts also accept the password <code className="font-mono text-zinc-700">{DEMO_PASSWORD}</code>.
          </p>
        </section>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
          <Headset className="size-3.5" aria-hidden="true" />
          Tip: open admin and employee in two tabs to watch tickets sync live.
        </p>
      </div>
    </main>
  )
}

function DemoButton({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: typeof ShieldCheck
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-xl border border-zinc-200 p-3 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-zinc-900"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 group-hover:bg-white">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-zinc-900">{title}</span>
        <span className="block truncate text-xs text-zinc-500">{subtitle}</span>
      </span>
    </button>
  )
}
