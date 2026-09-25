import api from './api';

export const authService = {
  // Register user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('tripgenie_token', response.data.data.token);
      localStorage.setItem('tripgenie_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Login user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('tripgenie_token', response.data.data.token);
      localStorage.setItem('tripgenie_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Get current user profile
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout() {
    localStorage.removeItem('tripgenie_token');
    localStorage.removeItem('tripgenie_user');
  },

  // Get stored user from localStorage
  getStoredUser() {
    const userStr = localStorage.getItem('tripgenie_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Check if token exists
  isAuthenticated() {
    return Boolean(localStorage.getItem('tripgenie_token'));
  },
};

export default authService;
