'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name } from '@coinbase/onchainkit/identity';

interface HeaderProps {
  title: string;
  showSearch?: boolean;
  showNotifications?: boolean;
}

export function Header({ title, showSearch = false, showNotifications = true }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-textPrimary">{title}</h1>
        <p className="text-sm text-textSecondary mt-1">Connect, Learn, and Earn with Your Peers</p>
      </div>

      <div className="flex items-center gap-3">
        {showSearch && (
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4" />
          </Button>
        )}
        
        {showNotifications && (
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
        )}

        <Wallet>
          <ConnectWallet>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <Name />
            </div>
          </ConnectWallet>
        </Wallet>
      </div>
    </header>
  );
}
