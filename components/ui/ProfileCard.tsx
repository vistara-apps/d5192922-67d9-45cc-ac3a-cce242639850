'use client';

import { cn } from '@/lib/utils';
import { type ProfileCardProps } from '@/lib/types';
import { Star, MapPin, BookOpen } from 'lucide-react';
import { Button } from './Button';

export function ProfileCard({ user, variant = 'compact', onEdit }: ProfileCardProps) {
  const isCompact = variant === 'compact';
  const isEditable = variant === 'editable';

  return (
    <div className={cn(
      'glass-card p-6 animate-fade-in',
      isCompact && 'p-4'
    )}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={cn(
          'rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold',
          isCompact ? 'w-12 h-12 text-lg' : 'w-16 h-16 text-xl'
        )}>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            user.username.charAt(0).toUpperCase()
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={cn(
              'font-semibold text-textPrimary truncate',
              isCompact ? 'text-base' : 'text-lg'
            )}>
              {user.username}
            </h3>
            
            {/* Reputation Score */}
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{user.reputationScore}</span>
            </div>
          </div>

          {!isCompact && user.bio && (
            <p className="text-sm text-textSecondary mt-1 line-clamp-2">
              {user.bio}
            </p>
          )}

          {/* Skills */}
          {user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {user.skills.slice(0, isCompact ? 2 : 4).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                >
                  {skill}
                </span>
              ))}
              {user.skills.length > (isCompact ? 2 : 4) && (
                <span className="px-2 py-1 bg-gray-100 text-textSecondary text-xs rounded-md">
                  +{user.skills.length - (isCompact ? 2 : 4)} more
                </span>
              )}
            </div>
          )}

          {/* Courses */}
          {!isCompact && user.courses.length > 0 && (
            <div className="flex items-center gap-2 mt-2 text-sm text-textSecondary">
              <BookOpen className="w-4 h-4" />
              <span>{user.courses.slice(0, 2).join(', ')}</span>
              {user.courses.length > 2 && (
                <span>+{user.courses.length - 2} more</span>
              )}
            </div>
          )}

          {/* Actions */}
          {isEditable && onEdit && (
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={onEdit}>
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
