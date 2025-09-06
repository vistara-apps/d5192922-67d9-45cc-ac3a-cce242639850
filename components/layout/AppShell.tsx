'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  variant?: 'default' | 'glass';
  className?: string;
}

export function AppShell({ children, variant = 'default', className }: AppShellProps) {
  return (
    <div className={cn(
      'min-h-screen',
      variant === 'glass' && 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
      className
    )}>
      <div className="max-w-lg mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}
