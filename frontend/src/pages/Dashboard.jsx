import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import { Button } from 'react-bootstrap';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Welcome, {user.name} ({user.role})</h1>
                <Button variant="outline-danger" onClick={logout}>Logout</Button>
            </div>

            {user.role === 'admin' && <AdminDashboard />}
            {user.role === 'teacher' && <TeacherDashboard />}
            {user.role === 'student' && <StudentDashboard />}
        </div>
    );
};

export default Dashboard;
