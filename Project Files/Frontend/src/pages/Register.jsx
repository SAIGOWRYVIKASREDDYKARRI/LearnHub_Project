import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(name, email, password, role);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 w-100">
            <Container className="glass-card animate-slide-in" style={{ maxWidth: '500px' }}>
                <h2 className="text-center mb-4 fw-bold dashboard-header">Join LearnHub</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label className="fw-semibold">Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="custom-input"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
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

                    <Form.Group className="mb-3" controlId="formBasicPassword">
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

                    <Form.Group className="mb-4" controlId="formRole">
                        <Form.Label className="fw-semibold">Role</Form.Label>
                        <Form.Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="custom-input"
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </Form.Select>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 custom-btn fw-bold">
                        Register
                    </Button>
                </Form>
                <div className="mt-4 text-center text-muted">
                    Already have an account? <Link to="/login" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Login here</Link>
                </div>
            </Container>
        </div>
    );
};

export default Register;
