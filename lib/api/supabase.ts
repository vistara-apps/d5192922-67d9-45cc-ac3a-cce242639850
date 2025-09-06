// Supabase integration for database operations
import { createClient } from '@supabase/supabase-js';
import { User, TutoringSession, Resource, StudyGroup, Skill, TutoringRequest } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'userId'>;
        Update: Partial<User>;
      };
      tutoring_sessions: {
        Row: TutoringSession;
        Insert: Omit<TutoringSession, 'sessionId'>;
        Update: Partial<TutoringSession>;
      };
      resources: {
        Row: Resource;
        Insert: Omit<Resource, 'resourceId'>;
        Update: Partial<Resource>;
      };
      study_groups: {
        Row: StudyGroup;
        Insert: Omit<StudyGroup, 'groupId'>;
        Update: Partial<StudyGroup>;
      };
      skills: {
        Row: Skill;
        Insert: Omit<Skill, 'skillId'>;
        Update: Partial<Skill>;
      };
      tutoring_requests: {
        Row: TutoringRequest;
        Insert: Omit<TutoringRequest, 'requestId'>;
        Update: Partial<TutoringRequest>;
      };
    };
  };
}

// User operations
export const userService = {
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async createUser(user: Omit<User, 'userId'>) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('userId', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async searchUsers(query: string, skills?: string[]) {
    let queryBuilder = supabase
      .from('users')
      .select('*')
      .or(`username.ilike.%${query}%,bio.ilike.%${query}%`);

    if (skills && skills.length > 0) {
      queryBuilder = queryBuilder.contains('skills', skills);
    }

    const { data, error } = await queryBuilder;
    if (error) throw error;
    return data;
  },
};

// Tutoring session operations
export const tutoringService = {
  async createSession(session: Omit<TutoringSession, 'sessionId'>) {
    const { data, error } = await supabase
      .from('tutoring_sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserSessions(userId: string, role: 'tutor' | 'student' | 'both' = 'both') {
    let query = supabase.from('tutoring_sessions').select('*');

    if (role === 'tutor') {
      query = query.eq('tutorId', userId);
    } else if (role === 'student') {
      query = query.eq('studentId', userId);
    } else {
      query = query.or(`tutorId.eq.${userId},studentId.eq.${userId}`);
    }

    const { data, error } = await query.order('startTime', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateSession(sessionId: string, updates: Partial<TutoringSession>) {
    const { data, error } = await supabase
      .from('tutoring_sessions')
      .update(updates)
      .eq('sessionId', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAvailableTutors(subject: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .contains('skills', [subject])
      .gt('reputationScore', 3);

    if (error) throw error;
    return data;
  },
};

// Resource operations
export const resourceService = {
  async createResource(resource: Omit<Resource, 'resourceId'>) {
    const { data, error } = await supabase
      .from('resources')
      .insert(resource)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getResources(category?: string, limit = 20) {
    let query = supabase
      .from('resources')
      .select('*')
      .order('downloadCount', { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async searchResources(query: string, category?: string) {
    let queryBuilder = supabase
      .from('resources')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    const { data, error } = await queryBuilder;
    if (error) throw error;
    return data;
  },

  async updateDownloadCount(resourceId: string) {
    const { data, error } = await supabase
      .rpc('increment_download_count', { resource_id: resourceId });

    if (error) throw error;
    return data;
  },
};

// Study group operations
export const studyGroupService = {
  async createGroup(group: Omit<StudyGroup, 'groupId'>) {
    const { data, error } = await supabase
      .from('study_groups')
      .insert(group)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getGroups(subject?: string, limit = 20) {
    let query = supabase
      .from('study_groups')
      .select('*')
      .eq('isPrivate', false)
      .order('createdAt', { ascending: false })
      .limit(limit);

    if (subject) {
      query = query.eq('courseSubject', subject);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async joinGroup(groupId: string, userId: string) {
    // First get the current group
    const { data: group, error: fetchError } = await supabase
      .from('study_groups')
      .select('*')
      .eq('groupId', groupId)
      .single();

    if (fetchError) throw fetchError;

    // Check if user is already a member
    if (group.members.includes(userId)) {
      throw new Error('User is already a member of this group');
    }

    // Check if group is full
    if (group.members.length >= group.maxMembers) {
      throw new Error('Group is full');
    }

    // Add user to members array
    const updatedMembers = [...group.members, userId];

    const { data, error } = await supabase
      .from('study_groups')
      .update({ members: updatedMembers })
      .eq('groupId', groupId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async leaveGroup(groupId: string, userId: string) {
    const { data: group, error: fetchError } = await supabase
      .from('study_groups')
      .select('*')
      .eq('groupId', groupId)
      .single();

    if (fetchError) throw fetchError;

    const updatedMembers = group.members.filter((id: string) => id !== userId);

    const { data, error } = await supabase
      .from('study_groups')
      .update({ members: updatedMembers })
      .eq('groupId', groupId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Skill operations
export const skillService = {
  async createSkill(skill: Omit<Skill, 'skillId'>) {
    const { data, error } = await supabase
      .from('skills')
      .insert(skill)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSkills(category?: string, limit = 20) {
    let query = supabase
      .from('skills')
      .select('*')
      .order('skillName')
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getUserSkills(userId: string) {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('offeredByUserId', userId);

    if (error) throw error;
    return data;
  },
};

// Real-time subscriptions
export const subscriptions = {
  subscribeToUserSessions(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('user-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tutoring_sessions',
          filter: `tutorId=eq.${userId}`,
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tutoring_sessions',
          filter: `studentId=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToGroupUpdates(groupId: string, callback: (payload: any) => void) {
    return supabase
      .channel('group-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'study_groups',
          filter: `groupId=eq.${groupId}`,
        },
        callback
      )
      .subscribe();
  },
};
