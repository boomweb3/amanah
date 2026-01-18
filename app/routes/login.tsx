import React from 'react';
import { Navigate } from 'react-router';
import Login from '~/views/Login';
import { useAuth } from '~/contexts/AuthContext';

export default function LoginRoute() {
  const { user } = useAuth();

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}
