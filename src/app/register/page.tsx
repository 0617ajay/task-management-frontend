// app/register/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ToasterProvider';

export default function RegisterPage() {
  const { register: doRegister } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await doRegister({ email, password, name });
      toast.success('Registered. Please login.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-3 text-primary">Create account</h3>
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full name</Form.Label>
                  <Form.Control value={name} onChange={(e)=>setName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Creating…' : 'Create account'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
