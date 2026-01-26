
import React, { useState, useEffect } from 'react';
import { LedgerEntry, TransactionStatus, TransactionType, Direction, User } from './types';
import Dashboard from './views/Dashboard';
import LedgerForm from './views/LedgerForm';
import Login from './views/Login';
import GuestVerification from './views/GuestVerification';
import Settings from './views/Settings';
import Layout from './components/Layout';

const STORAGE_KEYS = {
  USERS: 'amaanah_users',
  ENTRIES: 'amaanah_entries',
  SESSION: 'amaanah_session',
  THEME: 'amaanah_theme'
};

const INITIAL_USERS: User[] = [
  { id: 'user-1', name: 'Omar Farooq', email: 'omar@example.com', password: 'password', avatar: 'bg-emerald-500' },
  { id: 'user-2', name: 'Fatima Zahra', email: 'fatima@example.com', password: 'password', avatar: 'bg-amber-500' },
  { id: 'user-3', name: 'John Doe', email: 'john@example.com', password: 'password', avatar: 'bg-slate-500' },
  { id: 'user-4', name: 'Zainab Ahmed', email: 'zainab@example.com', password: 'password', avatar: 'bg-rose-500' },
  { id: 'user-5', name: 'Hamza Khan', email: 'hamza@example.com', password: 'password', avatar: 'bg-indigo-500' },
  { id: 'user-6', name: 'Sarah Malik', email: 'sarah@example.com', password: 'password', avatar: 'bg-teal-500' },
];

const INITIAL_ENTRIES: LedgerEntry[] = [
  {
    id: 'entry-1',
    creatorId: 'user-1',
    targetUserId: 'user-3',
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
    amount: 'Gold Ring',
    type: TransactionType.AMANAH,
    direction: Direction.OWED_TO_ME,
    status: TransactionStatus.PENDING,
    notes: 'Safekeeping for travel. Handed over on 15th.',
    isConfirmed: false,
    createdAt: new Date().toISOString()
  }
];

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

  const [activeTab, setActiveTab] = useState<'ledger' | 'new-entry' | 'settings'>('ledger');
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [guestEntryId, setGuestEntryId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('v');
  });

  // Handle Dark Mode
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
      setAuthError('Invalid email or password. Please try again.');
    }
  };

  const handleSignUp = (user: User) => {
    if (registeredUsers.find(u => u.email === user.email)) {
      setAuthError('An account with this email already exists.');
      return;
    }
    setRegisteredUsers(prev => [...prev, user]);
    setCurrentUser(user);
    setAuthError(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setRegisteredUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
  };

  const handleAddEntry = (entry: LedgerEntry) => {
    setEntries(prev => [entry, ...prev]);
    setActiveTab('ledger');
  };

  const handleUpdateStatus = (id: string, status: TransactionStatus) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const handleConfirmEntry = (id: string) => {
    setEntries(prev => prev.map(e => 
      e.id === id 
        ? { ...e, isConfirmed: true, status: TransactionStatus.CONFIRMED } 
        : e
    ));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthError(null);
    setActiveTab('ledger');
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const guestEntry = guestEntryId ? entries.find(e => e.id === guestEntryId) : null;

  if (guestEntry) {
    return (
      <GuestVerification 
        entry={guestEntry}
        users={registeredUsers}
        onConfirm={(id) => handleUpdateStatus(id, TransactionStatus.FULFILLED)}
        onDispute={(id) => handleUpdateStatus(id, TransactionStatus.PENDING)}
        onGoHome={() => {
          setGuestEntryId(null);
          window.history.replaceState({}, document.title, window.location.pathname);
        }}
        theme={theme}
      />
    );
  }

  if (!currentUser) {
    return (
      <Login 
        onLogin={handleLogin} 
        onSignUp={handleSignUp} 
        error={authError} 
      />
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      currentUser={currentUser}
      onLogout={handleLogout}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      {activeTab === 'ledger' && (
        <Dashboard 
          entries={entries} 
          currentUser={currentUser}
          users={registeredUsers}
          onUpdateStatus={handleUpdateStatus}
          onConfirmEntry={handleConfirmEntry}
          onAddEntry={() => setActiveTab('new-entry')}
        />
      )}
      {activeTab === 'new-entry' && (
        <LedgerForm 
          onAdd={handleAddEntry} 
          onCancel={() => setActiveTab('ledger')}
          currentUser={currentUser}
          users={registeredUsers}
        />
      )}
      {activeTab === 'settings' && (
        <Settings 
          currentUser={currentUser} 
          onUpdateUser={handleUpdateUser}
        />
      )}
    </Layout>
  );
};

export default App;
