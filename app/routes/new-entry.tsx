import React from 'react';
import { Navigate } from 'react-router';
import LedgerForm from '~/views/LedgerForm';
import Layout from '~/components/Layout';
import { useAuth } from '~/contexts/AuthContext';

export default function NewEntryRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-semibold">
        Preparing your ledger...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <LedgerForm />
    </Layout>
  );
}
