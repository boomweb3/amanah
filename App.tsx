
import React, { useState, useEffect, useCallback } from 'react';
import { LedgerEntry, TransactionStatus, TransactionType, Direction, User, AppNotification, ReminderSettings, PaymentRecord, RetractionRecord } from './types';
import Dashboard from './views/Dashboard';
import LedgerForm from './views/LedgerForm';
import Login from './views/Login';
import GuestVerification from './views/GuestVerification';
import Settings from './views/Settings';
import AmanahHistory from './views/AmanahHistory';
import RecordDetail from './views/RecordDetail';
import Layout from './components/Layout';

const STORAGE_KEYS = {
  USERS: 'amaanah_users',
  ENTRIES: 'amaanah_entries',
  SESSION: 'amaanah_session',
  THEME: 'amaanah_theme',
  NOTIFICATIONS: 'amaanah_notifications',
  TRIGGERED_REMS: 'amaanah_triggered_reminders'
};

const INITIAL_USERS: User[] = [];

const INITIAL_ENTRIES: LedgerEntry[] = [];

export type AppTab = 'ledger' | 'new-entry' | 'history' | 'settings' | 'record-detail';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return (saved as 'light' | 'dark') || 'light';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION);
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [entries, setEntries] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<AppTab>('ledger');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-primary', '#047857');
    document.documentElement.style.setProperty('--accent-soft', '#ecfdf5');
    document.documentElement.style.setProperty('--accent-dark', '#064e3b');
    document.documentElement.style.setProperty('--accent-text', '#047857');
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, [currentUser]);

  const checkReminders = useCallback(() => {
    if (!currentUser || !currentUser.reminderSettings?.enabled) return;
    const triggered = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIGGERED_REMS) || '{}');
    const newNotifications: AppNotification[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    entries.forEach(entry => {
      if (!entry.dueDate || [TransactionStatus.FULFILLED, TransactionStatus.FORGIVEN, TransactionStatus.CHARITY].includes(entry.status)) return;
      const isMyResponsibility = (entry.creatorId === currentUser.id && entry.direction === Direction.I_OWE) || (entry.targetUserId === currentUser.id && entry.direction === Direction.OWED_TO_ME);
      if (!isMyResponsibility) return;

      const dueDate = new Date(entry.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const checkInterval = (days: number, key: 'sevenDay' | 'oneDay') => {
        const triggerKey = `${entry.id}_${key}`;
        if (diffDays <= days && diffDays > 0 && currentUser.reminderSettings?.[key] && !triggered[triggerKey]) {
          newNotifications.push({
            id: `notif-${Math.random().toString(36).substr(2, 9)}`,
            userId: currentUser.id,
            entryId: entry.id,
            title: 'Gentle Reminder',
            message: diffDays === 1 
              ? `A trust with ${entry.partnerName} for ${entry.amount} is nearing fulfillment tomorrow.` 
              : `A trust with ${entry.partnerName} for ${entry.amount} is approaching its due date in ${diffDays} days.`,
            createdAt: new Date().toISOString(),
            isRead: false
          });
          triggered[triggerKey] = true;
        }
      };
      checkInterval(7, 'sevenDay');
      checkInterval(1, 'oneDay');
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
      localStorage.setItem(STORAGE_KEYS.TRIGGERED_REMS, JSON.stringify(triggered));
    }
  }, [currentUser, entries]);

  useEffect(() => {
    checkReminders();
  }, [checkReminders]);

  const handleUpdateStatus = (id: string, status: TransactionStatus) => {
    const resolved = [TransactionStatus.FULFILLED, TransactionStatus.FORGIVEN, TransactionStatus.CHARITY].includes(status);
    if (status === TransactionStatus.FORGIVEN && currentUser) {
      const entry = entries.find(e => e.id === id);
      if (entry) {
        const debtorId = (entry.creatorId === currentUser.id && entry.direction === Direction.I_OWE) ? entry.creatorId : entry.targetUserId;
        const isCurrentCreditor = (entry.creatorId === currentUser.id && entry.direction === Direction.OWED_TO_ME) || (entry.targetUserId === currentUser.id && entry.direction === Direction.I_OWE);
        if (isCurrentCreditor && debtorId) {
          setNotifications(prev => [{
            id: `notif-${Math.random().toString(36).substr(2, 9)}`,
            userId: debtorId,
            entryId: entry.id,
            title: 'Act of Grace',
            message: `The trust for ${entry.amount} with ${currentUser.name} has been forgiven and cleared.`,
            createdAt: new Date().toISOString(),
            isRead: false
          }, ...prev]);
        }
      }
    }

    setEntries(prev => prev.map(e => e.id === id ? { 
      ...e, 
      status, 
      isConfirmed: status === TransactionStatus.CONFIRMED ? true : e.isConfirmed,
      confirmedAt: (status === TransactionStatus.CONFIRMED || status === TransactionStatus.PARTIALLY_FULFILLED) ? (e.confirmedAt || new Date().toISOString()) : e.confirmedAt,
      resolvedAt: resolved ? new Date().toISOString() : e.resolvedAt,
      remainingAmount: status === TransactionStatus.FULFILLED ? 0 : e.remainingAmount
    } : e));
  };

  const handlePartialPayment = (id: string, paymentAmount: number) => {
    setEntries(prev => prev.map(e => {
      if (e.id === id && e.numericAmount !== undefined) {
        const currentRemaining = e.remainingAmount ?? e.numericAmount;
        const newRemaining = Math.max(0, currentRemaining - paymentAmount);
        const newPayment: PaymentRecord = { id: Math.random().toString(36).substr(2, 9), amount: paymentAmount, date: new Date().toISOString() };
        const isNowFulfilled = newRemaining <= 0;
        return {
          ...e,
          remainingAmount: newRemaining,
          paymentLog: [...(e.paymentLog || []), newPayment],
          status: isNowFulfilled ? TransactionStatus.FULFILLED : TransactionStatus.PARTIALLY_FULFILLED,
          resolvedAt: isNowFulfilled ? new Date().toISOString() : e.resolvedAt
        };
      }
      return e;
    }));
  };

  const handleRetractResolution = (id: string) => {
    if (!currentUser) return;
    
    setEntries(prev => prev.map(e => {
      if (e.id === id) {
        // Eligibility check
        if (![TransactionStatus.FULFILLED, TransactionStatus.PARTIALLY_FULFILLED].includes(e.status)) return e;

        const previousStatus = e.status;
        const newRetraction: RetractionRecord = {
          id: `retract-${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString(),
          previousStatus,
          initiatorId: currentUser.id
        };

        // Recalculate remaining amount from scratch to ensure consistency
        // (total amount minus non-reverted payments)
        let newRemaining = e.numericAmount ?? 0;
        if (e.numericAmount !== undefined && e.paymentLog) {
          const totalPaid = e.paymentLog
            .filter(p => !p.isReverted)
            .reduce((acc, p) => acc + p.amount, 0);
          newRemaining = Math.max(0, e.numericAmount - totalPaid);
        }

        // Send notification to partner
        const partnerId = (e.creatorId === currentUser.id) ? e.targetUserId : e.creatorId;
        if (partnerId) {
          setNotifications(prevN => [{
            id: `notif-${Math.random().toString(36).substr(2, 9)}`,
            userId: partnerId,
            entryId: e.id,
            title: 'Ledger Update',
            message: `The resolution for the trust for ${e.amount} has been retracted for adjustment.`,
            createdAt: new Date().toISOString(),
            isRead: false
          }, ...prevN]);
        }

        return {
          ...e,
          status: newRemaining > 0 ? (e.paymentLog && e.paymentLog.filter(p => !p.isReverted).length > 0 ? TransactionStatus.PARTIALLY_FULFILLED : TransactionStatus.CONFIRMED) : TransactionStatus.FULFILLED,
          remainingAmount: newRemaining,
          resolvedAt: undefined,
          retractionHistory: [...(e.retractionHistory || []), newRetraction]
        };
      }
      return e;
    }));
  };

  const handleViewDetail = (id: string) => {
    setSelectedEntryId(id);
    setActiveTab('record-detail');
  };

  return (
    <Layout 
      activeTab={activeTab} setActiveTab={setActiveTab} 
      currentUser={currentUser} onLogout={() => setCurrentUser(null)}
      theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
      notifications={notifications}
      onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))}
      onClearAll={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
    >
      {!currentUser ? (
        <Login onLogin={(e, p) => {
          const u = registeredUsers.find(u => u.email === e && u.password === p);
          if (u) { setCurrentUser(u); setAuthError(null); } else { setAuthError('Invalid email or password.'); }
        }} onSignUp={(u) => {
          if (registeredUsers.find(old => old.email === u.email)) { setAuthError('Email already exists.'); return; }
          const uWithRem = { ...u, reminderSettings: { enabled: true, sevenDay: true, oneDay: true } };
          setRegisteredUsers(prev => [...prev, uWithRem]); setCurrentUser(uWithRem); setAuthError(null);
        }} error={authError} theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />
      ) : (
        <>
          {activeTab === 'ledger' && (
            <Dashboard 
              entries={entries} currentUser={currentUser} users={registeredUsers} 
              onUpdateStatus={handleUpdateStatus} 
              onConfirmEntry={(id) => handleUpdateStatus(id, TransactionStatus.CONFIRMED)} 
              onPartialPayment={handlePartialPayment}
              onAddEntry={() => setActiveTab('new-entry')} 
              onViewDetail={handleViewDetail}
            />
          )}
          {activeTab === 'new-entry' && (
            <LedgerForm onAdd={(e) => { setEntries([e, ...entries]); setActiveTab('ledger'); }} onCancel={() => setActiveTab('ledger')} currentUser={currentUser} users={registeredUsers} />
          )}
          {activeTab === 'history' && (
            <AmanahHistory entries={entries} currentUser={currentUser} users={registeredUsers} onDeleteEntry={(id) => setEntries(prev => prev.filter(e => e.id !== id))} onViewDetail={handleViewDetail} />
          )}
          {activeTab === 'settings' && (
            <Settings currentUser={currentUser} onUpdateUser={(u) => { setRegisteredUsers(prev => prev.map(old => old.id === u.id ? u : old)); setCurrentUser(u); }} />
          )}
          {activeTab === 'record-detail' && selectedEntryId && (
            <RecordDetail 
              entryId={selectedEntryId} 
              entries={entries} 
              currentUser={currentUser} 
              users={registeredUsers}
              onBack={() => setActiveTab('ledger')}
              onUpdateStatus={handleUpdateStatus}
              onPartialPayment={handlePartialPayment}
              onRetractResolution={handleRetractResolution}
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
