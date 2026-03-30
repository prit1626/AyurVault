import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../../services/apiClient';
import UploadNotes from './upload/UploadNotes';
import MyNotes from './mynotes/MyNotes';
import Analytics from './analytics/Analytics';
import Earnings from './earnings/Earnings';
import './PublisherDashboard.css';

const NAV_ITEMS = [
    { icon: '🏠', label: 'Dashboard',    key: 'dashboard'  },
    { icon: '📤', label: 'Upload Notes', key: 'upload'     },
    { icon: '📚', label: 'My Notes',     key: 'mynotes'    },
    { icon: '📊', label: 'Analytics',    key: 'analytics'  },
    { icon: '💰', label: 'Earnings',     key: 'earnings'   },
];

const STAT_CARDS = [
    { icon: '📤', iconClass: 'green', label: 'Total Uploads',  key: 'totalUploads',  prefix: '' },
    { icon: '🛒', iconClass: 'blue',  label: 'Total Sales',    key: 'totalSales',    prefix: '' },
    { icon: '💰', iconClass: 'gold',  label: 'Total Earnings', key: 'totalEarnings', prefix: '₹' },
    { icon: '⏳', iconClass: 'amber', label: 'Pending Notes',  key: 'pendingNotes',  prefix: '' },
];

const cardVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } })
};

const PlaceholderPage = ({ icon, title, description }) => (
    <div className="placeholder-page">
        <span className="ph-icon">{icon}</span>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

const PublisherDashboard = () => {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState('dashboard');
    const [stats, setStats] = useState({
        totalUploads: 0,
        totalSales: 0,
        totalEarnings: 0,
        pendingNotes: 0,
    });

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};
    const userName = user.name || user.email || 'Publisher';
    const avatarLetter = (user.name || user.email || 'P').charAt(0).toUpperCase();

    useEffect(() => {
        apiClient.get('/publisher/dashboard')
            .then(res => setStats(res.data))
            .catch(() => {
                // Keep dummy stats if API fails (backend may still be starting)
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return (
                    <>
                        <h1 className="content-page-title">Welcome back, {userName} 👋</h1>
                        <p className="content-page-subtitle">Here's an overview of your publisher activity.</p>

                        <div className="stats-grid">
                            {STAT_CARDS.map((card, i) => (
                                <motion.div
                                    key={card.key}
                                    className="stat-card"
                                    custom={i}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <div className={`stat-card-icon ${card.iconClass}`}>{card.icon}</div>
                                    <div className="stat-card-value">
                                        {card.prefix}{stats[card.key] ?? 0}
                                    </div>
                                    <div className="stat-card-label">{card.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="section-title">Quick Actions</div>
                        <div className="quick-actions">
                            <button className="quick-action-btn primary" onClick={() => setActivePage('upload')}>
                                📤 Upload New Note
                            </button>
                            <button className="quick-action-btn secondary" onClick={() => setActivePage('mynotes')}>
                                📚 View My Notes
                            </button>
                            <button className="quick-action-btn secondary" onClick={() => setActivePage('analytics')}>
                                📊 See Analytics
                            </button>
                        </div>
                    </>
                );
            case 'upload':
                return <UploadNotes />;
            case 'mynotes':
                return <MyNotes onUploadClick={() => setActivePage('upload')} />;
            case 'analytics':
                return <Analytics />;
            case 'earnings':
                return <Earnings />;
            default:
                return null;
        }
    };

    return (
        <div className="publisher-layout">
            {/* Sidebar */}
            <aside className="publisher-sidebar">
                <div className="sidebar-brand">
                    <h2>AyurVault</h2>
                    <p>Publisher Portal</p>
                </div>

                <nav className="sidebar-nav">
                    {NAV_ITEMS.map(item => (
                        <div
                            key={item.key}
                            className={`sidebar-nav-item ${activePage === item.key ? 'active' : ''}`}
                            onClick={() => setActivePage(item.key)}
                        >
                            <span className="sidebar-nav-icon">{item.icon}</span>
                            {item.label}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-logout-btn" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="publisher-main">
                {/* Navbar */}
                <header className="publisher-navbar">
                    <span className="navbar-title">
                        {NAV_ITEMS.find(n => n.key === activePage)?.label || 'Dashboard'}
                    </span>
                    <div className="navbar-user">
                        <div className="navbar-user-info">
                            <div className="navbar-user-name">{userName}</div>
                            <div className="navbar-user-role">Publisher</div>
                        </div>
                        <div className="navbar-avatar">{avatarLetter}</div>
                    </div>
                </header>

                {/* Content */}
                <main className="publisher-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default PublisherDashboard;
