'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ToasterProvider';
import Link from 'next/link';

export default function RegisterPage() {
  const { register: doRegister } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
  const validatePassword = (value: string) => value.length >= 6;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    let tempErrors: any = {};

    if (!name.trim()) tempErrors.name = 'Full name is required';
    if (!validateEmail(email)) tempErrors.email = 'Please enter a valid email address';
    if (!validatePassword(password)) tempErrors.password = 'Password must be at least 6 characters';
    if (confirmPassword !== password) tempErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setErrors({} as any);
    setLoading(true);

    try {
      await doRegister({ email, password, name });
      toast.success('Registered successfully. Please login.');
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
        <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-3 text-primary">Create account</h3>
              <Form noValidate onSubmit={onSubmit}>
                <Row className="g-3">
                  {/* Full Name */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Full name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        value={name}
                        isInvalid={!!errors.name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors((prev) => ({ ...prev, name: '' }));
                        }}
                        required
                      />
                      {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                    </Form.Group>
                  </Col>

                  {/* Email */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Email <span className="text-danger">*</span>
                      </Form.Label>
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
                      {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
                    </Form.Group>
                  </Col>

                  {/* Password */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Password <span className="text-danger">*</span>
                      </Form.Label>
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
                      {errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
                    </Form.Group>
                  </Col>

                  {/* Confirm Password */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Confirm Password <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        value={confirmPassword}
                        isInvalid={!!errors.confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                        }}
                        required
                      />
                      {errors.confirmPassword && (
                        <Form.Text className="text-danger">{errors.confirmPassword}</Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Submit Button Full Width */}
                  <Col md={12}>
                    <div className="d-grid mt-2">
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Creating…' : 'Create account'}
                      </Button>
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <small>
                    Already have an account?{' '}
                    <Link href="/login" aria-disabled={loading}>
                      Login
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
