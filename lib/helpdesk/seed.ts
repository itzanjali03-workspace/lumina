import type { HelpdeskData, Teammate, Ticket, User } from './types'

export const ADMIN_ID = 'u_admin'
export const DEMO_EMPLOYEE_ID = 'u_jordan'
export const DEMO_PASSWORD = 'demo1234'

export const TEAMMATES: Teammate[] = [
  { id: ADMIN_ID, name: 'Alex Morgan', title: 'IT Lead' },
  { id: 't_lila', name: 'Lila Carter', title: 'Support Engineer' },
  { id: 't_nina', name: 'Nina Patel', title: 'Systems Admin' },
  { id: 't_ethan', name: 'Ethan Brooks', title: 'Network Engineer' },
  { id: 't_nova', name: 'Nova Starling', title: 'Desktop Support' },
]

const SEED_USERS: User[] = [
  {
    id: ADMIN_ID,
    name: 'Alex Morgan',
    email: 'admin@company.com',
    department: 'Engineering',
    role: 'admin',
  },
  {
    id: DEMO_EMPLOYEE_ID,
    name: 'Jordan Lee',
    email: 'jordan.lee@company.com',
    department: 'Design',
    role: 'employee',
  },
]

type SeedRow = Omit<Ticket, 'id' | 'number' | 'createdAt' | 'lastMessageAt'> & {
  minutesAgo: number
}

const MIN = 60_000

const ROWS: SeedRow[] = [
  { requesterId: null, customerName: 'Ella Rivers', customerEmail: 'ella.rivers@company.com', subject: 'Laptop will not boot after update', description: 'My MacBook shows a black screen after the latest OS update. I tried an SMC reset with no luck.', department: 'Sales', priority: 'low', status: 'pending', assigneeId: 't_lila', isReply: false, minutesAgo: 0.25 },
  { requesterId: DEMO_EMPLOYEE_ID, customerName: 'Jordan Lee', customerEmail: 'jordan.lee@company.com', subject: 'Figma license request', description: 'I need a Figma Professional seat for the new brand project starting Monday.', department: 'Design', priority: 'medium', status: 'open', assigneeId: null, isReply: true, minutesAgo: 2 },
  { requesterId: null, customerName: 'John Whale', customerEmail: 'john.whale@company.com', subject: 'VPN keeps disconnecting', description: 'The VPN drops every 10 minutes when working from home. Error code 809.', department: 'Finance', priority: 'medium', status: 'solved', assigneeId: 't_nina', isReply: false, minutesAgo: 14 },
  { requesterId: null, customerName: 'Kate Morgan', customerEmail: 'k.morgan@company.com', subject: 'Conference room display offline', description: 'The display in Atlas room is not detecting any HDMI input. Board meeting at 3pm.', department: 'HR', priority: 'urgent', status: 'open', assigneeId: 't_ethan', isReply: false, minutesAgo: 31 },
  { requesterId: null, customerName: 'Liam Rivers', customerEmail: 'liam.rivers@company.com', subject: 'Need access to repo #54321', description: 'Please grant write access to the payments-service repository.', department: 'Engineering', priority: 'medium', status: 'closed', assigneeId: null, isReply: false, minutesAgo: 120 },
  { requesterId: null, customerName: 'Sophia Bennett', customerEmail: 'sophia.bennett@company.com', subject: 'Following up on monitor order', description: 'Checking on the status of the 27" monitor ordered two weeks ago.', department: 'Design', priority: 'high', status: 'open', assigneeId: null, isReply: false, minutesAgo: 135 },
  { requesterId: null, customerName: 'Noah Carter', customerEmail: 'noah.carter@company.com', subject: 'Outlook calendar not syncing', description: 'Calendar invites are not showing on my phone. Desktop is fine.', department: 'Sales', priority: 'low', status: 'pending', assigneeId: 't_nova', isReply: false, minutesAgo: 150 },
  { requesterId: null, customerName: 'Mia Thompson', customerEmail: 'mia.thompson@company.com', subject: 'I would like to ask about my new hire setup', description: 'A new hire starts next week. What do I need to submit for hardware and accounts?', department: 'HR', priority: 'low', status: 'open', assigneeId: 't_nova', isReply: true, minutesAgo: 240 },
  { requesterId: null, customerName: 'Oliver Grant', customerEmail: 'oliver.grant@company.com', subject: 'Printer jam on 3rd floor', description: 'The large printer near the kitchen is jammed and showing error E-302.', department: 'Finance', priority: 'medium', status: 'on_hold', assigneeId: 't_lila', isReply: false, minutesAgo: 300 },
  { requesterId: null, customerName: 'Ava Martinez', customerEmail: 'ava.martinez@company.com', subject: 'Phishing email reported', description: 'Received an email asking me to reset my password via an unknown link. Forwarded to security.', department: 'Finance', priority: 'urgent', status: 'open', assigneeId: ADMIN_ID, isReply: false, minutesAgo: 340 },
  { requesterId: null, customerName: 'Ethan Wright', customerEmail: 'ethan.wright@company.com', subject: 'Docker Desktop license', description: 'Docker Desktop is prompting for a license. Can we get one under the team plan?', department: 'Engineering', priority: 'medium', status: 'open', assigneeId: ADMIN_ID, isReply: false, minutesAgo: 410 },
  { requesterId: null, customerName: 'Grace Kim', customerEmail: 'grace.kim@company.com', subject: 'Salesforce SSO error', description: 'Getting "SAML response invalid" when logging into Salesforce via SSO.', department: 'Sales', priority: 'high', status: 'pending', assigneeId: 't_nina', isReply: true, minutesAgo: 520 },
  { requesterId: null, customerName: 'Henry Adams', customerEmail: 'henry.adams@company.com', subject: 'Keyboard replacement', description: 'Several keys on my keyboard stopped working after a coffee spill.', department: 'Engineering', priority: 'low', status: 'solved', assigneeId: 't_nova', isReply: false, minutesAgo: 700 },
  { requesterId: null, customerName: 'Isla Turner', customerEmail: 'isla.turner@company.com', subject: 'Payroll portal access', description: 'I cannot log into the payroll portal. It says my account is locked.', department: 'HR', priority: 'high', status: 'open', assigneeId: null, isReply: false, minutesAgo: 860 },
  { requesterId: null, customerName: 'Lucas Brown', customerEmail: 'lucas.brown@company.com', subject: 'Slow Wi-Fi in east wing', description: 'Wi-Fi speeds in the east wing are under 5 Mbps since Tuesday.', department: 'Engineering', priority: 'medium', status: 'on_hold', assigneeId: 't_ethan', isReply: false, minutesAgo: 1100 },
  { requesterId: null, customerName: 'Zoe Walker', customerEmail: 'zoe.walker@company.com', subject: 'Adobe Creative Cloud install fails', description: 'Installer fails at 42% with error code 183.', department: 'Design', priority: 'medium', status: 'open', assigneeId: null, isReply: false, minutesAgo: 1300 },
  { requesterId: null, customerName: 'Mason Hall', customerEmail: 'mason.hall@company.com', subject: 'Expense tool export broken', description: 'CSV export from the expense tool downloads an empty file.', department: 'Finance', priority: 'high', status: 'open', assigneeId: ADMIN_ID, isReply: false, minutesAgo: 1500 },
  { requesterId: null, customerName: 'Chloe Young', customerEmail: 'chloe.young@company.com', subject: 'Second monitor request', description: 'Requesting a second monitor for data analysis work.', department: 'Sales', priority: 'low', status: 'closed', assigneeId: 't_lila', isReply: false, minutesAgo: 2000 },
  { requesterId: null, customerName: 'Jack Scott', customerEmail: 'jack.scott@company.com', subject: 'MFA device lost', description: 'Lost my phone with the authenticator app. Need MFA reset to log in.', department: 'Sales', priority: 'urgent', status: 'pending', assigneeId: 't_nina', isReply: false, minutesAgo: 2600 },
  { requesterId: null, customerName: 'Lily Green', customerEmail: 'lily.green@company.com', subject: 'Shared drive permissions', description: 'The HR shared drive shows read-only for me since the migration.', department: 'HR', priority: 'medium', status: 'open', assigneeId: null, isReply: true, minutesAgo: 3200 },
]

export function createSeedData(now = Date.now()): HelpdeskData {
  const tickets: Ticket[] = ROWS.map(({ minutesAgo, ...row }, index) => {
    const lastMessageAt = now - Math.round(minutesAgo * MIN)
    return {
      ...row,
      id: `tk_seed_${index + 1}`,
      number: 1000 + ROWS.length - index,
      createdAt: lastMessageAt - 30 * MIN,
      lastMessageAt,
    }
  })

  return {
    users: SEED_USERS,
    tickets,
    nextNumber: 1000 + ROWS.length + 1,
  }
}
