
import React, { useState, useEffect } from 'react';
import { LedgerEntry, TransactionStatus, TransactionType, Direction, User } from './types';
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
  THEME: 'amaanah_theme'
};

const INITIAL_USERS: User[] = [
  { id: 'user-1', name: 'Omar Farooq', email: 'omar@example.com', password: 'password' },
  { id: 'user-2', name: 'Fatima Zahra', email: 'fatima@example.com', password: 'password' },
  { id: 'user-3', name: 'John Doe', email: 'john@example.com', password: 'password' },
  { id: 'user-4', name: 'Zainab Ahmed', email: 'zainab@example.com', password: 'password' },
];

const INITIAL_ENTRIES: LedgerEntry[] = [
  {
    id: 'entry-1',
    creatorId: 'user-1',
    targetUserId: 'user-3',
    partnerName: 'John Doe',
    amount: '$250',
    type: TransactionType.DEBT,
    direction: Direction.I_OWE,
    status: TransactionStatus.CONFIRMED,
    dueDate: '2024-07-20',
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
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  }, [currentUser]);

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
    setRegisteredUsers(prev => [...prev, user]);
    setCurrentUser(user);
    setAuthError(null);
  };

  const handleUpdateStatus = (id: string, status: TransactionStatus) => {
    const resolved = [TransactionStatus.FULFILLED, TransactionStatus.FORGIVEN, TransactionStatus.CHARITY].includes(status);
    setEntries(prev => prev.map(e => e.id === id ? { 
      ...e, 
      status, 
      resolvedAt: resolved ? new Date().toISOString() : e.resolvedAt 
    } : e));
  };

  return (
    <Layout 
      activeTab={activeTab} setActiveTab={setActiveTab} 
      currentUser={currentUser} onLogout={() => setCurrentUser(null)}
      theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
    >
      {!currentUser ? (
        <Login onLogin={handleLogin} onSignUp={handleSignUp} error={authError} theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />
      ) : (
        <>
          {activeTab === 'ledger' && <Dashboard entries={entries} currentUser={currentUser} users={registeredUsers} onUpdateStatus={handleUpdateStatus} onConfirmEntry={(id) => handleUpdateStatus(id, TransactionStatus.CONFIRMED)} onAddEntry={() => setActiveTab('new-entry')} />}
          {activeTab === 'new-entry' && <LedgerForm onAdd={(e) => { setEntries([e, ...entries]); setActiveTab('ledger'); }} onCancel={() => setActiveTab('ledger')} currentUser={currentUser} users={registeredUsers} />}
          {activeTab === 'history' && <AmanahHistory entries={entries} currentUser={currentUser} users={registeredUsers} />}
          {activeTab === 'settings' && <Settings currentUser={currentUser} onUpdateUser={(u) => { setRegisteredUsers(prev => prev.map(old => old.id === u.id ? u : old)); setCurrentUser(u); }} />}
        </>
      )}
    </Layout>
  );
};

export default App;
