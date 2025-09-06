// Farcaster Frame component for in-frame interactions
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface FarcasterFrameProps {
  variant?: 'main' | 'interactive';
  title: string;
  description?: string;
  actions: FrameAction[];
  onAction: (actionId: string, data?: any) => void;
  className?: string;
}

interface FrameAction {
  id: string;
  label: string;
  type: 'button' | 'input' | 'redirect';
  variant?: 'primary' | 'secondary' | 'outline';
  url?: string;
  inputPlaceholder?: string;
}

export function FarcasterFrame({
  variant = 'main',
  title,
  description,
  actions,
  onAction,
  className
}: FarcasterFrameProps) {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const handleInputChange = (actionId: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [actionId]: value
    }));
  };

  const handleAction = (action: FrameAction) => {
    if (action.type === 'redirect' && action.url) {
      window.open(action.url, '_blank');
      return;
    }

    const data = action.type === 'input' ? inputValues[action.id] : undefined;
    onAction(action.id, data);
  };

  return (
    <div
      className={cn(
        'w-full max-w-md mx-auto',
        'bg-surface/80 backdrop-blur-sm',
        'border border-gray-200/20 rounded-xl',
        'p-6 space-y-4',
        variant === 'interactive' && 'shadow-modal',
        className
      )}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-textPrimary">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-textSecondary">
            {description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {actions.map((action) => (
          <div key={action.id} className="space-y-2">
            {action.type === 'input' && (
              <Input
                placeholder={action.inputPlaceholder || 'Enter value...'}
                value={inputValues[action.id] || ''}
                onChange={(e) => handleInputChange(action.id, e.target.value)}
                className="w-full"
              />
            )}
            
            <Button
              variant={action.variant || 'primary'}
              onClick={() => handleAction(action)}
              className="w-full"
              disabled={
                action.type === 'input' && !inputValues[action.id]?.trim()
              }
            >
              {action.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Predefined frame configurations
export const FRAME_CONFIGS = {
  findTutor: {
    title: 'Find a Tutor',
    description: 'Connect with peer tutors for academic help',
    actions: [
      {
        id: 'search-subject',
        label: 'Search by Subject',
        type: 'input' as const,
        inputPlaceholder: 'e.g., Calculus, React, Spanish...'
      },
      {
        id: 'browse-all',
        label: 'Browse All Tutors',
        type: 'button' as const,
        variant: 'outline' as const
      }
    ]
  },

  browseResources: {
    title: 'Study Resources',
    description: 'Discover notes, guides, and study materials',
    actions: [
      {
        id: 'search-resources',
        label: 'Search Resources',
        type: 'input' as const,
        inputPlaceholder: 'Search notes, guides, exams...'
      },
      {
        id: 'featured',
        label: 'View Featured',
        type: 'button' as const,
        variant: 'outline' as const
      }
    ]
  },

  createStudyGroup: {
    title: 'Create Study Group',
    description: 'Start a collaborative learning group',
    actions: [
      {
        id: 'group-subject',
        label: 'Enter Subject/Course',
        type: 'input' as const,
        inputPlaceholder: 'e.g., CS 101, Organic Chemistry...'
      },
      {
        id: 'join-existing',
        label: 'Join Existing Group',
        type: 'button' as const,
        variant: 'outline' as const
      }
    ]
  },

  offerSkill: {
    title: 'Offer Your Skill',
    description: 'Teach others and earn USDC',
    actions: [
      {
        id: 'skill-name',
        label: 'Enter Skill',
        type: 'input' as const,
        inputPlaceholder: 'e.g., Web Development, Design...'
      },
      {
        id: 'browse-skills',
        label: 'Browse Skill Requests',
        type: 'button' as const,
        variant: 'outline' as const
      }
    ]
  },

  paymentConfirm: {
    title: 'Confirm Payment',
    description: 'Secure USDC payment via Base',
    actions: [
      {
        id: 'confirm-payment',
        label: 'Pay with USDC',
        type: 'button' as const,
        variant: 'primary' as const
      },
      {
        id: 'cancel',
        label: 'Cancel',
        type: 'button' as const,
        variant: 'outline' as const
      }
    ]
  },

  sessionComplete: {
    title: 'Session Complete',
    description: 'Rate your experience and release payment',
    actions: [
      {
        id: 'rate-session',
        label: 'Rate & Complete',
        type: 'button' as const,
        variant: 'primary' as const
      },
      {
        id: 'report-issue',
        label: 'Report Issue',
        type: 'button' as const,
        variant: 'outline' as const
      }
    ]
  }
};

// Frame action handlers
export const createFrameActionHandler = (
  frameType: keyof typeof FRAME_CONFIGS,
  callbacks: Record<string, (data?: any) => void>
) => {
  return (actionId: string, data?: any) => {
    const handler = callbacks[actionId];
    if (handler) {
      handler(data);
    } else {
      console.warn(`No handler found for action: ${actionId}`);
    }
  };
};
