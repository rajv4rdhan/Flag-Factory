import axios from 'axios';

// API base configuration
export const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This sends cookies with requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized but don't automatically redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Let the component handle the redirect logic
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // Auth endpoints
  signup: '/signup',
  login: '/login',
  
  // Public endpoints
  home: '/home',
  posts: '/posts',
  notices: '/notices',
  
  // Protected endpoints
  profile: '/profile',
  
  // Admin endpoints
  adminFlag: '/admin/flag',
  adminNotices: '/admin/notices',
};
