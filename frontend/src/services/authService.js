import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth/';

const register = async (name, email, password, role) => {
    const response = await axios.post(API_URL + 'register', {
        name,
        email,
        password,
        role,
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const login = async (email, password) => {
    const response = await axios.post(API_URL + 'login', {
        email,
        password,
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default authService;
