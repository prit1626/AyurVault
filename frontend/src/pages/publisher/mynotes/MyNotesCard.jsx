import React from 'react';
import { motion } from 'framer-motion';

const MyNotesCard = ({ note, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDuration = (days) => {
        if (days >= 365) return `${Math.floor(days / 365)} Year(s)`;
        if (days >= 30) return `${Math.floor(days / 30)} Month(s)`;
        return `${days} Day(s)`;
    };

    return (
        <motion.div 
            className="note-card"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
        >
            <div className="note-card-header">
                <div className="badge-group">
                    <span className={`status-badge ${note.status.toLowerCase()}`}>
                        {note.status}
                    </span>
                    {note.isFree && <span className="free-badge">FREE</span>}
                </div>
                <span className="note-date">{formatDate(note.createdAt)}</span>
            </div>

            <div className="note-card-content">
                <h3 className="note-title">{note.title}</h3>
                <div className="note-meta">
                    <span className="meta-item">📚 {note.subject}</span>
                    <span className="meta-item">📖 Chapter: {note.chapter}</span>
                </div>
                <div className="note-details">
                    <div className="detail-item">
                        <span className="label">Price</span>
                        <span className="value">₹{note.price}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Duration</span>
                        <span className="value">{formatDuration(note.accessDuration)}</span>
                    </div>
                </div>
                {note.tags && (
                    <div className="note-tags">
                        {note.tags.split(',').map((tag, idx) => (
                            <span key={idx} className="tag">#{tag.trim()}</span>
                        ))}
                    </div>
                )}
            </div>

            <div className="note-card-actions">
                <button className="action-btn edit" onClick={() => onEdit(note)}>
                    ✏️ Edit
                </button>
                <button className="action-btn delete" onClick={() => onDelete(note.id)}>
                    🗑️ Delete
                </button>
            </div>
        </motion.div>
    );
};

export default MyNotesCard;
