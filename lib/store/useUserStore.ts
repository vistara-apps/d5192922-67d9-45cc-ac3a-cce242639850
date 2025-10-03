// User state management with Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';
import { userService } from '@/lib/api/supabase';
import { neynarAPI } from '@/lib/api/neynar';

interface UserState {
  // State
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchUser: (userId: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  createUserFromFarcaster: (fid: number) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // Synchronous actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),

      // Async actions
      fetchUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await userService.getUser(userId);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          console.error('Error fetching user:', error);
          set({ 
            error: 'Failed to fetch user data',
            isLoading: false 
          });
        }
      },

      updateUser: async (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;

        set({ isLoading: true, error: null });

        try {
          const updatedUser = await userService.updateUser(user.userId, updates);
          set({ 
            user: updatedUser,
            isLoading: false,
            error: null 
          });
        } catch (error) {
          console.error('Error updating user:', error);
          set({ 
            error: 'Failed to update user data',
            isLoading: false 
          });
        }
      },

      createUserFromFarcaster: async (fid: number) => {
        set({ isLoading: true, error: null });

        try {
          // Fetch user data from Farcaster
          const farcasterUser = await neynarAPI.getUserByFid(fid);
          
          // Create user in our database
          const newUser = await userService.createUser({
            username: farcasterUser.username,
            bio: farcasterUser.profile?.bio?.text || '',
            skills: [],
            courses: [],
            reputationScore: 5, // Starting reputation
            onchainAddress: farcasterUser.verified_addresses?.eth_addresses?.[0] || '',
            avatar: farcasterUser.pfp_url,
          });

          set({ 
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null 
          });
        } catch (error) {
          console.error('Error creating user from Farcaster:', error);
          set({ 
            error: 'Failed to create user account',
            isLoading: false 
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false
        });
      },
    }),
    {
      name: 'peerlink-user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
