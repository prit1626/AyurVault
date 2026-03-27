import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await authService.register(name, email, password, role);
            navigate('/dashboard'); // placeholder
        } catch (error) {
            alert('Failed to register. Email may already be in use.');
        }
    };

    return (
        <AuthForm 
            title="Create AyurVault Account"
            fields={[
                { label: 'Full Name', type: 'text', value: name, onChange: (e) => setName(e.target.value), required: true },
                { label: 'Email', type: 'email', value: email, onChange: (e) => setEmail(e.target.value), required: true },
                { label: 'Password', type: 'password', value: password, onChange: (e) => setPassword(e.target.value), required: true },
                { 
                    label: 'Role', 
                    type: 'select', 
                    value: role, 
                    onChange: (e) => setRole(e.target.value), 
                    options: [
                        { label: 'Student', value: 'STUDENT' },
                        { label: 'Publisher', value: 'PUBLISHER' }
                    ]
                }
            ]}
            onSubmit={handleRegister}
            submitText="Register"
            footerText="Already have an account?"
            footerLinkText="Login here"
            footerLinkTo="/login"
        />
    );
};

export default Register;
