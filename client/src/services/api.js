import axios from "axios";

// FIXED: Updated API URL to match server route structure
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://ats-resume-builder-s0y9.onrender.com'
    : 'http://localhost:5000',
  timeout: 60000, // Increased timeout for AI processing
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
    });
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
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    
    // Better error handling
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout - AI processing is taking longer than expected';
    } else if (!error.response) {
      error.message = 'Cannot connect to server. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export default api;