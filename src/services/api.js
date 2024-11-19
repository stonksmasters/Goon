import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api'; // Use relative path for compatibility with proxies

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include credentials for cross-origin requests
});

// Request Interceptor: Adds token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handles errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized error globally
    if (error.response?.status === 401) {
      console.warn('Unauthorized: Redirecting to login.');
      localStorage.removeItem('token');
      window.location.href = '/';
    } else if (error.response) {
      // Handle other server-side errors
      console.error(`API error (${error.response.status}):`, error.response.data);
    } else {
      // Handle client/network errors
      console.error('Network or client error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
