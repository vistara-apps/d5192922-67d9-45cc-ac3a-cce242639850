'use client';

import { cn } from '@/lib/utils';
import { type ListItemProps } from '@/lib/types';
import { formatPrice, getStatusColor } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

export function ListItem({
  variant = 'withAvatar',
  title,
  subtitle,
  price,
  status,
  avatar,
  onClick,
  children,
}: ListItemProps) {
  const hasAvatar = variant === 'withAvatar';
  const hasPrice = variant === 'withPrice';
  const hasStatus = variant === 'withStatus';

  return (
    <div
      className={cn(
        'list-item cursor-pointer',
        onClick && 'hover:bg-gray-50'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Avatar */}
        {hasAvatar && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={title}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              title.charAt(0).toUpperCase()
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-textPrimary truncate">{title}</h4>
          {subtitle && (
            <p className="text-sm text-textSecondary truncate">{subtitle}</p>
          )}
        </div>

        {/* Price */}
        {hasPrice && price !== undefined && (
          <div className="text-right flex-shrink-0">
            <p className="font-semibold text-textPrimary">{formatPrice(price)}</p>
          </div>
        )}

        {/* Status */}
        {hasStatus && status && (
          <div className="flex-shrink-0">
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              getStatusColor(status)
            )}>
              {status}
            </span>
          </div>
        )}

        {/* Custom children */}
        {children}

        {/* Arrow */}
        {onClick && (
          <ChevronRight className="w-5 h-5 text-textSecondary flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
