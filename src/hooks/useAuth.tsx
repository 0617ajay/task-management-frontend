// src/context/AuthContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import api from '../lib/api';
import { setAccessToken, clearAccessToken } from '../lib/auth';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: { email: string; password: string; name?: string }) => Promise<any>;
  logout: () => Promise<void>;
  refresh: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  async function login(email: string, password: string) {
    try {
          const res = await api.post('/auth/login', { email, password });
          const { accessToken, user } = res.data.data;
          setAccessToken(accessToken);
          setUser(user);
          return user;
    } catch (error) {
      throw error;
    }

  }

  async function register(payload: { email: string; password: string; name?: string }) {
    const res = await api.post('/auth/register', payload);
    return res.data;
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAccessToken();
      setUser(null);
    }
  }

  async function refresh() {
    const res = await api.post('/auth/refresh', {}, { withCredentials: true });
    const token = res.data.data.accessToken;
    setAccessToken(token);
    return token;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easier usage
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
