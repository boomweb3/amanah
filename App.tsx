
import React, { useState, useEffect } from 'react';
import { LedgerEntry, TransactionStatus, TransactionType, Direction, User } from './types';
import Dashboard from './views/Dashboard';
import LedgerForm from './views/LedgerForm';
import Login from './views/Login';
import Layout from './components/Layout';

const INITIAL_USERS: User[] = [
  { id: 'user-1', name: 'Omar Farooq', email: 'omar@example.com', password: 'password', avatar: 'bg-emerald-500' },
  { id: 'user-2', name: 'Fatima Zahra', email: 'fatima@example.com', password: 'password', avatar: 'bg-amber-500' },
  { id: 'user-3', name: 'John Doe', email: 'john@example.com', password: 'password', avatar: 'bg-slate-500' },
  { id: 'user-4', name: 'Zainab Ahmed', email: 'zainab@example.com', password: 'password', avatar: 'bg-rose-500' },
  { id: 'user-5', name: 'Hamza Khan', email: 'hamza@example.com', password: 'password', avatar: 'bg-indigo-500' },
  { id: 'user-6', name: 'Sarah Malik', email: 'sarah@example.com', password: 'password', avatar: 'bg-teal-500' },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(INITIAL_USERS);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'ledger' | 'new-entry'>('ledger');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Initial mock data with relationships
    const initialEntries: LedgerEntry[] = [
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
    setEntries(initialEntries);
  }, []);

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
    // Check if email already exists
    if (registeredUsers.find(u => u.email === user.email)) {
      setAuthError('An account with this email already exists.');
      return;
    }
    setRegisteredUsers([...registeredUsers, user]);
    setCurrentUser(user);
    setAuthError(null);
  };

  const handleAddEntry = (entry: LedgerEntry) => {
    setEntries([entry, ...entries]);
    setActiveTab('ledger');
  };

  const handleUpdateStatus = (id: string, status: TransactionStatus) => {
    setEntries(entries.map(e => e.id === id ? { ...e, status } : e));
  };

  const handleConfirmEntry = (id: string) => {
    setEntries(entries.map(e => 
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
    </Layout>
  );
};

export default App;
