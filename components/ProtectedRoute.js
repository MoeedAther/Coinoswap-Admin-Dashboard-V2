"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store/hook';
import { getSession } from '@/redux/slices/authSlice';

export const ProtectedRoute = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, sessionChecked } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Check session on mount if not already checked
    if (!sessionChecked) {
      dispatch(getSession());
    }
  }, [dispatch, sessionChecked]);

  useEffect(() => {
    // Only redirect if session has been checked and user is not authenticated
    if (sessionChecked && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, sessionChecked, router]);

  // Show loading while checking session
  if (isLoading || !sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after session check, return null (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
