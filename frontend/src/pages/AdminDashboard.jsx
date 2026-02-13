import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Pagination, Button } from 'react-bootstrap';
import api from '../utils/api';

const AdminDashboard = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const { data } = await api.get('/activities');
            setActivities(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch activities', error);
            setError('Failed to load activity logs');
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await api.get('/activities/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'activity_logs.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Download failed', error);
            setError('Failed to download logs');
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentActivities = activities.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(activities.length / itemsPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="py-4 animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="dashboard-header m-0">Admin Dashboard</h3>
                    <p className="text-muted m-0">Monitor system-wide user activity logs</p>
                </div>
                <Button onClick={handleDownload} variant="success" className="custom-btn shadow-sm">
                    <i className="bi bi-download me-2"></i>Download Logs
                </Button>
            </div>

            <div className="glass-card p-0 overflow-hidden shadow-lg">
                <Table hover responsive className="glass-table mb-0">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>User</th>
                            <th>Role</th>
                            <th>Action</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentActivities.length > 0 ? (
                            currentActivities.map(log => (
                                <tr key={log._id}>
                                    <td className="text-secondary small">{new Date(log.createdAt).toLocaleString()}</td>
                                    <td className="fw-bold">{log.user ? log.user.name : <span className="text-muted fst-italic">Unknown</span>}</td>
                                    <td>
                                        <span className={`badge ${log.user?.role === 'admin' ? 'bg-danger' : log.user?.role === 'teacher' ? 'bg-info' : 'bg-success'} bg-opacity-75`}>
                                            {log.user ? log.user.role : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="fw-semibold text-dark">{log.action}</td>
                                    <td className="text-muted small">{log.details}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-muted">No activity logs found.</td>
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
        </div>
    );
};

export default AdminDashboard;
