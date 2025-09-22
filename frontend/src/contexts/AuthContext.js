import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

// Export the configured axios instance for backward compatibility
export { api as apiClient };

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
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await api.get('auth/profile/');
        setUser(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user points/level without full reload
  const updateUserStats = useCallback((points, level) => {
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        total_points: points !== undefined ? points : prev.total_points,
        current_level: level !== undefined ? level : prev.current_level
      };
    });
  }, []);


  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('auth/login/', { email, password });
      const { user: userData, access, refresh } = response.data;
      
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setUser(userData);

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.status === 401 
        ? 'Invalid email or password'
        : error.response?.data?.error || 'Login failed';
      
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (email, username, password, passwordConfirm) => {
    try {
      const response = await api.post('auth/register/', {
        email,
        username,
        password,
        password_confirm: passwordConfirm
      });
      const { user: userData, access, refresh } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setUser(userData);

      return { success: true };
    } catch (error) {
      const details = error.response?.data?.details;
      let errorMessage = 'Registration failed';
      
      if (details?.email) errorMessage = details.email[0];
      else if (details?.username) errorMessage = details.username[0];
      else if (details?.password) errorMessage = details.password[0];
      else if (error.response?.data?.error) errorMessage = error.response.data.error;
      
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('token/blacklist/', { refresh: refreshToken });
      }
    } catch (error) {
      // Silent fail - we're logging out anyway
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  }, []);

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    loading,
    fetchUser,
    updateUserStats
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
