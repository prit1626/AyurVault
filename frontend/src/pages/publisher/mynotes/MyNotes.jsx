import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MyNotesService from './MyNotesService';
import MyNotesCard from './MyNotesCard';
import './MyNotes.css';

const MyNotes = ({ onUploadClick }) => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubject, setFilterSubject] = useState('All');
    const [sortBy, setSortBy] = useState('latest');
    
    // Search Debounce state
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        price: '',
        isFree: false,
        accessDuration: '',
        durationUnit: 'day',
        tags: ''
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        fetchNotes(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        applyFilters();
    }, [notes, filterSubject, sortBy]);

    const fetchNotes = async (search = '') => {
        try {
            setLoading(true);
            const data = await MyNotesService.getMyNotes(search);
            setNotes(data || []);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...notes];

        // Subject Filter
        if (filterSubject !== 'All') {
            result = result.filter(n => n.subject === filterSubject);
        }

        // Sorting
        if (sortBy === 'latest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        }

        setFilteredNotes(result);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await MyNotesService.deleteNote(id);
                setNotes(notes.filter(n => n.id !== id));
            } catch (error) {
                alert('Failed to delete note');
            }
        }
    };

    const handleEditClick = (note) => {
        setEditingNote(note);
        setEditFormData({
            title: note.title,
            description: note.description || '',
            price: note.isFree ? 0 : note.price,
            isFree: note.isFree || false,
            accessDuration: note.accessDuration,
            durationUnit: 'day', // Defaulting to day, backend handles conversion
            tags: note.tags || ''
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updated = await MyNotesService.updateNote(editingNote.id, editFormData);
            setNotes(notes.map(n => n.id === editingNote.id ? updated : n));
            setIsEditModalOpen(false);
            setEditingNote(null);
        } catch (error) {
            alert('Failed to update note');
        }
    };

    const subjects = ['All', ...new Set(notes.map(n => n.subject))];

    if (loading) {
        return (
            <div className="mynotes-loader">
                <div className="spinner"></div>
                <p>Loading your notes...</p>
            </div>
        );
    }

    return (
        <div className="mynotes-container">
            <header className="mynotes-header">
                <div className="search-filter-bar">
                    <input 
                        type="text" 
                        placeholder="Search by title or subject..." 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <select 
                        className="filter-select"
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                    >
                        {subjects.map(s => <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>)}
                    </select>

                    <select 
                        className="filter-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="latest">Latest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </header>

            {filteredNotes.length > 0 ? (
                <motion.div className="notes-grid" layout>
                    <AnimatePresence mode="popLayout">
                        {filteredNotes.map(note => (
                            <MyNotesCard 
                                key={note.id} 
                                note={note} 
                                onDelete={handleDelete}
                                onEdit={handleEditClick}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="empty-state">
                    <span className="empty-icon">📚</span>
                    <h3>No Notes Found</h3>
                    <p>
                        {searchTerm || filterSubject !== 'All' 
                            ? "No notes match your filters. Try clearing them!" 
                            : "You haven't uploaded any notes yet. Start sharing your knowledge today!"}
                    </p>
                    <button className="upload-first-btn" onClick={onUploadClick}>
                        📤 Upload Your First Note
                    </button>
                </div>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <motion.div 
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="edit-modal"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                        >
                            <div className="modal-header">
                                <h2>Edit Note</h2>
                                <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>×</button>
                            </div>

                            <form className="edit-form" onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input 
                                        type="text" 
                                        value={editFormData.title} 
                                        onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea 
                                        rows="3"
                                        value={editFormData.description} 
                                        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                    />
                                </div>

                                <div className="form-group toggle-group">
                                    <label className="toggle-label">
                                        <input 
                                            type="checkbox" 
                                            checked={editFormData.isFree} 
                                            onChange={(e) => setEditFormData({
                                                ...editFormData, 
                                                isFree: e.target.checked,
                                                price: e.target.checked ? 0 : editFormData.price
                                            })}
                                        />
                                        <span className="toggle-text">Free of Cost</span>
                                    </label>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Price (₹)</label>
                                        <input 
                                            type="number" 
                                            value={editFormData.price} 
                                            onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                                            disabled={editFormData.isFree}
                                            required={!editFormData.isFree}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Access Duration</label>
                                        <div className="duration-input-group" style={{ display: 'flex', gap: '8px' }}>
                                            <input 
                                                type="number" 
                                                style={{ flex: 1 }}
                                                value={editFormData.accessDuration} 
                                                onChange={(e) => setEditFormData({...editFormData, accessDuration: e.target.value})}
                                                required
                                            />
                                            <select 
                                                value={editFormData.durationUnit}
                                                onChange={(e) => setEditFormData({...editFormData, durationUnit: e.target.value})}
                                            >
                                                <option value="day">Days</option>
                                                <option value="month">Months</option>
                                                <option value="year">Years</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Tags (Comma separated)</label>
                                    <input 
                                        type="text" 
                                        placeholder="ayurveda, herbology, etc."
                                        value={editFormData.tags} 
                                        onChange={(e) => setEditFormData({...editFormData, tags: e.target.value})}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button type="submit" className="save-btn">Save Changes</button>
                                    <button type="button" className="cancel-btn" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyNotes;
