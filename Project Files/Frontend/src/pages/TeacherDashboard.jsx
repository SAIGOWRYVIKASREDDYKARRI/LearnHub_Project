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
        <div className="py-4 animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="dashboard-header m-0">My Courses</h3>
                <Button onClick={handleCreateClick} className="custom-btn shadow-sm">
                    <i className="bi bi-plus-lg me-2"></i>Create New Course
                </Button>
            </div>

            <div className="glass-card p-0 overflow-hidden">
                <Table hover responsive className="glass-table mb-0">
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
                        {currentCourses.length > 0 ? (
                            currentCourses.map(course => {
                                if (!course) return null;
                                return (
                                    <tr key={course._id}>
                                        <td className="fw-semibold">{course.title || course.C_title}</td>
                                        <td><span className="badge bg-light text-secondary border">{course.category || course.C_categories}</span></td>
                                        <td className="fw-bold text-success">${course.price !== undefined ? course.price : (course.C_price !== undefined ? course.C_price : 0)}</td>
                                        <td>{course.enrolledCount || course.enrolled || 0} Students</td>
                                        <td>
                                            <Button variant="outline-info" size="sm" className="me-2 rounded-pill px-3" onClick={() => handleEditClick(course)}>Edit</Button>
                                            <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={() => handleDeleteCourse(course._id)}>Delete</Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-muted">
                                    No courses found. Start by creating one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination className="custom-pagination">
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

            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="glass-card border-0">
                <Modal.Header closeButton className="border-bottom-0">
                    <Modal.Title className="fw-bold">{isEditing ? 'Edit Course' : 'Create Course'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCourse.title}
                                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                className="custom-input"
                                placeholder="e.g. Advanced React Patterns"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newCourse.description}
                                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                className="custom-input"
                                placeholder="Course details..."
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Category</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCourse.category}
                                onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                                className="custom-input"
                                placeholder="e.g. Web Development"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Price ($)</Form.Label>
                            <Form.Control
                                type="number"
                                value={newCourse.price}
                                onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                                className="custom-input"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-top-0">
                    <Button variant="light" onClick={() => setShowModal(false)} className="rounded-pill px-4">Cancel</Button>
                    <Button variant="primary" onClick={isEditing ? handleUpdateCourse : handleCreateCourse} className="custom-btn rounded-pill px-4">
                        {isEditing ? 'Update Course' : 'Create Course'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TeacherDashboard;
