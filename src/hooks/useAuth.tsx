// src/hooks/useAuth.ts
'use client';
import { useState } from 'react';
import api from '../lib/api';
import { setAccessToken, clearAccessToken } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    const { accessToken, user } = res.data.data;
    setAccessToken(accessToken);
    setUser(user);
    return user;
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

  return { user, setUser, login, register, logout, refresh };
}
