import React from 'react';
import { Button, Pagination } from 'react-bootstrap';

const DebugDashboard = () => {
    return (
        <div className="p-5 border border-danger">
            <h2>Debug Dashboard</h2>
            <p>If you can see this, React is rendering.</p>
            <Button variant="primary">Test Button</Button>
            <Pagination>
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
            </Pagination>
        </div>
    );
};

export default DebugDashboard;
