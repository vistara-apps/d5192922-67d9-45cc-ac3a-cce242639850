'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/Button';
import { User, LogOut, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

export function AuthButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [showProfile, setShowProfile] = useState(false);

  if (!ready) {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );
  }

  if (!authenticated) {
    return (
      <Button onClick={login} className="flex items-center gap-2">
        <Wallet size={16} />
        Connect Wallet
      </Button>
    );
  }

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleLogout = () => {
    logout();
    setShowProfile(false);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleProfileClick}
        className="flex items-center gap-2"
      >
        <User size={16} />
        {user?.farcaster?.displayName || user?.wallet?.address?.slice(0, 6) + '...' || 'Profile'}
      </Button>

      <Modal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        title="Profile"
        variant="dialog"
      >
        <div className="space-y-4">
          {user?.farcaster && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {user.farcaster.pfp && (
                <img
                  src={user.farcaster.pfp}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{user.farcaster.displayName}</p>
                <p className="text-sm text-gray-600">@{user.farcaster.username}</p>
                <p className="text-xs text-gray-500">FID: {user.farcaster.fid}</p>
              </div>
            </div>
          )}

          {user?.wallet && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Wallet Address</p>
              <p className="text-sm font-mono text-gray-600 break-all">
                {user.wallet.address}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowProfile(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex-1 flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
