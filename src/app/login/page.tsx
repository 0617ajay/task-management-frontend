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

  // ❗ Validation error state
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  // Email validator
  const validateEmail = (value: string) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(value);
  };

  // Password validator
  const validatePassword = (value: string) => {
    return value.length >= 6;
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    let tempErrors: any = {};

    if (!validateEmail(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(password)) {
      tempErrors.password = 'Password must be at least 6 characters long';
    }

    // If any error → don't proceed
    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setErrors({} as any);
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
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '70vh' }}
    >
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-3 text-primary">Log in</h3>
              <Form onSubmit={onSubmit} noValidate>
                
                {/* Email Field */}
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    isInvalid={!!errors.email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    required
                  />
                  {errors.email && (
                    <Form.Text className="text-danger">{errors.email}</Form.Text>
                  )}
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    isInvalid={!!errors.password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    required
                  />
                  {errors.password && (
                    <Form.Text className="text-danger">{errors.password}</Form.Text>
                  )}
                </Form.Group>

                <div className="d-grid mb-2">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Logging in…' : 'Log in'}
                  </Button>
                </div>

                <div className="text-center">
                  <small>
                    Don't have an account?{' '}
                    <Link href="/register" aria-disabled={loading}>
                      Register
                    </Link>
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
