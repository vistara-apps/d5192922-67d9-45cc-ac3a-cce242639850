'use client';

import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-textPrimary mb-2">
          Something went wrong!
        </h2>
        
        <p className="text-textSecondary mb-6">
          We encountered an error while loading PeerLink. Please try again.
        </p>
        
        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Go to homepage
          </Button>
        </div>
        
        {error.digest && (
          <p className="text-xs text-textSecondary mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
