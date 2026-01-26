
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
  avatar?: string; // This holds the tailwind background class
  password?: string; // For simulation
}

export interface LedgerEntry {
  id: string;
  creatorId: string; // The user who created the record
  targetUserId: string; // The user on the other side of the transaction
  amount: string;
  type: TransactionType;
  direction: Direction; // Perspective of the CREATOR
  status: TransactionStatus;
  dueDate?: string;
  notes: string;
  isConfirmed: boolean;
  createdAt: string;
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
