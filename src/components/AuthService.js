import axios from 'axios';

const API_URL = 'http://localhost:8080/api/';

class AuthService {
    async login(username, password) {
        try {
            const response = await axios.post(`${API_URL}auth/login`, { 
                username, 
                password 
            });
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            // Extract meaningful error message
            const errorMessage = error.response?.data?.message || 
                                 error.response?.data?.error || 
                                 'Login failed';
            throw new Error(errorMessage);
        }
    }

    async signup(userData) {
        try {
            const response = await axios.post(`${API_URL}auth/signup`, userData);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                 error.response?.data?.error || 
                                 'Signup failed';
            throw new Error(errorMessage);
        }
    }

    async updateProfile(userId, userData) {
        try {
            const response = await axios.put(`${API_URL}users/profile/${userId}`, userData);
            
            // Update the user in local storage
            const currentUser = this.getCurrentUser();
            const updatedUser = { ...currentUser, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            return updatedUser;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                 error.response?.data?.error || 
                                 'Profile update failed';
            throw new Error(errorMessage);
        }
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    isAuthenticated() {
        return !!localStorage.getItem('user');
    }
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const response = await axios.post(`${API_URL}users/change-password`, {
                userId,
                currentPassword,
                newPassword
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                                 error.response?.data?.error || 
                                 'Password change failed';
            throw new Error(errorMessage);
        }
    }

}

const authServiceInstance = new AuthService();
export default authServiceInstance;