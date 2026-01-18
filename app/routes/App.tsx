
import React from 'react';
import { Outlet } from 'react-router';
import { AuthProvider } from '~/contexts/AuthContext';
import { LedgerProvider } from '~/contexts/LedgerContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LedgerProvider>
        <Outlet />
      </LedgerProvider>
    </AuthProvider>
  );
};

export default App;

