'use client';

import { type StudyGroup } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Users, BookOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StudyGroupCardProps {
  group: StudyGroup;
  onJoin?: () => void;
  onView?: () => void;
  showActions?: boolean;
}

export function StudyGroupCard({ 
  group, 
  onJoin, 
  onView, 
  showActions = true 
}: StudyGroupCardProps) {
  const isFull = group.members.length >= group.maxMembers;
  
  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-textPrimary">{group.groupName}</h3>
              {group.isPrivate && (
                <Lock className="w-4 h-4 text-textSecondary" />
              )}
            </div>
            <p className="text-sm text-textSecondary">{group.courseSubject}</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-textSecondary mb-4 line-clamp-2">
        {group.description}
      </p>

      <div className="flex items-center gap-4 text-sm text-textSecondary mb-4">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{group.members.length}/{group.maxMembers} members</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          <span>Created {formatDate(group.createdAt)}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={onView}>
              View Details
            </Button>
          )}
          {onJoin && !isFull && (
            <Button size="sm" onClick={onJoin}>
              Join Group
            </Button>
          )}
          {isFull && (
            <Button size="sm" disabled>
              Group Full
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
