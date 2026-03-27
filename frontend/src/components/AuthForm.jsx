import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ title, fields, onSubmit, submitText, footerText, footerLinkText, footerLinkTo }) => {
    const navigate = useNavigate();
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>{title}</h2>
                <form onSubmit={onSubmit}>
                    {fields.map((field, index) => (
                        <div key={index} style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>{field.label}</label>
                            {field.type === 'select' ? (
                                <select 
                                    value={field.value} 
                                    onChange={field.onChange} 
                                    required={field.required}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                >
                                    {field.options.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <input 
                                    type={field.type} 
                                    value={field.value} 
                                    onChange={field.onChange} 
                                    required={field.required}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            )}
                        </div>
                    ))}
                    <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' }}>
                        {submitText}
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <span style={{ color: '#666' }}>{footerText} </span>
                    <button 
                        onClick={() => navigate(footerLinkTo)} 
                        style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {footerLinkText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
