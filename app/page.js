"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/store/hook';
import { getSession } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/redux/store/hook';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, sessionChecked, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!sessionChecked) {
      dispatch(getSession());
    }
  }, [dispatch, sessionChecked]);

  useEffect(() => {
    if (sessionChecked && !isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, sessionChecked, isLoading, router]);

  // Show loading while checking session
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
