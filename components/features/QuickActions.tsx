'use client';

import { BookOpen, Users, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuickActionsProps {
  onFindTutor: () => void;
  onBrowseResources: () => void;
  onJoinGroup: () => void;
  onOfferSkill: () => void;
}

export function QuickActions({
  onFindTutor,
  onBrowseResources,
  onJoinGroup,
  onOfferSkill,
}: QuickActionsProps) {
  const actions = [
    {
      icon: BookOpen,
      label: 'Find Tutor',
      description: 'Get help from peers',
      onClick: onFindTutor,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FileText,
      label: 'Browse Resources',
      description: 'Study materials & notes',
      onClick: onBrowseResources,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      label: 'Join Study Group',
      description: 'Collaborative learning',
      onClick: onJoinGroup,
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: Zap,
      label: 'Offer Skill',
      description: 'Teach & earn',
      onClick: onOfferSkill,
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="glass-card p-4 text-left hover:scale-105 transition-all duration-200 group"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-200`}>
            <action.icon className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-textPrimary mb-1">{action.label}</h3>
          <p className="text-sm text-textSecondary">{action.description}</p>
        </button>
      ))}
    </div>
  );
}
