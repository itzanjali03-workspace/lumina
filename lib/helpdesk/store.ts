'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { DEMO_EMPLOYEE_ID, DEMO_PASSWORD, ADMIN_ID, createSeedData } from './seed'
import { hashPassword } from './format'
import type { Department, HelpdeskData, Priority, Ticket, User } from './types'

const DATA_KEY = 'helpdesk:data:v1'
// Session lives in sessionStorage so two tabs can be signed in as different roles
// and watch each other's changes arrive through the shared localStorage data.
const SESSION_KEY = 'helpdesk:session:v1'

interface Snapshot {
  data: HelpdeskData
  sessionUserId: string | null
}

let cached: Snapshot | null = null
const listeners = new Set<() => void>()
let storageListenerAttached = false

function readData(): HelpdeskData {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    if (raw) return JSON.parse(raw) as HelpdeskData
  } catch {
    // fall through to a fresh seed when storage is corrupted or unavailable
  }
  const seed = createSeedData()
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(seed))
  } catch {}
  return seed
}

function getSnapshot(): Snapshot {
  if (!cached) {
    let sessionUserId: string | null = null
    try {
      sessionUserId = sessionStorage.getItem(SESSION_KEY)
    } catch {}
    cached = { data: readData(), sessionUserId }
  }
  return cached
}

function getServerSnapshot(): Snapshot | null {
  return null
}

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!storageListenerAttached) {
    storageListenerAttached = true
    window.addEventListener('storage', (event) => {
      if (event.key !== DATA_KEY) return
      const current = getSnapshot()
      cached = { ...current, data: readData() }
      emit()
    })
  }
  return () => listeners.delete(listener)
}

function writeData(update: (data: HelpdeskData) => HelpdeskData) {
  const current = getSnapshot()
  const data = update(current.data)
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
  } catch {}
  cached = { ...current, data }
  emit()
}

function setSession(userId: string | null) {
  try {
    if (userId) sessionStorage.setItem(SESSION_KEY, userId)
    else sessionStorage.removeItem(SESSION_KEY)
  } catch {}
  cached = { ...getSnapshot(), sessionUserId: userId }
  emit()
}

export function useHelpdesk() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const currentUser = snapshot
    ? (snapshot.data.users.find((u) => u.id === snapshot.sessionUserId) ?? null)
    : null
  return { ready: snapshot !== null, data: snapshot?.data ?? null, currentUser }
}

export function useNow(intervalMs = 10_000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

export interface NewTicketInput {
  subject: string
  description: string
  department: Department
  priority: Priority
  requesterId: string | null
  customerName: string
  customerEmail: string
  assigneeId?: string | null
}

export const helpdesk = {
  createTicket(input: NewTicketInput) {
    const now = Date.now()
    writeData((data) => {
      const ticket: Ticket = {
        id: `tk_${now.toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
        number: data.nextNumber,
        requesterId: input.requesterId,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        subject: input.subject,
        description: input.description,
        department: input.department,
        priority: input.priority,
        status: 'open',
        assigneeId: input.assigneeId ?? null,
        isReply: false,
        createdAt: now,
        lastMessageAt: now,
      }
      return { ...data, tickets: [ticket, ...data.tickets], nextNumber: data.nextNumber + 1 }
    })
  },

  updateTicket(id: string, patch: Partial<Pick<Ticket, 'priority' | 'status' | 'assigneeId'>>) {
    writeData((data) => ({
      ...data,
      tickets: data.tickets.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }))
  },

  deleteTicket(id: string) {
    writeData((data) => ({ ...data, tickets: data.tickets.filter((t) => t.id !== id) }))
  },

  async register(input: { name: string; email: string; department: Department; password: string }) {
    const email = input.email.trim().toLowerCase()
    const { data } = getSnapshot()
    if (data.users.some((u) => u.email === email)) {
      return { ok: false as const, error: 'An account with this email already exists.' }
    }
    const user: User = {
      id: `u_${Date.now().toString(36)}`,
      name: input.name.trim(),
      email,
      department: input.department,
      role: 'employee',
      passwordHash: await hashPassword(input.password),
    }
    writeData((d) => ({ ...d, users: [...d.users, user] }))
    setSession(user.id)
    return { ok: true as const }
  },

  async signIn(emailInput: string, password: string) {
    const email = emailInput.trim().toLowerCase()
    const user = getSnapshot().data.users.find((u) => u.email === email)
    const valid = user
      ? user.passwordHash
        ? user.passwordHash === (await hashPassword(password))
        : password === DEMO_PASSWORD
      : false
    if (!user || !valid) return { ok: false as const, error: 'Incorrect email or password.' }
    setSession(user.id)
    return { ok: true as const }
  },

  demoLogin(role: 'admin' | 'employee') {
    setSession(role === 'admin' ? ADMIN_ID : DEMO_EMPLOYEE_ID)
  },

  signOut() {
    setSession(null)
  },

  resetDemoData() {
    writeData((data) => ({ ...createSeedData(), users: data.users }))
  },
}
