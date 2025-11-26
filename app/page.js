"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
          CoinoSwap Admin
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Powerful cryptocurrency exchange management platform
        </p>
        <Button size="lg" onClick={() => router.push('/login')} className="gap-2">
          Get Started
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
