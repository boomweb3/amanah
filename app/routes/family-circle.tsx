import React from 'react';
import { Navigate } from 'react-router';
import FamilyCircle from '~/views/FamilyCircle';
import Layout from '~/components/Layout';
import { useAuth } from '~/contexts/AuthContext';

export default function FamilyCircleRoute() {
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
      <FamilyCircle />
    </Layout>
  );
}
