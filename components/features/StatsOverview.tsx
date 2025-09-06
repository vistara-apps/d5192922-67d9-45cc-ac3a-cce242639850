'use client';

import { TrendingUp, Users, BookOpen, DollarSign } from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    totalSessions: number;
    activeGroups: number;
    resourcesSold: number;
    totalEarnings: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statItems = [
    {
      icon: BookOpen,
      label: 'Sessions',
      value: stats.totalSessions,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      icon: Users,
      label: 'Groups',
      value: stats.activeGroups,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      icon: TrendingUp,
      label: 'Resources',
      value: stats.resourcesSold,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      icon: DollarSign,
      label: 'Earned',
      value: `$${stats.totalEarnings}`,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {statItems.map((item) => (
        <div key={item.label} className="metric-card">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-textPrimary">{item.value}</p>
              <p className="text-sm text-textSecondary">{item.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
