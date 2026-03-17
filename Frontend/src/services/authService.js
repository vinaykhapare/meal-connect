import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000/api/donor';

export const authService = {
    login: async (credentials) => {
        try {
            console.log('Login Request:', {
                url: `${API_URL}/login`,
                data: credentials
            });
            
            const response = await axios({
                method: 'post',
                url: `${API_URL}/login`,
                data: credentials,
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            console.log('Login Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Login Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getProfile: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (data) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message);
            }
            return result;
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    }
}; 