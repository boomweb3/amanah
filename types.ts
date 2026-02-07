
export enum TransactionType {
  DEBT = 'Debt',
  AMANAH = 'Amānah'
}

export enum TransactionStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  FULFILLED = 'Fulfilled',
  FORGIVEN = 'Forgiven',
  CHARITY = 'Converted to Charity'
}

export enum Direction {
  I_OWE = 'I Owe',
  OWED_TO_ME = 'Owed to Me'
}

export interface ReminderSettings {
  enabled: boolean;
  sevenDay: boolean;
  oneDay: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; 
  password?: string;
  reminderSettings?: ReminderSettings;
}

export interface AppNotification {
  id: string;
  userId: string; // Target recipient
  entryId: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
}

export interface LedgerEntry {
  id: string;
  creatorId: string;
  partnerName: string; 
  targetUserId?: string; 
  amount: string; // Display amount
  numericAmount?: number; // Internal numeric value for debts
  remainingAmount?: number; // Remaining balance
  paymentLog?: PaymentRecord[]; // History of partial payments
  type: TransactionType;
  direction: Direction;
  status: TransactionStatus;
  dueDate?: string;
  notes: string;
  isConfirmed: boolean;
  requireVerification: boolean; // NEW: conditional lock
  createdAt: string;
  confirmedAt?: string; // NEW: tracking verification date
  resolvedAt?: string;
}

export enum DebtStatus {
  ACTIVE = 'Active',
  PAID = 'Paid'
}

export interface Debt {
  id: string;
  creditor: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  category: string;
  notes: string;
  status: DebtStatus;
  createdAt: string;
}

export interface Supporter {
  id: string;
  name: string;
  relation: string;
  contributionTotal: number;
}
