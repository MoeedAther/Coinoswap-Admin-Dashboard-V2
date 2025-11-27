"use client";

import { createContext, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store/hook';
import { loginAdmin, logoutAdmin, getSession } from '@/redux/slices/authSlice';
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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, admin, isLoading, error, requires2FA } = useAppSelector((state) => state.auth);

  // Check session on mount
  useEffect(() => {
    dispatch(getSession());
  }, [dispatch]);

  const login = async (email, password, twoFactorCode = null) => {
    try {
      const result = await dispatch(loginAdmin({ email, password, twoFactorCode }));
      
      if (loginAdmin.fulfilled.match(result)) {
        toast.success('Login successful!');
        router.push('/dashboard');
        return { success: true, requires2FA: false };
      } else {
        const errorMessage = result.payload?.message || 'Login failed';
        if (result.payload?.requires2FA) {
          return { success: false, requires2FA: true, message: errorMessage };
        }
        toast.error(errorMessage);
        return { success: false, requires2FA: false, message: errorMessage };
      }
    } catch (err) {
      toast.error('An error occurred during login');
      return { success: false, requires2FA: false, message: 'An error occurred' };
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutAdmin());
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err) {
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      user: admin,
      isLoading,
      error,
      requires2FA
    }}>
      {children}
    </AuthContext.Provider>
  );
};
