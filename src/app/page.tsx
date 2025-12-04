// app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // Optional: check auth and redirect properly, for now redirect to /tasks
  redirect('/tasks');
}
