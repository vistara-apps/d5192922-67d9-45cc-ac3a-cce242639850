// Application state management with Zustand
import { create } from 'zustand';
import { TutoringSession, Resource, StudyGroup, Skill } from '@/lib/types';
import { 
  tutoringService, 
  resourceService, 
  studyGroupService, 
  skillService 
} from '@/lib/api/supabase';

interface AppState {
  // Tutoring state
  sessions: TutoringSession[];
  availableTutors: any[];
  
  // Resources state
  resources: Resource[];
  featuredResources: Resource[];
  
  // Study groups state
  studyGroups: StudyGroup[];
  userGroups: StudyGroup[];
  
  // Skills state
  skills: Skill[];
  userSkills: Skill[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  activeModal: string | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveModal: (modal: string | null) => void;
  
  // Tutoring actions
  fetchUserSessions: (userId: string) => Promise<void>;
  createTutoringSession: (session: Omit<TutoringSession, 'sessionId'>) => Promise<void>;
  updateSession: (sessionId: string, updates: Partial<TutoringSession>) => Promise<void>;
  findTutors: (subject: string) => Promise<void>;
  
  // Resource actions
  fetchResources: (category?: string) => Promise<void>;
  fetchFeaturedResources: () => Promise<void>;
  createResource: (resource: Omit<Resource, 'resourceId'>) => Promise<void>;
  searchResources: (query: string, category?: string) => Promise<void>;
  
  // Study group actions
  fetchStudyGroups: (subject?: string) => Promise<void>;
  fetchUserGroups: (userId: string) => Promise<void>;
  createStudyGroup: (group: Omit<StudyGroup, 'groupId'>) => Promise<void>;
  joinStudyGroup: (groupId: string, userId: string) => Promise<void>;
  leaveStudyGroup: (groupId: string, userId: string) => Promise<void>;
  
  // Skill actions
  fetchSkills: (category?: string) => Promise<void>;
  fetchUserSkills: (userId: string) => Promise<void>;
  createSkill: (skill: Omit<Skill, 'skillId'>) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  sessions: [],
  availableTutors: [],
  resources: [],
  featuredResources: [],
  studyGroups: [],
  userGroups: [],
  skills: [],
  userSkills: [],
  isLoading: false,
  error: null,
  activeModal: null,

  // UI actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setActiveModal: (activeModal) => set({ activeModal }),

  // Tutoring actions
  fetchUserSessions: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const sessions = await tutoringService.getUserSessions(userId);
      set({ sessions, isLoading: false });
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      set({ 
        error: 'Failed to fetch tutoring sessions',
        isLoading: false 
      });
    }
  },

  createTutoringSession: async (session: Omit<TutoringSession, 'sessionId'>) => {
    set({ isLoading: true, error: null });
    
    try {
      const newSession = await tutoringService.createSession(session);
      const { sessions } = get();
      set({ 
        sessions: [newSession, ...sessions],
        isLoading: false 
      });
    } catch (error) {
      console.error('Error creating tutoring session:', error);
      set({ 
        error: 'Failed to create tutoring session',
        isLoading: false 
      });
    }
  },

  updateSession: async (sessionId: string, updates: Partial<TutoringSession>) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedSession = await tutoringService.updateSession(sessionId, updates);
      const { sessions } = get();
      const updatedSessions = sessions.map(session => 
        session.sessionId === sessionId ? updatedSession : session
      );
      set({ 
        sessions: updatedSessions,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error updating session:', error);
      set({ 
        error: 'Failed to update session',
        isLoading: false 
      });
    }
  },

  findTutors: async (subject: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const tutors = await tutoringService.getAvailableTutors(subject);
      set({ 
        availableTutors: tutors,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error finding tutors:', error);
      set({ 
        error: 'Failed to find tutors',
        isLoading: false 
      });
    }
  },

  // Resource actions
  fetchResources: async (category?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const resources = await resourceService.getResources(category);
      set({ resources, isLoading: false });
    } catch (error) {
      console.error('Error fetching resources:', error);
      set({ 
        error: 'Failed to fetch resources',
        isLoading: false 
      });
    }
  },

  fetchFeaturedResources: async () => {
    try {
      const resources = await resourceService.getResources(undefined, 6);
      set({ featuredResources: resources });
    } catch (error) {
      console.error('Error fetching featured resources:', error);
    }
  },

  createResource: async (resource: Omit<Resource, 'resourceId'>) => {
    set({ isLoading: true, error: null });
    
    try {
      const newResource = await resourceService.createResource(resource);
      const { resources } = get();
      set({ 
        resources: [newResource, ...resources],
        isLoading: false 
      });
    } catch (error) {
      console.error('Error creating resource:', error);
      set({ 
        error: 'Failed to create resource',
        isLoading: false 
      });
    }
  },

  searchResources: async (query: string, category?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const resources = await resourceService.searchResources(query, category);
      set({ resources, isLoading: false });
    } catch (error) {
      console.error('Error searching resources:', error);
      set({ 
        error: 'Failed to search resources',
        isLoading: false 
      });
    }
  },

  // Study group actions
  fetchStudyGroups: async (subject?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const groups = await studyGroupService.getGroups(subject);
      set({ studyGroups: groups, isLoading: false });
    } catch (error) {
      console.error('Error fetching study groups:', error);
      set({ 
        error: 'Failed to fetch study groups',
        isLoading: false 
      });
    }
  },

  fetchUserGroups: async (userId: string) => {
    try {
      const allGroups = await studyGroupService.getGroups();
      const userGroups = allGroups.filter(group => 
        group.members.includes(userId)
      );
      set({ userGroups });
    } catch (error) {
      console.error('Error fetching user groups:', error);
    }
  },

  createStudyGroup: async (group: Omit<StudyGroup, 'groupId'>) => {
    set({ isLoading: true, error: null });
    
    try {
      const newGroup = await studyGroupService.createGroup(group);
      const { studyGroups } = get();
      set({ 
        studyGroups: [newGroup, ...studyGroups],
        isLoading: false 
      });
    } catch (error) {
      console.error('Error creating study group:', error);
      set({ 
        error: 'Failed to create study group',
        isLoading: false 
      });
    }
  },

  joinStudyGroup: async (groupId: string, userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedGroup = await studyGroupService.joinGroup(groupId, userId);
      const { studyGroups, userGroups } = get();
      
      const updatedStudyGroups = studyGroups.map(group => 
        group.groupId === groupId ? updatedGroup : group
      );
      
      set({ 
        studyGroups: updatedStudyGroups,
        userGroups: [...userGroups, updatedGroup],
        isLoading: false 
      });
    } catch (error) {
      console.error('Error joining study group:', error);
      set({ 
        error: 'Failed to join study group',
        isLoading: false 
      });
    }
  },

  leaveStudyGroup: async (groupId: string, userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedGroup = await studyGroupService.leaveGroup(groupId, userId);
      const { studyGroups, userGroups } = get();
      
      const updatedStudyGroups = studyGroups.map(group => 
        group.groupId === groupId ? updatedGroup : group
      );
      
      const updatedUserGroups = userGroups.filter(group => 
        group.groupId !== groupId
      );
      
      set({ 
        studyGroups: updatedStudyGroups,
        userGroups: updatedUserGroups,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error leaving study group:', error);
      set({ 
        error: 'Failed to leave study group',
        isLoading: false 
      });
    }
  },

  // Skill actions
  fetchSkills: async (category?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const skills = await skillService.getSkills(category);
      set({ skills, isLoading: false });
    } catch (error) {
      console.error('Error fetching skills:', error);
      set({ 
        error: 'Failed to fetch skills',
        isLoading: false 
      });
    }
  },

  fetchUserSkills: async (userId: string) => {
    try {
      const skills = await skillService.getUserSkills(userId);
      set({ userSkills: skills });
    } catch (error) {
      console.error('Error fetching user skills:', error);
    }
  },

  createSkill: async (skill: Omit<Skill, 'skillId'>) => {
    set({ isLoading: true, error: null });
    
    try {
      const newSkill = await skillService.createSkill(skill);
      const { skills, userSkills } = get();
      set({ 
        skills: [newSkill, ...skills],
        userSkills: [newSkill, ...userSkills],
        isLoading: false 
      });
    } catch (error) {
      console.error('Error creating skill:', error);
      set({ 
        error: 'Failed to create skill',
        isLoading: false 
      });
    }
  },
}));
