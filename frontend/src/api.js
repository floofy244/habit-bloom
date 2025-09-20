// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://habitbloom.onrender.com/api/",
});

// Attach token before every request
api.interceptors.request.use(
  (config) => {
    // get token from localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request:', config.url, 'Token:', token ? token.substring(0, 50) + '...' : 'MISSING');
      console.log('Authorization header set:', config.headers.Authorization);
    } else {
      console.error('No access token found in localStorage!');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (refreshTokenValue) {
          const response = await axios.post('https://habitbloom.onrender.com/api/token/refresh/', {
            refresh: refreshTokenValue
          });
          
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
