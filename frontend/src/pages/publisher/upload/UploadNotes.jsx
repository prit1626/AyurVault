import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadService from './UploadService';
import './UploadNotes.css';

const SUBJECTS = ['Ayurveda Fundamentals', 'Herbal Medicine', 'Anatomy & Physiology', 'Panchakarma', 'Yoga & Therapy', 'Other'];
const DURATION_UNITS = ['Day', 'Month', 'Year'];

const UploadNotes = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        customSubject: '',
        chapter: '',
        tags: '',
        price: '',
        isFree: false,
        accessDuration: '',
        durationUnit: 'Month'
    });

    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
    };

    const addFiles = (newFiles) => {
        setFiles(prev => [...prev, ...newFiles]);
        setMessage({ type: '', text: '' });
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            setMessage({ type: 'error', text: 'Please select at least one file to upload.' });
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        const data = new FormData();
        const finalSubject = formData.subject === 'Other' ? formData.customSubject : formData.subject;
        
        Object.keys(formData).forEach(key => {
            if (key === 'subject') {
                data.append(key, finalSubject);
            } else if (key !== 'customSubject') {
                data.append(key, formData[key]);
            }
        });
        files.forEach(file => data.append('files', file));

        try {
            await UploadService.uploadNote(data);
            setMessage({ type: 'success', text: 'Notes uploaded successfully! They are now active.' });
            setFormData({
                title: '', description: '', subject: '', customSubject: '', chapter: '', tags: '',
                price: '', isFree: false, accessDuration: '', durationUnit: 'Month'
            });
            setFiles([]);
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to upload notes. Please try again.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-card">
                <h2 className="upload-title">Upload New Research / Notes</h2>
                <p className="upload-subtitle">Share your knowledge with the AyurVault community.</p>

                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-section">
                        <h3 className="section-header">Basic Information</h3>
                        <div className="form-group">
                            <label>Title *</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Advanced Panchakarma Techniques" />
                        </div>
                        <div className="form-group">
                            <label>Description *</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} required placeholder="Briefly describe what these notes cover..." rows="4"></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Subject *</label>
                                {formData.subject !== 'Other' ? (
                                    <select 
                                        name="subject" 
                                        value={formData.subject} 
                                        onChange={handleInputChange} 
                                        required
                                    >
                                        <option value="">Select Subject</option>
                                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                ) : (
                                    <div className="custom-input-wrapper">
                                        <input 
                                            type="text" 
                                            name="customSubject" 
                                            value={formData.customSubject} 
                                            onChange={handleInputChange} 
                                            required 
                                            placeholder="Enter subject name" 
                                            autoFocus
                                        />
                                        <button 
                                            type="button" 
                                            className="back-to-select"
                                            onClick={() => setFormData(prev => ({ ...prev, subject: '', customSubject: '' }))}
                                            title="Back to list"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Chapter / Topic *</label>
                                <input type="text" name="chapter" value={formData.chapter} onChange={handleInputChange} required placeholder="e.g. Chapter 5: Cleansing" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Tags (Comma separated)</label>
                            <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="e.g. herbs, healing, detox" />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-header">Pricing & Access</h3>
                        <div className="form-group toggle-group" style={{ marginBottom: '16px' }}>
                            <label className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    name="isFree"
                                    checked={formData.isFree} 
                                    onChange={(e) => setFormData({
                                        ...formData, 
                                        isFree: e.target.checked,
                                        price: e.target.checked ? '0' : formData.price
                                    })}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span style={{ fontWeight: '600', color: '#4CAF50' }}>Free of Cost</span>
                            </label>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Price (₹) *</label>
                                <input 
                                    type="number" 
                                    name="price" 
                                    value={formData.price} 
                                    onChange={handleInputChange} 
                                    required={!formData.isFree} 
                                    placeholder="0.00" 
                                    min="0" 
                                    step="0.01" 
                                    disabled={formData.isFree}
                                />
                            </div>
                            <div className="form-group">
                                <label>Access Duration *</label>
                                <div className="duration-input-group">
                                    <input type="number" name="accessDuration" value={formData.accessDuration} onChange={handleInputChange} required placeholder="e.g. 6" min="1" />
                                    <select name="durationUnit" value={formData.durationUnit} onChange={handleInputChange}>
                                        {DURATION_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-header">File Upload</h3>
                        <div 
                            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <span className="drop-icon">📤</span>
                            <p>Drag & Drop files here or <span>Browse</span></p>
                            <p className="drop-info">Supported: PDF, Word, PPT, Images, Text</p>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                style={{ display: 'none' }} 
                                multiple 
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
                            />
                        </div>

                        <AnimatePresence>
                            {files.length > 0 && (
                                <div className="file-list">
                                    {files.map((file, index) => (
                                        <motion.div 
                                            key={index} 
                                            className="file-item"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <div className="file-info">
                                                <span className="file-icon">📄</span>
                                                <div className="file-details">
                                                    <span className="file-name">{file.name}</span>
                                                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                                                </div>
                                            </div>
                                            <button type="button" className="remove-file" onClick={(e) => { e.stopPropagation(); removeFile(index); }}>✕</button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {uploading && (
                        <div className="progress-container">
                            <div className="progress-bar">
                                <motion.div 
                                    className="progress-fill" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `100%` }}
                                    transition={{ duration: 2 }}
                                ></motion.div>
                            </div>
                            <p className="progress-text">Uploading files... please wait.</p>
                        </div>
                    )}

                    {message.text && (
                        <motion.div 
                            className={`message ${message.type}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    <div className="form-actions">
                        <button type="submit" className="upload-btn" disabled={uploading}>
                            {uploading ? 'Uploading...' : '🚀 Upload Notes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadNotes;
