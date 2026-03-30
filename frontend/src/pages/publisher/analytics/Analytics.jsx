import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    LineChart, Line, AreaChart, Area, BarChart, Bar, 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import AnalyticsService from './AnalyticsService';
import './Analytics.css';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeFilter, setTimeFilter] = useState('30days');

    const DUMMY_STATS = {
        totalNotes: 0,
        totalViews: 0,
        totalSales: 0,
        totalRevenue: 0,
        uploadTrend: [
            { date: 'Day 1', count: 0 },
            { date: 'Day 2', count: 0 },
            { date: 'Day 3', count: 0 },
            { date: 'Day 4', count: 0 },
            { date: 'Day 5', count: 0 },
            { date: 'Day 6', count: 0 },
            { date: 'Day 7', count: 0 }
        ],
        popularNotes: []
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            console.log('Fetching analytics...');
            setLoading(true);
            setError(null);
            const data = await AnalyticsService.getAnalytics();
            console.log('Analytics response received:', data);
            
            if (data && data.totalNotes > 0) {
                setStats(data);
            } else {
                console.warn('No notes found for this publisher, showing empty state.');
                setStats(DUMMY_STATS);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setError('No analytics available at the moment.');
            setStats(DUMMY_STATS); // Still show the UI with 0s
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="analytics-loader">
                <div className="spinner"></div>
                <p>Preparing your insights...</p>
            </div>
        );
    }

    if (error && (!stats || stats.totalNotes === 0)) {
        return (
            <div className="analytics-error-container">
                <div className="error-icon">📊</div>
                <h2>{error}</h2>
                <p>Try uploading some notes to see your performance metrics.</p>
                <button className="refresh-btn" onClick={fetchAnalytics}>Retry</button>
            </div>
        );
    }

    const currentStats = stats || DUMMY_STATS;

    const METRICS = [
        { label: 'Total Notes', value: currentStats.totalNotes, icon: '📚', color: 'blue' },
        { label: 'Total Views', value: currentStats.totalViews.toLocaleString(), icon: '👁️', color: 'purple' },
        { label: 'Total Sales', value: currentStats.totalSales.toLocaleString(), icon: '📥', color: 'green' },
        { label: 'Total Revenue', value: `₹${currentStats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'gold' },
    ];

    return (
        <motion.div 
            className="analytics-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="analytics-header">
                <div className="header-info">
                    <h1 className="content-page-title">Analytics Overview</h1>
                    <p className="content-page-subtitle">Track your performance and earnings.</p>
                </div>
                <div className="filter-group">
                    <select 
                        className="filter-select"
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 3 Months</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>

            <div className="metrics-grid">
                {METRICS.map((metric, i) => (
                    <motion.div 
                        key={i} 
                        className="metric-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className={`metric-icon ${metric.color}`}>{metric.icon}</div>
                        <div className="metric-info">
                            <h3>{metric.label}</h3>
                            <div className="metric-value">{metric.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="charts-section">
                <div className="chart-card">
                    <h4>📤 Upload Trend</h4>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={currentStats.uploadTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h4>🔥 Most Popular Notes</h4>
                    <div className="popular-notes-list">
                        {currentStats.popularNotes.map((note, i) => (
                            <div key={i} className="popular-note-item">
                                <div className="note-info">
                                    <span className="note-title-small">{note.title}</span>
                                    <span className="note-stats-small">👁️ {note.views} | 📥 {note.sales}</span>
                                </div>
                                <div className="note-revenue">₹{note.revenue}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="chart-card" style={{ marginBottom: '32px' }}>
                <h4>💰 Revenue Overview</h4>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <AreaChart data={currentStats.uploadTrend}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#4CAF50" 
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};

export default Analytics;
