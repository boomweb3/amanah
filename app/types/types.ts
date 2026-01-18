
// Transaction Types
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

export enum DebtStatus {
  ACTIVE = 'Active',
  PAID = 'Paid'
}

export enum Direction {
  I_OWE = 'I Owe',
  OWED_TO_ME = 'Owed to Me'
}

// User Interface
export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Ledger Entry Interface
export interface LedgerEntry {
  _id?: string;
  id?: string;
  creatorId: string;
  targetUserId: string;
  amount: string;
  type: string;
  direction: string;
  status: string;
  dueDate?: string;
  notes: string;
  isConfirmed: boolean;
  confirmedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Payment Record
export interface PaymentRecord {
  _id?: string;
  id?: string;
  ledgerEntryId: string;
  paidBy: string;
  amount: string;
  paymentDate: string;
  notes?: string;
  createdAt?: string;
}

// Notification Interface
export interface Notification {
  _id?: string;
  id?: string;
  userId: string;
  type: string;
  relatedEntryId?: string;
  relatedUserId?: string;
  message: string;
  read: boolean;
  createdAt?: string;
}

// API Response Types
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
