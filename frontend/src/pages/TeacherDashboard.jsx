import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Pagination } from 'react-bootstrap';
import api from '../utils/api';

const TeacherDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCourseId, setCurrentCourseId] = useState(null);
    const [newCourse, setNewCourse] = useState({ title: '', description: '', category: '', price: 0 });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            // Fetch courses created by the logged-in teacher
            const { data } = await api.get('/courses/my');
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

    // Pagination Logic

    if (!Array.isArray(courses)) {
        console.error('Courses is not an array:', courses);
        return <div className="text-danger">Error: Courses data is corrupted. Check console.</div>;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(courses.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
                    {currentCourses.map(course => {
                        if (!course) return null;
                        return (
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
                        );
                    })}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            )}

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
