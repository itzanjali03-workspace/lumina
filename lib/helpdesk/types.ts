export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type Status = 'open' | 'pending' | 'on_hold' | 'solved' | 'closed'
export type Role = 'admin' | 'employee'

export const DEPARTMENTS = ['Engineering', 'Design', 'Sales', 'HR', 'Finance'] as const
export type Department = (typeof DEPARTMENTS)[number]

export const PRIORITIES: Priority[] = ['urgent', 'high', 'medium', 'low']
export const STATUSES: Status[] = ['open', 'pending', 'on_hold', 'solved', 'closed']

export interface User {
  id: string
  name: string
  email: string
  department: Department
  role: Role
  passwordHash?: string
}

export interface Teammate {
  id: string
  name: string
  title: string
}

export interface Ticket {
  id: string
  number: number
  requesterId: string | null
  customerName: string
  customerEmail: string
  subject: string
  description: string
  department: Department
  priority: Priority
  status: Status
  assigneeId: string | null
  isReply: boolean
  createdAt: number
  lastMessageAt: number
}

export interface HelpdeskData {
  users: User[]
  tickets: Ticket[]
  nextNumber: number
}

export type InboxView =
  | { kind: 'all' }
  | { kind: 'unassigned' }
  | { kind: 'mine' }
  | { kind: 'status'; status: Status }
  | { kind: 'department'; department: Department }
