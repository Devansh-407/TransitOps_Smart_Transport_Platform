import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import api from '../services/api';

export type UserRole = 'admin' | 'fleet_manager' | 'driver' | 'safety_officer' | 'financial_analyst';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
  token?: string;
}

interface AuthContextValue {
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole, department?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'transflow-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = window.localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: string) => {
    try {
      const response = await api.post('/auth/login', { email, password, role });
      const { token, user: userData } = response.data;
      const combinedUser = { ...userData, token };
      setUser(combinedUser);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(combinedUser));
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, department?: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role, department });
      const { token, user: userData } = response.data;
      const combinedUser = { ...userData, token };
      setUser(combinedUser);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(combinedUser));
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user],
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading TransFlow...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

