import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { motion } from 'framer-motion';
import './Login.css';

const floatingAnimation = {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
    }
};

const leafIconUrl = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23639459' width='36px' height='36px'><path d='M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 5.23 13.9 6.27 16.27C9 13.5 13 11 17 8Z'/></svg>";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await authService.login(email, password);
            if (data && data.token) {
                localStorage.setItem("token", data.token);
            }
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            {/* Left Side: Herbal Background */}
            <div className="login-left">
                <div className="login-left-overlay"></div>

                {/* Floating Herbs Animation */}
                <div className="floating-herbs">
                    {[...Array(6)].map((_, i) => (
                        <motion.img
                            key={i}
                            src={leafIconUrl}
                            className="herb"
                            style={{
                                top: `${Math.random() * 80 + 10}%`,
                                left: `${Math.random() * 80 + 10}%`,
                                transform: `scale(${Math.random() * 0.5 + 0.8})`,
                                opacity: Math.random() * 0.5 + 0.3
                            }}
                            animate="animate"
                            variants={{
                                animate: {
                                    y: [0, Math.random() * -30 - 10, 0],
                                    rotate: [0, Math.random() * 20 - 10, 0],
                                    transition: {
                                        duration: Math.random() * 4 + 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: Math.random() * 2
                                    }
                                }
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    className="logo-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <h1 className="logo-title">AyurVault</h1>
                    <p className="logo-subtitle">The Essence of Nature</p>
                </motion.div>
            </div>

            {/* Right Side: Parchment Login Card */}
            <div className="login-right">
                <motion.div
                    className="parchment-card"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="form-header">
                        <h2 className="form-title">Welcome Back</h2>
                        <p className="form-subtitle">Enter your details to access your vault.</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <motion.div
                            className="input-group"
                            whileFocus={{ scale: 1.02 }}
                        >
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                            />
                        </motion.div>

                        <motion.div
                            className="input-group"
                            whileFocus={{ scale: 1.02 }}
                        >
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </motion.div>

                        <motion.button
                            type="submit"
                            className="login-btn"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Log In Workspace
                        </motion.button>
                    </form>

                    <div className="register-link">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;

