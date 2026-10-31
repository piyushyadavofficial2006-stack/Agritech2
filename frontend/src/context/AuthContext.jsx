import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile on startup if JWT token exists in localStorage
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('agritech_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        const authUser = res.data.user || res.data;
        setUser(authUser);
      } catch (err) {
        console.warn('Auth token expired or invalid:', err.message);
        localStorage.removeItem('agritech_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const authUser = res.data.user || res.data;
      const token = res.data.token;

      if (token) {
        localStorage.setItem('agritech_token', token);
      }
      setUser(authUser);
      return { success: true, user: authUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Register handler
  const register = async (userData) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', userData);
      const authUser = res.data.user || res.data;
      const token = res.data.token;

      if (token) {
        localStorage.setItem('agritech_token', token);
      }
      setUser(authUser);
      return { success: true, user: authUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('agritech_token');
    setUser(null);
  };

  // 1-Click Fast Demo Login
  const demoLogin = async (role = 'farmer') => {
    let email = 'farmer@agritech.com';
    let pass = 'password123';
    if (role === 'admin') {
      email = 'admin@agritech.com';
      pass = 'admin123';
    } else if (role === 'expert') {
      email = 'expert@agritech.com';
      pass = 'expert123';
    }
    return await login(email, pass);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        demoLogin,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isExpert: user?.role === 'expert'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
