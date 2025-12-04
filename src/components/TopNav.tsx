// src/components/TopNav.tsx
'use client';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function TopNav() {
  const { user, logout } = useAuth() as any;
  const router = useRouter();

  return (
    <Navbar bg="light" expand="lg" className="border-bottom mb-3">
      <Container>
        <Navbar.Brand as={Link} href="/" className="text-primary fw-bold">TaskManager</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {!user && <Nav.Link as={Link} href="/login">Login</Nav.Link>}
            {!user && <Nav.Link as={Link} href="/register">Register</Nav.Link>}
            {user && <Button variant="outline-primary" onClick={async ()=> { await logout(); router.push('/login'); }}>Logout</Button>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
