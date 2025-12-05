// src/components/TopNav.tsx
'use client';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function TopNav() {
  const { user, logout } = useAuth() as any;
  const router = useRouter();
  const pathname = usePathname();

  const [userLoaded, setUserLoaded] = useState(false);
  // is user on login or register page?
 const isLoginPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    console.log('User state changed:', user);
    if (user) {
      setUserLoaded(true);
    }}, [useAuth().user]);

  return (
    <Navbar bg="light" expand="lg" className="border-bottom mb-3">
      <Container>
        <Navbar.Brand as={Link} href="/" className="text-primary fw-bold">Task Manager</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {userLoaded && <Nav.Link as={Link} href="/login">Login</Nav.Link>}
            {userLoaded && <Nav.Link as={Link} href="/register">Register</Nav.Link>}
            {!(userLoaded || isLoginPage) && <Button variant="outline-primary" onClick={async ()=> { await logout(); router.push('/login'); }}>Logout</Button>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
