import { api } from './api';

export const authService = {
  async login(email, password) {
    try {
      console.log('Login attempt for:', email); // Debug log
      const response = await api.post('/login', { email, password });
      console.log('Login response:', response.data); // Debug log
      
      if (response.data.msg === "Login Successful") {
        const { token, user } = response.data;
        // Make sure we have the role information
        const userData = {
          ...user,
          role: user?.role || 'user' // Default to 'user' if role is not set
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Stored user data:', userData); // Debug log
        return { success: true, user: userData };
      }
      
      return { 
        success: false, 
        error: response.data.msg || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      const message = error.response?.data?.msg || 'An error occurred during login';
      return { success: false, error: message };
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      console.log('Registration response:', response.data); // Debug log
      
      if (response.data.msg === "Registered successfully") {
        return { success: true };
      }
      
      return { 
        success: false, 
        error: response.data.msg || 'Registration failed'
      };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      const message = error.response?.data?.msg || 'An error occurred during registration';
      return { success: false, error: message };
    }
  },

  async forgotPassword(email) {
    const response = await api.post('/forgetPassword', { email });
    return response.data;
  },

  async verifyToken() {
    try {
      const response = await api.get('/verify');
      if (response.data.success && response.data.user) {
        // Update stored user data with latest from server
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};
