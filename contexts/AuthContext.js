"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const session = sessionStorage.getItem('admin_session');
    if (session) {
      const userData = JSON.parse(session);
      setIsAuthenticated(true);
      setUser(userData);
    }
  }, []);

  const login = async (email, password) => {
    // Demo credentials - replace with actual API call
    if (email === 'admin@coinoswap.com' && password === 'admin123') {
      const userData = { email };
      sessionStorage.setItem('admin_session', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      toast.success('Login successful!');
      router.push('/dashboard');
      return true;
    }
    toast.error('Invalid credentials');
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
