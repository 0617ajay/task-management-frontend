// app/layout.tsx
// import '../styles/globals.css';
import { ToastProvider } from '@/components/ToasterProvider';
import TopNav from '@/components/TopNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ReactNode } from 'react';
import ReactQueryProvider from './providers/ReactQUeryProvider';
import { AuthProvider } from '@/hooks/useAuth';

export const metadata = {
  title: 'Task Manager',
  description: 'Premium task manager - Next.js + TypeScript',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
          <ToastProvider>
            <TopNav />
            <main className="">{children}</main>
          </ToastProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
