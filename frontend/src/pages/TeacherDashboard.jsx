import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import api from '../utils/api';

const TeacherDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCourseId, setCurrentCourseId] = useState(null);
    const [newCourse, setNewCourse] = useState({ title: '', description: '', category: '', price: 0 });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            // In a real app, we'd filter by educator ID on the backend or here
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

    const handleCreateCourse = async () => {
        try {
            await api.post('/courses', newCourse);
            setShowModal(false);
            resetForm();
            fetchCourses();
        } catch (error) {
            alert('Failed to create course');
        }
    };

    const handleUpdateCourse = async () => {
        try {
            await api.put(`/courses/${currentCourseId}`, newCourse);
            setShowModal(false);
            resetForm();
            fetchCourses();
        } catch (error) {
            alert('Failed to update course');
        }
    };

    const handleDeleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/courses/${id}`);
                fetchCourses();
            } catch (error) {
                alert('Failed to delete course');
            }
        }
    };

    const handleEditClick = (course) => {
        setIsEditing(true);
        setCurrentCourseId(course._id);
        setNewCourse({
            title: course.title || course.C_title || '',
            description: course.description || course.C_description || '',
            category: course.category || course.C_categories || '',
            price: course.price !== undefined ? course.price : (course.C_price !== undefined ? course.C_price : 0)
        });
        setShowModal(true);
    };

    const handleCreateClick = () => {
        resetForm();
        setShowModal(true);
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentCourseId(null);
        setNewCourse({ title: '', description: '', category: '', price: 0 });
    };

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <h3>My Courses</h3>
                <Button onClick={handleCreateClick}>Create Course</Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Enrolled</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course._id}>
                            <td>{course.title || course.C_title}</td>
                            <td>{course.category || course.C_categories}</td>
                            <td>${course.price !== undefined ? course.price : (course.C_price !== undefined ? course.C_price : 0)}</td>
                            <td>{course.enrolledCount || course.enrolled || 0}</td>
                            <td>
                                <Button variant="info" size="sm" className="me-2" onClick={() => handleEditClick(course)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteCourse(course._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Course' : 'Create Course'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCourse.title}
                                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={newCourse.description}
                                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCourse.category}
                                onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                value={newCourse.price}
                                onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={isEditing ? handleUpdateCourse : handleCreateCourse}>
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TeacherDashboard;
