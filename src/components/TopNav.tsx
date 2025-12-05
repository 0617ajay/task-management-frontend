// src/components/TopNav.tsx
'use client';
import { Navbar, Container, Nav, NavDropdown, Button, Dropdown, Image, Offcanvas  } from 'react-bootstrap';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function TopNav() {
  const { user, logout } = useAuth() as any;
  const router = useRouter();
  const pathname = usePathname();

    const [showOffcanvas, setShowOffcanvas] = useState(false);


  // is user on login or register page?
 const isLoginPage = pathname === '/login' || pathname === '/register';

 const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };
 

  return (
    <>
      <Navbar bg="light" expand="lg" fixed="top" className="border-bottom">
        <Container fluid>
          <Navbar.Brand as={Link} href="/" className="text-primary fw-bold">
            Task Manager
          </Navbar.Brand>

          <Navbar.Toggle 
              aria-controls="offcanvasNavbar" 
              onClick={() => setShowOffcanvas(true)} 
          />

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
            show={showOffcanvas}
            onHide={() => setShowOffcanvas(false)}
            className="mobile-nav"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Profile</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className={!showOffcanvas ? "d-none" : ""}>
              <Nav className="justify-content-end flex-3 pe-3 mobile-nav">
                {(!isLoginPage && !user) && (
                  <>
                    <Nav.Link as={Link} href="/login">
                      Login
                    </Nav.Link>
                    <Nav.Link as={Link} href="/register">
                      Register
                    </Nav.Link>
                  </>
                )}
                {user && !isLoginPage && ( <>
                    <div className='fs-5 status-title'><strong>{user.name.toUpperCase()}</strong></div>
                    <div className='fs-6 fw-medium'><small>{user.email}</small></div>
                    <hr />
                    <Button size="sm" onClick={handleLogout} className=" btn-secondary btn-bg-secondary">
                      Logout
                    </Button>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          {/* Desktop links (hidden on small screens) */}
          <Nav className="d-none d-lg-flex ms-auto desktop-nav">
            {!isLoginPage && !user && (
              <>
                <Nav.Link as={Link} href="/login">Login</Nav.Link>
                <Nav.Link as={Link} href="/register">Register</Nav.Link>
              </>
            )}
            {user && !isLoginPage && (
              <NavDropdown
                title={user.name.charAt(0).toUpperCase()}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.ItemText className='fs-5 status-title'><strong>{user.name.toUpperCase()}</strong></NavDropdown.ItemText>
                <NavDropdown.ItemText className='fs-6 fw-medium'><small>{user.email}</small></NavDropdown.ItemText>                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* Add spacing so content is not hidden under fixed navbar */}
      <div style={{ height: '70px' }} />
    </>
  );
}


