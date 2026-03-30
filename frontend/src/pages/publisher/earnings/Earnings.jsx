import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EarningsService from './EarningsService';
import './Earnings.css';

const Earnings = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalEarnings: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsData, historyData] = await Promise.all([
                EarningsService.getEarningsStats(),
                EarningsService.getTransactionHistory(page, 10)
            ]);
            setStats(statsData);
            setTransactions(historyData.content || []);
            setTotalPages(historyData.totalPages || 0);
        } catch (error) {
            console.error('Error fetching earnings:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <motion.div 
            className="earnings-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="earnings-header">
                <h1 className="content-page-title">Earnings & Payouts</h1>
                <p className="content-page-subtitle">Track your revenue and transaction history.</p>
            </div>

            <div className="earnings-stats-grid">
                <motion.div className="earnings-card main-balance" whileHover={{ scale: 1.02 }}>
                    <div className="card-content">
                        <h3>Total Earnings</h3>
                        <div className="balance-value">₹{stats.totalEarnings.toLocaleString()}</div>
                        <div className="balance-subtitle">Net revenue after commission</div>
                    </div>
                    <div className="card-icon">💰</div>
                </motion.div>

                <motion.div className="earnings-card" whileHover={{ scale: 1.02 }}>
                    <div className="card-content">
                        <h3>Total Sales</h3>
                        <div className="stat-value">{stats.totalSales}</div>
                        <div className="stat-subtitle">Successful purchases</div>
                    </div>
                    <div className="card-icon">📈</div>
                </motion.div>

                <motion.div className="earnings-card" whileHover={{ scale: 1.02 }}>
                    <div className="card-content">
                        <h3>Commission (10%)</h3>
                        <div className="stat-value">₹{(stats.totalEarnings * 0.1).toFixed(2)}</div>
                        <div className="stat-subtitle">Platform support fee</div>
                    </div>
                    <div className="card-icon">🛡️</div>
                </motion.div>
            </div>

            <div className="transactions-section">
                <div className="section-header">
                    <h2>Transaction History</h2>
                    <button className="refresh-btn" onClick={fetchData}>Refresh</button>
                </div>

                <div className="transactions-table-container">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Student</th>
                                <th>Amount</th>
                                <th>Your Share</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode='wait'>
                                {transactions.length > 0 ? (
                                    transactions.map((tx, i) => (
                                        <motion.tr 
                                            key={tx.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <td>{formatDate(tx.createdAt)}</td>
                                            <td>{tx.studentEmail}</td>
                                            <td className="amount-cell">₹{tx.amount}</td>
                                            <td className="share-cell">₹{tx.publisherAmount}</td>
                                            <td><span className={`status-pill ${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="empty-table">No transactions found.</td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            disabled={page === 0} 
                            onClick={() => setPage(p => p - 1)}
                        >Previous</button>
                        <span className="page-info">Page {page + 1} of {totalPages}</span>
                        <button 
                            disabled={page === totalPages - 1} 
                            onClick={() => setPage(p => p + 1)}
                        >Next</button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Earnings;
