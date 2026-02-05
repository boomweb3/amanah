
import React, { useState, useEffect, useCallback } from 'react';
import { LedgerEntry, TransactionStatus, TransactionType, Direction, User, AppNotification, ReminderSettings, PaymentRecord } from './types';
import Dashboard from './views/Dashboard';
import LedgerForm from './views/LedgerForm';
import Login from './views/Login';
import GuestVerification from './views/GuestVerification';
import Settings from './views/Settings';
import AmanahHistory from './views/AmanahHistory';
import Layout from './components/Layout';

const STORAGE_KEYS = {
  USERS: 'amaanah_users',
  ENTRIES: 'amaanah_entries',
  SESSION: 'amaanah_session',
  THEME: 'amaanah_theme',
  NOTIFICATIONS: 'amaanah_notifications',
  TRIGGERED_REMS: 'amaanah_triggered_reminders'
};

const INITIAL_USERS: User[] = [
  { id: 'user-1', name: 'Omar Farooq', email: 'omar@example.com', password: 'password', reminderSettings: { enabled: true, sevenDay: true, oneDay: true } },
  { id: 'user-2', name: 'Fatima Zahra', email: 'fatima@example.com', password: 'password', reminderSettings: { enabled: true, sevenDay: true, oneDay: true } },
  { id: 'user-3', name: 'John Doe', email: 'john@example.com', password: 'password', reminderSettings: { enabled: true, sevenDay: true, oneDay: true } },
  { id: 'user-4', name: 'Zainab Ahmed', email: 'zainab@example.com', password: 'password', reminderSettings: { enabled: true, sevenDay: true, oneDay: true } },
];

const INITIAL_ENTRIES: LedgerEntry[] = [
  {
    id: 'entry-1',
    creatorId: 'user-1',
    targetUserId: 'user-3',
    partnerName: 'John Doe',
    amount: '$250',
    numericAmount: 250,
    remainingAmount: 250,
    paymentLog: [],
    type: TransactionType.DEBT,
    direction: Direction.I_OWE,
    status: TransactionStatus.CONFIRMED,
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // 5 days from now
    notes: 'Car repair loan - mutual agreement.',
    isConfirmed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'entry-2',
    creatorId: 'user-2',
    targetUserId: 'user-1',
    partnerName: 'Omar Farooq',
    amount: 'Gold Ring',
    type: TransactionType.AMANAH,
    direction: Direction.OWED_TO_ME,
    status: TransactionStatus.PENDING,
    notes: 'Safekeeping for travel. Handed over on 15th.',
    isConfirmed: false,
    createdAt: new Date().toISOString()
  }
];

export type AppTab = 'ledger' | 'new-entry' | 'history' | 'settings';

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

  // Gentle Reminder Logic
  const checkReminders = useCallback(() => {
    if (!currentUser || !currentUser.reminderSettings?.enabled) return;

    const triggered = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRIGGERED_REMS) || '{}');
    const newNotifications: AppNotification[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    entries.forEach(entry => {
      if (!entry.dueDate || [TransactionStatus.FULFILLED, TransactionStatus.FORGIVEN, TransactionStatus.CHARITY].includes(entry.status)) return;
      
      const isMyResponsibility = entry.creatorId === currentUser.id && entry.direction === Direction.I_OWE;
      if (!isMyResponsibility) return;

      const dueDate = new Date(entry.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const checkInterval = (days: number, key: 'sevenDay' | 'oneDay') => {
        const triggerKey = `${entry.id}_${key}`;
        if (diffDays <= days && diffDays > 0 && currentUser.reminderSettings?.[key] && !triggered[triggerKey]) {
          newNotifications.push({
            id: `notif-${Math.random().toString(36).substr(2, 9)}`,
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

  const handleLogin = (email: string, password: string) => {
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setAuthError(null);
    } else {
      setAuthError('Invalid email or password.');
    }
  };

  const handleSignUp = (user: User) => {
    if (registeredUsers.find(u => u.email === user.email)) {
      setAuthError('Email already exists.');
      return;
    }
    const userWithDefaults = {
      ...user,
      reminderSettings: { enabled: true, sevenDay: true, oneDay: true }
    };
    setRegisteredUsers(prev => [...prev, userWithDefaults]);
    setCurrentUser(userWithDefaults);
    setAuthError(null);
  };

  const handleUpdateStatus = (id: string, status: TransactionStatus) => {
    const resolved = [TransactionStatus.FULFILLED, TransactionStatus.FORGIVEN, TransactionStatus.CHARITY].includes(status);
    setEntries(prev => prev.map(e => e.id === id ? { 
      ...e, 
      status, 
      resolvedAt: resolved ? new Date().toISOString() : e.resolvedAt,
      // If manually fulfilled, ensure remaining is zero
      remainingAmount: status === TransactionStatus.FULFILLED ? 0 : e.remainingAmount
    } : e));
  };

  const handlePartialPayment = (id: string, paymentAmount: number) => {
    setEntries(prev => prev.map(e => {
      if (e.id === id && e.numericAmount !== undefined) {
        const currentRemaining = e.remainingAmount ?? e.numericAmount;
        const newRemaining = Math.max(0, currentRemaining - paymentAmount);
        const newPayment: PaymentRecord = {
          id: Math.random().toString(36).substr(2, 9),
          amount: paymentAmount,
          date: new Date().toISOString()
        };
        const isNowFulfilled = newRemaining <= 0;
        
        return {
          ...e,
          remainingAmount: newRemaining,
          paymentLog: [...(e.paymentLog || []), newPayment],
          status: isNowFulfilled ? TransactionStatus.FULFILLED : e.status,
          resolvedAt: isNowFulfilled ? new Date().toISOString() : e.resolvedAt
        };
      }
      return e;
    }));
  };

  const handleMarkNotifRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <Layout 
      activeTab={activeTab} setActiveTab={setActiveTab} 
      currentUser={currentUser} onLogout={() => setCurrentUser(null)}
      theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
      notifications={notifications}
      onMarkRead={handleMarkNotifRead}
      onClearAll={handleClearNotifications}
    >
      {!currentUser ? (
        <Login onLogin={handleLogin} onSignUp={handleSignUp} error={authError} theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />
      ) : (
        <>
          {activeTab === 'ledger' && (
            <Dashboard 
              entries={entries} 
              currentUser={currentUser} 
              users={registeredUsers} 
              onUpdateStatus={handleUpdateStatus} 
              onConfirmEntry={(id) => handleUpdateStatus(id, TransactionStatus.CONFIRMED)} 
              onPartialPayment={handlePartialPayment}
              onAddEntry={() => setActiveTab('new-entry')} 
            />
          )}
          {activeTab === 'new-entry' && <LedgerForm onAdd={(e) => { setEntries([e, ...entries]); setActiveTab('ledger'); }} onCancel={() => setActiveTab('ledger')} currentUser={currentUser} users={registeredUsers} />}
          {activeTab === 'history' && <AmanahHistory entries={entries} currentUser={currentUser} users={registeredUsers} />}
          {activeTab === 'settings' && <Settings currentUser={currentUser} onUpdateUser={(u) => { setRegisteredUsers(prev => prev.map(old => old.id === u.id ? u : old)); setCurrentUser(u); }} />}
        </>
      )}
    </Layout>
  );
};

export default App;
