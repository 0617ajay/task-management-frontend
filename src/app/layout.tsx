// app/layout.tsx
// import '../styles/globals.css';
import { ToastProvider } from '@/components/ToasterProvider';
import TopNav from '@/components/TopNav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ReactNode } from 'react';
import ReactQueryProvider from './providers/ReactQUeryProvider';

export const metadata = {
  title: 'Task Manager',
  description: 'Premium task manager - Next.js + TypeScript',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ToastProvider>
            <TopNav />
            <main className="container py-4">{children}</main>
          </ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
