import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Dashboard</h2>
            <button 
                onClick={handleLogout} 
                style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
