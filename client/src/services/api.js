import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://ats-resume-builder-s0y9.onrender.com'
    : 'http://localhost:5000',
  timeout: 60000, // Increased timeout for file uploads
  maxContentLength: 50 * 1024 * 1024, // 50MB
  maxBodyLength: 50 * 1024 * 1024, // 50MB
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
      });
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        dataSize: JSON.stringify(response.data).length + ' chars'
      });
    }
    return response;
  },
  (error) => {
    // Enhanced error logging
    const errorInfo = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      timeout: error.code === 'ECONNABORTED' ? 'Request timed out' : null,
      network: !error.response ? 'Network error - server may be down' : null
    };
    
    console.error('❌ API Error Details:', errorInfo);
    
    // Add user-friendly error message
    if (error.code === 'ECONNABORTED') {
      error.userMessage = 'Request timed out. Please try again.';
    } else if (!error.response) {
      error.userMessage = 'Cannot connect to server. Please check your connection.';
    } else if (error.response.status >= 500) {
      error.userMessage = 'Server error. Please try again later.';
    } else if (error.response.status === 413) {
      error.userMessage = 'File too large. Please use a smaller file.';
    }
    
    return Promise.reject(error);
  }
);

export default api;