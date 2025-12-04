// src/components/ProtectedRoute.tsx
'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '../lib/auth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If accessToken present, assume logged in; otherwise redirect to login.
    const t = getAccessToken();
    if (!t) {
      router.push('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return <div className="text-center py-5">Checking auth…</div>;
  return <>{children}</>;
}
