'use client'

import { useHelpdesk } from '@/lib/helpdesk/store'
import { AuthScreen } from './auth-screen'
import { EmployeePortal } from './employee-portal'
import { AdminConsole } from './admin/admin-console'

export function HelpdeskApp() {
  const { ready, data, currentUser } = useHelpdesk()

  if (!ready || !data) {
    return (
      <div className="flex h-dvh items-center justify-center bg-zinc-100" role="status">
        <span className="sr-only">Loading HelpDesk</span>
        <span className="size-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    )
  }

  if (!currentUser) return <AuthScreen />
  if (currentUser.role === 'admin') return <AdminConsole user={currentUser} data={data} />
  return <EmployeePortal user={currentUser} data={data} />
}
