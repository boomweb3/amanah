
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

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; 
  password?: string;
}

export interface LedgerEntry {
  id: string;
  creatorId: string;
  partnerName: string; // The primary name identifier for the record
  targetUserId?: string; // Optional linkage to a registered user for verification
  amount: string;
  type: TransactionType;
  direction: Direction;
  status: TransactionStatus;
  dueDate?: string;
  notes: string;
  isConfirmed: boolean;
  createdAt: string;
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
