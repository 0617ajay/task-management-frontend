// src/components/ToastProvider.tsx
'use client';
import React, { createContext, useContext, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

type ToastItem = { id: string; title?: string; body: string; variant?: 'success'|'danger'|'info'|'warning' };

const ToastContext = createContext<any>(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function push(t: Omit<ToastItem, 'id'>) {
    const id = Math.random().toString(36).slice(2);
    setToasts(curr => [{ id, ...t }, ...curr]);
    setTimeout(()=> setToasts(curr => curr.filter(x=>x.id!==id)), 4000);
  }

  const ctx = {
    success: (body: string, title?:string) => push({ title, body, variant: 'success' }),
    error: (body: string, title?:string) => push({ title, body, variant: 'danger' }),
    info: (body: string, title?:string) => push({ title, body, variant: 'info' })
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map(t => (
          <Toast key={t.id} bg={t.variant} className="mb-2" autohide>
            {t.title && <Toast.Header><strong className="me-auto">{t.title}</strong></Toast.Header>}
            <Toast.Body className="text-white">{t.body}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

