import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { DEPARTMENTS, PRIORITIES, type Department, type Priority } from '@/lib/helpdesk/types'
import { PRIORITY_META, PriorityIcon } from './badges'
import { selectClassName } from './auth-screen'

export function TicketFields({
  idPrefix,
  defaultDepartment,
}: {
  idPrefix: string
  defaultDepartment?: Department
}) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-subject`}>Subject / issue title</Label>
        <Input
          id={`${idPrefix}-subject`}
          name="subject"
          required
          maxLength={120}
          placeholder="e.g. Laptop won't connect to office Wi-Fi"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-department`}>Department</Label>
        <select
          id={`${idPrefix}-department`}
          name="department"
          defaultValue={defaultDepartment ?? 'Engineering'}
          className={selectClassName}
        >
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium">Urgency / priority</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[...PRIORITIES].reverse().map((p) => (
            <label
              key={p}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm transition-colors hover:bg-zinc-50',
                'has-checked:border-zinc-900 has-checked:bg-zinc-50 has-checked:ring-1 has-checked:ring-zinc-900',
                'has-focus-visible:ring-2 has-focus-visible:ring-zinc-900/30',
              )}
            >
              <input type="radio" name="priority" value={p} defaultChecked={p === 'medium'} className="sr-only" />
              <PriorityIcon priority={p as Priority} />
              {PRIORITY_META[p].label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-description`}>Issue description</Label>
        <Textarea
          id={`${idPrefix}-description`}
          name="description"
          required
          rows={5}
          maxLength={2000}
          placeholder="Describe what happened, any error messages, and hardware symptoms."
          className="resize-y"
        />
      </div>
    </>
  )
}

export function readTicketFields(form: FormData) {
  return {
    subject: String(form.get('subject') ?? '').trim(),
    description: String(form.get('description') ?? '').trim(),
    department: (String(form.get('department') ?? 'Engineering') as Department),
    priority: (String(form.get('priority') ?? 'medium') as Priority),
  }
}
