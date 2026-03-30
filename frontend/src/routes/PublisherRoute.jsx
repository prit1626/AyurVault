import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PublisherRoute - Restricts access to users with the PUBLISHER role.
 * Reads the user object saved to localStorage by authService.
 */
const PublisherRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token) {
        console.log("No token found, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        // Handle both "PUBLISHER" and "ROLE_PUBLISHER"
        const userRole = user?.role?.name || user?.role || "";
        console.log("PublisherRoute - Extracted role from storage:", userRole);

        if (userRole !== 'PUBLISHER' && userRole !== 'ROLE_PUBLISHER') {
            console.log("Not a publisher role, redirecting to student dashboard");
            return <Navigate to="/dashboard" replace />;
        }
    } catch (err) {
        console.error("Error parsing user from storage:", err);
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PublisherRoute;
