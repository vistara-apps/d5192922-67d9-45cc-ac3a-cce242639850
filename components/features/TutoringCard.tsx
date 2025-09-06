'use client';

import { type TutoringSession } from '@/lib/types';
import { formatDate, formatPrice, getStatusColor } from '@/lib/utils';
import { Clock, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TutoringCardProps {
  session: TutoringSession;
  onJoin?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export function TutoringCard({ 
  session, 
  onJoin, 
  onCancel, 
  showActions = true 
}: TutoringCardProps) {
  const isActive = session.status === 'active';
  const isPending = session.status === 'pending';
  const isCompleted = session.status === 'completed';

  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-textPrimary">{session.subject}</h3>
            <p className="text-sm text-textSecondary">
              {formatDate(session.startTime)} - {formatDate(session.endTime)}
            </p>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
          {session.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-textSecondary mb-4">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>Tutor ID: {session.tutorId.slice(0, 8)}...</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>
            {Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))} min
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-textPrimary">
          {formatPrice(session.price)}
        </div>
        
        {showActions && (
          <div className="flex gap-2">
            {isPending && onCancel && (
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            )}
            {(isActive || isPending) && onJoin && (
              <Button size="sm" onClick={onJoin}>
                {isActive ? 'Join Session' : 'Start Session'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
