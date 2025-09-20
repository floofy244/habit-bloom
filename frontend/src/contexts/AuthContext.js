import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Use relative URL since frontend is served from same domain as backend
        const response = await axios.get('/api/auth/profile/');
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      // If token is invalid, try to refresh it
      if (error.response?.status === 401) {
        await refreshToken();
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common['Authorization'];
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post('/api/token/refresh/', {
        refresh: refreshTokenValue
      });

      const { access } = response.data;
      localStorage.setItem('accessToken', access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Retry the original request
      const userResponse = await axios.get('/api/auth/profile/');
      setUser(userResponse.data);
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const login = async (email, password) => {
    try {
      // Use relative URL since frontend is served from same domain as backend
      const response = await axios.post('/api/auth/login/', { email, password });
      const { user: userData, access, refresh } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      setUser(userData);

      return { success: true };
    } catch (error) {
      let errorMessage = 'Login failed';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.response?.status === 400) {
        const details = error.response?.data?.details;
        if (details) {
          // Handle specific field errors
          if (details.email) {
            errorMessage = `Email error: ${details.email[0]}`;
          } else if (details.password) {
            errorMessage = `Password error: ${details.password[0]}`;
          } else if (details.non_field_errors) {
            errorMessage = details.non_field_errors[0];
          } else {
            errorMessage = error.response.data.error || 'Please check your input and try again.';
          }
        } else {
          errorMessage = error.response.data.error || 'Please provide both email and password.';
        }
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const register = async (email, username, password, passwordConfirm) => {
    try {
      // Use relative URL since frontend is served from same domain as backend
      const response = await axios.post('/api/auth/register/', {
        email,
        username,
        password,
        password_confirm: passwordConfirm
      });
      const { user: userData, access, refresh } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      setUser(userData);

      return { success: true };
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      if (error.response?.status === 400) {
        const details = error.response?.data?.details;
        if (details) {
          // Handle specific validation errors
          if (details.email) {
            errorMessage = `Email error: ${details.email[0]}`;
          } else if (details.username) {
            errorMessage = `Username error: ${details.username[0]}`;
          } else if (details.password) {
            errorMessage = `Password error: ${details.password[0]}`;
          } else if (details.password_confirm) {
            errorMessage = `Password confirmation error: ${details.password_confirm[0]}`;
          } else if (details.non_field_errors) {
            errorMessage = details.non_field_errors[0];
          } else {
            errorMessage = error.response.data.error || 'Please check your input and try again.';
          }
        } else {
          errorMessage = error.response.data.error || 'Please check your input and try again.';
        }
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (refreshTokenValue) {
        // Use relative URL since frontend is served from same domain as backend
        await axios.post('/api/auth/logout/', { refresh: refreshTokenValue });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
