import axios from 'axios';
import { config } from '../config';

// Neynar API client for Farcaster integration
const neynarClient = axios.create({
  baseURL: config.api.neynar.baseUrl,
  headers: {
    'api_key': config.api.neynar.apiKey,
    'Content-Type': 'application/json',
  },
});

// Types for Neynar API responses
export interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  bio: string;
  pfp_url: string;
  custody_address: string;
  follower_count: number;
  following_count: number;
  verifications: string[];
}

export interface FarcasterCast {
  hash: string;
  thread_hash: string;
  parent_hash?: string;
  parent_url?: string;
  root_parent_url?: string;
  parent_author?: FarcasterUser;
  author: FarcasterUser;
  text: string;
  timestamp: string;
  embeds: Array<{
    url?: string;
    cast_id?: {
      fid: number;
      hash: string;
    };
  }>;
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: Array<{
      fid: number;
      fname: string;
    }>;
    recasts: Array<{
      fid: number;
      fname: string;
    }>;
  };
  replies: {
    count: number;
  };
}

export interface FarcasterChannel {
  id: string;
  name: string;
  description: string;
  image_url: string;
  lead: FarcasterUser;
  follower_count: number;
}

// Neynar API service functions
export class NeynarService {
  // Get user by FID
  static async getUserByFid(fid: number): Promise<FarcasterUser | null> {
    try {
      const response = await neynarClient.get(`/user/bulk?fids=${fid}`);
      return response.data.users[0] || null;
    } catch (error) {
      console.error('Error fetching user by FID:', error);
      return null;
    }
  }

  // Get user by username
  static async getUserByUsername(username: string): Promise<FarcasterUser | null> {
    try {
      const response = await neynarClient.get(`/user/by_username?username=${username}`);
      return response.data.user || null;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  }

  // Get user's recent casts
  static async getUserCasts(fid: number, limit: number = 25): Promise<FarcasterCast[]> {
    try {
      const response = await neynarClient.get(`/user/casts?fid=${fid}&limit=${limit}`);
      return response.data.casts || [];
    } catch (error) {
      console.error('Error fetching user casts:', error);
      return [];
    }
  }

  // Get user's followers
  static async getUserFollowers(fid: number, limit: number = 100): Promise<FarcasterUser[]> {
    try {
      const response = await neynarClient.get(`/user/followers?fid=${fid}&limit=${limit}`);
      return response.data.users || [];
    } catch (error) {
      console.error('Error fetching user followers:', error);
      return [];
    }
  }

  // Get user's following
  static async getUserFollowing(fid: number, limit: number = 100): Promise<FarcasterUser[]> {
    try {
      const response = await neynarClient.get(`/user/following?fid=${fid}&limit=${limit}`);
      return response.data.users || [];
    } catch (error) {
      console.error('Error fetching user following:', error);
      return [];
    }
  }

  // Get channels user is following
  static async getUserChannels(fid: number): Promise<FarcasterChannel[]> {
    try {
      const response = await neynarClient.get(`/user/channels?fid=${fid}`);
      return response.data.channels || [];
    } catch (error) {
      console.error('Error fetching user channels:', error);
      return [];
    }
  }

  // Search users
  static async searchUsers(query: string, limit: number = 10): Promise<FarcasterUser[]> {
    try {
      const response = await neynarClient.get(`/user/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data.result.users || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Get cast by hash
  static async getCastByHash(hash: string): Promise<FarcasterCast | null> {
    try {
      const response = await neynarClient.get(`/cast?identifier=${hash}&type=hash`);
      return response.data.cast || null;
    } catch (error) {
      console.error('Error fetching cast by hash:', error);
      return null;
    }
  }

  // Get trending casts
  static async getTrendingCasts(limit: number = 25): Promise<FarcasterCast[]> {
    try {
      const response = await neynarClient.get(`/feed/trending?limit=${limit}`);
      return response.data.casts || [];
    } catch (error) {
      console.error('Error fetching trending casts:', error);
      return [];
    }
  }

  // Validate FID exists
  static async validateFid(fid: number): Promise<boolean> {
    try {
      const user = await this.getUserByFid(fid);
      return user !== null;
    } catch (error) {
      console.error('Error validating FID:', error);
      return false;
    }
  }
}

// Helper function to extract FID from Farcaster profile URL
export function extractFidFromUrl(url: string): number | null {
  const fidMatch = url.match(/fid:(\d+)/);
  if (fidMatch) {
    return parseInt(fidMatch[1], 10);
  }
  return null;
}

// Helper function to format Farcaster username
export function formatFarcasterUsername(username: string): string {
  return username.startsWith('@') ? username : `@${username}`;
}
