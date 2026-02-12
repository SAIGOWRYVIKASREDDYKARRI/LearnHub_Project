import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import api from '../utils/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const { data } = await api.post('/auth/forgotpassword', { email });
            setMessage(data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '500px' }}>
            <h2>Forgot Password</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                    Send Reset Link
                </Button>
            </Form>
        </Container>
    );
};

export default ForgotPassword;
