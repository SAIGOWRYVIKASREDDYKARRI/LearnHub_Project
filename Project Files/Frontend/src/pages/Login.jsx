import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 w-100">
            <Container className="glass-card animate-fade-in" style={{ maxWidth: '500px' }}>
                <h2 className="text-center mb-4 fw-bold dashboard-header">Welcome Back</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4" controlId="formBasicEmail">
                        <Form.Label className="fw-semibold">Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="custom-input"
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formBasicPassword">
                        <Form.Label className="fw-semibold">Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="custom-input"
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end mb-4">
                        <Link to="/forgot-password" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Forgot Password?</Link>
                    </div>
                    <Button variant="primary" type="submit" className="w-100 custom-btn fw-bold">
                        Login
                    </Button>
                </Form>
                <div className="mt-4 text-center text-muted">
                    New user? <Link to="/register" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Register here</Link>
                </div>
            </Container>
        </div>
    );
};

export default Login;
