import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, hasAnyRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    <h4>Access Denied</h4>
                    <p>You don't have permission to access this page.</p>
                    <p>Required roles: {requiredRoles.join(', ')}</p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
