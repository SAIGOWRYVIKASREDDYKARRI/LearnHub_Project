import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Tabs, Tab, Alert, ProgressBar, Pagination } from 'react-bootstrap';
import api from '../utils/api';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [message, setMessage] = useState('');

    // Pagination State
    const [browsePage, setBrowsePage] = useState(1);
    const [learningPage, setLearningPage] = useState(1);
    const itemsPerPage = 10;

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

    // Calculate pagination slices
    const indexLastBrowse = browsePage * itemsPerPage;
    const indexFirstBrowse = indexLastBrowse - itemsPerPage;
    const currentBrowseCourses = courses.slice(indexFirstBrowse, indexLastBrowse);
    const totalBrowsePages = Math.ceil(courses.length / itemsPerPage);

    const indexLastLearning = learningPage * itemsPerPage;
    const indexFirstLearning = indexLastLearning - itemsPerPage;
    const currentLearningCourses = enrolledCourses.slice(indexFirstLearning, indexLastLearning);
    const totalLearningPages = Math.ceil(enrolledCourses.length / itemsPerPage);

    return (
        <div>
            <h3>Student Dashboard</h3>
            {message && <Alert variant="info">{message}</Alert>}

            <Tabs defaultActiveKey="browse" className="mb-3">
                <Tab eventKey="browse" title="Browse Courses">
                    <Row xs={1} md={3} className="g-4">
                        {currentBrowseCourses.map(course => {
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
                    {totalBrowsePages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination>
                                <Pagination.First onClick={() => setBrowsePage(1)} disabled={browsePage === 1} />
                                <Pagination.Prev onClick={() => setBrowsePage(browsePage - 1)} disabled={browsePage === 1} />
                                {[...Array(totalBrowsePages)].map((_, index) => (
                                    <Pagination.Item
                                        key={index + 1}
                                        active={index + 1 === browsePage}
                                        onClick={() => setBrowsePage(index + 1)}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => setBrowsePage(browsePage + 1)} disabled={browsePage === totalBrowsePages} />
                                <Pagination.Last onClick={() => setBrowsePage(totalBrowsePages)} disabled={browsePage === totalBrowsePages} />
                            </Pagination>
                        </div>
                    )}
                </Tab>
                <Tab eventKey="my-courses" title="My Learning">
                    {enrolledCourses.length === 0 && <p>You haven't enrolled in any courses yet.</p>}
                    <Row xs={1} md={2} className="g-4">
                        {currentLearningCourses.map(enrollment => (
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
                    {totalLearningPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination>
                                <Pagination.First onClick={() => setLearningPage(1)} disabled={learningPage === 1} />
                                <Pagination.Prev onClick={() => setLearningPage(learningPage - 1)} disabled={learningPage === 1} />
                                {[...Array(totalLearningPages)].map((_, index) => (
                                    <Pagination.Item
                                        key={index + 1}
                                        active={index + 1 === learningPage}
                                        onClick={() => setLearningPage(index + 1)}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => setLearningPage(learningPage + 1)} disabled={learningPage === totalLearningPages} />
                                <Pagination.Last onClick={() => setLearningPage(totalLearningPages)} disabled={learningPage === totalLearningPages} />
                            </Pagination>
                        </div>
                    )}
                </Tab>
            </Tabs>
        </div>
    );
};

export default StudentDashboard;
