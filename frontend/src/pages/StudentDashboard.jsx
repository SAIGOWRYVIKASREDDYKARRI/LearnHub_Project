import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Tabs, Tab, Alert, ProgressBar } from 'react-bootstrap';
import api from '../utils/api';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCourses();
        fetchEnrolledCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            if (Array.isArray(data)) {
                setCourses(data);
            } else {
                setCourses([]);
            }
        } catch (error) {
            console.error('Failed to fetch courses', error);
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            const { data } = await api.get('/courses/enrolled/me');
            if (Array.isArray(data)) {
                setEnrolledCourses(data);
            } else {
                setEnrolledCourses([]);
            }
        } catch (error) {
            console.error('Failed to fetch enrolled courses', error);
        }
    };

    const handleEnroll = async (courseId) => {
        try {
            await api.post(`/courses/${courseId}/enroll`);
            setMessage('Enrolled successfully!');
            fetchEnrolledCourses();
            fetchCourses();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Enrollment failed');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleDownloadCertificate = (courseTitle) => {
        alert(`Downloading Certificate for ${courseTitle}...\n(In a real app, this would generate a PDF)`);
    };

    return (
        <div>
            <h3>Student Dashboard</h3>
            {message && <Alert variant="info">{message}</Alert>}

            <Tabs defaultActiveKey="browse" className="mb-3">
                <Tab eventKey="browse" title="Browse Courses">
                    <Row xs={1} md={3} className="g-4">
                        {courses.map(course => {
                            const isEnrolled = enrolledCourses.some(e => e.course && e.course._id === course._id);
                            if (!course) return null;
                            return (
                                <Col key={course._id}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{course.title || course.C_title || 'Untitled'}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{course.category || course.C_categories || 'Uncategorized'}</Card.Subtitle>
                                            <Card.Text>
                                                {(course.description || course.C_description || '').substring(0, 100)}...
                                            </Card.Text>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-bold">${course.price !== undefined ? course.price : (course.C_price !== undefined ? course.C_price : 0)}</span>
                                                {isEnrolled ? (
                                                    <Button variant="success" disabled>Enrolled</Button>
                                                ) : (
                                                    <Button variant="primary" onClick={() => handleEnroll(course._id)}>Enroll</Button>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Tab>
                <Tab eventKey="my-courses" title="My Learning">
                    {enrolledCourses.length === 0 && <p>You haven't enrolled in any courses yet.</p>}
                    <Row xs={1} md={2} className="g-4">
                        {enrolledCourses.map(enrollment => (
                            <Col key={enrollment._id}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{enrollment.course?.title || enrollment.course?.C_title || 'Untitled Course'}</Card.Title>
                                        <Card.Text>
                                            Educator: {enrollment.course?.educator?.name || enrollment.course?.C_educator || 'Unknown'}
                                        </Card.Text>
                                        <Card.Text>Status: In Progress</Card.Text>
                                        <ProgressBar now={45} label={`${45}%`} className="mb-3" />
                                        <div className="d-flex gap-2">
                                            <Button variant="primary" size="sm">Continue Learning</Button>
                                            <Button variant="outline-success" size="sm" onClick={() => handleDownloadCertificate(enrollment.course.title)}>Certificate</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Tab>
            </Tabs>
        </div>
    );
};

export default StudentDashboard;
