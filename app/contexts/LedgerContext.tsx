import React, { createContext, useContext, useState, useCallback } from 'react';
import { LedgerEntry, PaymentRecord } from '../types/types';

interface LedgerContextType {
  entries: LedgerEntry[];
  payments: Map<string, PaymentRecord[]>;
  loading: boolean;
  error: string | null;
  fetchEntries: (page?: number, limit?: number) => Promise<void>;
  addEntry: (entry: LedgerEntry) => void;
  updateStatus: (id: string, status: string) => Promise<void>;
  createEntry: (data: Partial<LedgerEntry>) => Promise<void>;
  confirmEntry: (entryId: string) => Promise<void>;
  rejectEntry: (entryId: string, reason: string) => Promise<void>;
  updateEntryStatus: (entryId: string, status: string) => Promise<void>;
  editEntry: (entryId: string, data: Partial<LedgerEntry>) => Promise<void>;
  deleteEntry: (entryId: string) => Promise<void>;
  recordPayment: (ledgerEntryId: string, amount: string, notes?: string) => Promise<void>;
  getPaymentsForEntry: (entryId: string) => Promise<void>;
  clearError: () => void;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export const useLedger = (): LedgerContextType => {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error('useLedger must be used within LedgerProvider');
  }
  return context;
};

interface LedgerProviderProps {
  children: React.ReactNode;
}

export const LedgerProvider: React.FC<LedgerProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [payments, setPayments] = useState<Map<string, PaymentRecord[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const fetchEntries = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ledger?page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries(data.data?.entries || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch entries';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEntry = useCallback((entry: LedgerEntry) => {
    setEntries([entry, ...entries]);
  }, [entries]);

  const updateStatus = useCallback(async (id: string, status: string) => {
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ledger/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      const result = await response.json();
      setEntries(entries.map((e) => (e._id === id || e.id === id ? result.data : e)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      setError(message);
      throw err;
    }
  }, [entries]);

  const createEntry = useCallback(async (data: Partial<LedgerEntry>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ledger`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create entry');
      const result = await response.json();
      setEntries([result.data, ...entries]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create entry';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entries]);

  const confirmEntry = useCallback(async (entryId: string) => {
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ledger/${entryId}/confirm`, {
        method: 'PATCH',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error('Failed to confirm entry');
      const result = await response.json();
      setEntries(entries.map((e) => (e._id === entryId || e.id === entryId ? result.data : e)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to confirm entry';
      setError(message);
      throw err;
    }
  }, [entries]);

  const rejectEntry = useCallback(async (entryId: string, reason: string) => {
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ledger/${entryId}/reject`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) throw new Error('Failed to reject entry');
      const result = await response.json();
      setEntries(entries.map((e) => (e._id === entryId || e.id === entryId ? result.data : e)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reject entry';
      setError(message);
      throw err;
    }
  }, [entries]);

  const updateEntryStatus = useCallback(async (entryId: string, status: string) => {
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ledger/${entryId}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      const result = await response.json();
      setEntries(entries.map((e) => (e._id === entryId || e.id === entryId ? result.data : e)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      setError(message);
      throw err;
    }
  }, [entries]);

  const editEntry = useCallback(async (entryId: string, data: Partial<LedgerEntry>) => {
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ledger/${entryId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to edit entry');
      const result = await response.json();
      setEntries(entries.map((e) => (e._id === entryId || e.id === entryId ? result.data : e)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to edit entry';
      setError(message);
      throw err;
    }
  }, [entries]);

  const deleteEntry = useCallback(async (entryId: string) => {
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ledger/${entryId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error('Failed to delete entry');
      setEntries(entries.filter((e) => e._id !== entryId && e.id !== entryId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete entry';
      setError(message);
      throw err;
    }
  }, [entries]);

  const recordPayment = useCallback(async (ledgerEntryId: string, amount: string, notes?: string) => {
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ ledgerEntryId, amount, notes }),
      });

      if (!response.ok) throw new Error('Failed to record payment');
      const result = await response.json();
      const entryPayments = payments.get(ledgerEntryId) || [];
      setPayments(new Map(payments).set(ledgerEntryId, [...entryPayments, result.data]));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to record payment';
      setError(message);
      throw err;
    }
  }, [payments]);

  const getPaymentsForEntry = useCallback(async (entryId: string) => {
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/entry/${entryId}`, {
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      setPayments(new Map(payments).set(entryId, data.data || []));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch payments';
      setError(message);
    }
  }, [payments]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: LedgerContextType = {
    entries,
    payments,
    loading,
    error,
    fetchEntries,
    addEntry,
    updateStatus,
    createEntry,
    confirmEntry,
    rejectEntry,
    updateEntryStatus,
    editEntry,
    deleteEntry,
    recordPayment,
    getPaymentsForEntry,
    clearError,
  };

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
};

export default LedgerContext;
