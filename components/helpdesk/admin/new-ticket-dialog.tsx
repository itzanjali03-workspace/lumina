'use client'

import type { FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { helpdesk } from '@/lib/helpdesk/store'
import { TEAMMATES } from '@/lib/helpdesk/seed'
import { readTicketFields, TicketFields } from '../ticket-fields'
import { selectClassName } from '../auth-screen'

export function NewTicketDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const fields = readTicketFields(form)
    const customerName = String(form.get('customerName') ?? '').trim()
    const customerEmail = String(form.get('customerEmail') ?? '').trim().toLowerCase()
    const assigneeId = String(form.get('assigneeId') ?? '') || null
    if (!fields.subject || !fields.description || !customerName || !customerEmail) return

    helpdesk.createTicket({ ...fields, customerName, customerEmail, requesterId: null, assigneeId })
    toast.success('Ticket created', { description: fields.subject })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New ticket</DialogTitle>
          <DialogDescription>Log an issue on behalf of an employee.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nt-name">Requester name</Label>
              <Input id="nt-name" name="customerName" required placeholder="Taylor Reed" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nt-email">Requester email</Label>
              <Input id="nt-email" name="customerEmail" type="email" required placeholder="taylor@company.com" />
            </div>
          </div>
          <TicketFields idPrefix="nt" />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nt-assignee">Assign to</Label>
            <select id="nt-assignee" name="assigneeId" defaultValue="" className={selectClassName}>
              <option value="">Unassigned</option>
              {TEAMMATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create ticket</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
