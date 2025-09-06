import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

// Create Supabase client
export const supabase = createClient(
  config.api.supabase.url!,
  config.api.supabase.anonKey!
);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          farcaster_fid: string;
          username: string;
          bio: string | null;
          skills: string[];
          courses: string[];
          reputation_score: number;
          onchain_address: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farcaster_fid: string;
          username: string;
          bio?: string | null;
          skills?: string[];
          courses?: string[];
          reputation_score?: number;
          onchain_address: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farcaster_fid?: string;
          username?: string;
          bio?: string | null;
          skills?: string[];
          courses?: string[];
          reputation_score?: number;
          onchain_address?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      tutoring_sessions: {
        Row: {
          id: string;
          tutor_id: string;
          student_id: string;
          subject: string;
          start_time: string;
          end_time: string;
          status: 'pending' | 'active' | 'completed' | 'cancelled';
          price: number;
          payment_tx_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tutor_id: string;
          student_id: string;
          subject: string;
          start_time: string;
          end_time: string;
          status?: 'pending' | 'active' | 'completed' | 'cancelled';
          price: number;
          payment_tx_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tutor_id?: string;
          student_id?: string;
          subject?: string;
          start_time?: string;
          end_time?: string;
          status?: 'pending' | 'active' | 'completed' | 'cancelled';
          price?: number;
          payment_tx_hash?: string | null;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          skill_name: string;
          offered_by_user_id: string;
          description: string;
          price_or_exchange: number | string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          skill_name: string;
          offered_by_user_id: string;
          description: string;
          price_or_exchange: number | string;
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          skill_name?: string;
          offered_by_user_id?: string;
          description?: string;
          price_or_exchange?: number | string;
          category?: string;
          updated_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string;
          uploader_user_id: string;
          ipfs_hash: string;
          price: number;
          category: string;
          download_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          uploader_user_id: string;
          ipfs_hash: string;
          price: number;
          category: string;
          download_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          uploader_user_id?: string;
          ipfs_hash?: string;
          price?: number;
          category?: string;
          download_count?: number;
          updated_at?: string;
        };
      };
      study_groups: {
        Row: {
          id: string;
          group_name: string;
          course_subject: string;
          description: string;
          members: string[];
          max_members: number;
          is_private: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_name: string;
          course_subject: string;
          description: string;
          members?: string[];
          max_members?: number;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          group_name?: string;
          course_subject?: string;
          description?: string;
          members?: string[];
          max_members?: number;
          is_private?: boolean;
          updated_at?: string;
        };
      };
      tutoring_requests: {
        Row: {
          id: string;
          student_id: string;
          subject: string;
          description: string;
          urgency: 'low' | 'medium' | 'high';
          proposed_price: number;
          status: 'open' | 'accepted' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject: string;
          description: string;
          urgency?: 'low' | 'medium' | 'high';
          proposed_price: number;
          status?: 'open' | 'accepted' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          subject?: string;
          description?: string;
          urgency?: 'low' | 'medium' | 'high';
          proposed_price?: number;
          status?: 'open' | 'accepted' | 'completed';
          updated_at?: string;
        };
      };
    };
  };
}

// Typed Supabase client
export type SupabaseClient = typeof supabase;
