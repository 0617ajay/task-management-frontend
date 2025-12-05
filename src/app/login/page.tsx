// app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ToasterProvider';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in');
      router.push('/tasks');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center " style={{ minHeight: '70vh' }}>
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-3 text-primary">Log in</h3>
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                </Form.Group>

                <div className="d-grid mb-2">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign in'}
                  </Button>
                </div>

                <div className="text-center">
                  <small>
                    Don't have an account? <Link href="/register" aria-disabled = {loading}>Register</Link>
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
