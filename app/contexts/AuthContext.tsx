import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, AuthResponse } from '../types/types';

interface AuthContextType {
  user: User | null;
  users: User[];
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, avatar: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setUsers([]);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to load users');
      }

      const data: { data: User[] } = await response.json();
      setUsers(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load users';
      setError(message);
    }
  }, [token]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data: { data: AuthResponse } = await response.json();
      const { user: userData, token: userToken } = data.data;

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      await fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, avatar: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, avatar }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }

      const data: { data: AuthResponse } = await response.json();
      const { user: userData, token: userToken } = data.data;

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      await fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setUsers([]);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    users,
    token,
    loading,
    error,
    login,
    register,
    fetchUsers,
    logout,
    clearError,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
