'use client';

import { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { QuickActions } from '@/components/features/QuickActions';
import { StatsOverview } from '@/components/features/StatsOverview';
import { TutoringCard } from '@/components/features/TutoringCard';
import { ResourceCard } from '@/components/features/ResourceCard';
import { StudyGroupCard } from '@/components/features/StudyGroupCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { type TutoringSession, type Resource, type StudyGroup } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { SUBJECTS, SKILLS } from '@/lib/constants';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Mock data - in a real app, this would come from APIs
  const [stats] = useState({
    totalSessions: 12,
    activeGroups: 3,
    resourcesSold: 8,
    totalEarnings: 156,
  });

  const [recentSessions] = useState<TutoringSession[]>([
    {
      sessionId: generateId(),
      tutorId: 'tutor123',
      studentId: 'student456',
      subject: 'Calculus II',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      status: 'pending',
      price: 25,
    },
    {
      sessionId: generateId(),
      tutorId: 'tutor789',
      studentId: 'student456',
      subject: 'React Development',
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      endTime: new Date(Date.now() - 23 * 60 * 60 * 1000),
      status: 'completed',
      price: 40,
    },
  ]);

  const [featuredResources] = useState<Resource[]>([
    {
      resourceId: generateId(),
      title: 'Advanced Calculus Study Guide',
      description: 'Comprehensive notes covering derivatives, integrals, and applications with practice problems.',
      uploaderUserId: 'user123',
      ipfsHash: 'QmExample123',
      price: 15,
      category: 'Study Guides',
      downloadCount: 47,
    },
    {
      resourceId: generateId(),
      title: 'Machine Learning Cheat Sheet',
      description: 'Quick reference for ML algorithms, formulas, and implementation tips.',
      uploaderUserId: 'user456',
      ipfsHash: 'QmExample456',
      price: 8,
      category: 'Reference',
      downloadCount: 23,
    },
  ]);

  const [activeGroups] = useState<StudyGroup[]>([
    {
      groupId: generateId(),
      groupName: 'CS 101 Study Circle',
      courseSubject: 'Computer Science',
      description: 'Weekly study sessions for intro to computer science. We cover algorithms, data structures, and programming fundamentals.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      members: ['user1', 'user2', 'user3', 'user4'],
      maxMembers: 8,
      isPrivate: false,
    },
  ]);

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleFindTutor = () => {
    setActiveModal('findTutor');
  };

  const handleBrowseResources = () => {
    setActiveModal('browseResources');
  };

  const handleJoinGroup = () => {
    setActiveModal('joinGroup');
  };

  const handleOfferSkill = () => {
    setActiveModal('offerSkill');
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <AppShell variant="glass">
      <Header title="PeerLink" showSearch showNotifications />
      
      {/* Quick Actions */}
      <QuickActions
        onFindTutor={handleFindTutor}
        onBrowseResources={handleBrowseResources}
        onJoinGroup={handleJoinGroup}
        onOfferSkill={handleOfferSkill}
      />

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Recent Sessions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Recent Sessions</h2>
        <div className="space-y-4">
          {recentSessions.map((session) => (
            <TutoringCard
              key={session.sessionId}
              session={session}
              onJoin={() => console.log('Join session:', session.sessionId)}
              onCancel={() => console.log('Cancel session:', session.sessionId)}
            />
          ))}
        </div>
      </section>

      {/* Featured Resources */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Featured Resources</h2>
        <div className="space-y-4">
          {featuredResources.map((resource) => (
            <ResourceCard
              key={resource.resourceId}
              resource={resource}
              onPurchase={() => console.log('Purchase resource:', resource.resourceId)}
              onPreview={() => console.log('Preview resource:', resource.resourceId)}
            />
          ))}
        </div>
      </section>

      {/* Active Study Groups */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Active Study Groups</h2>
        <div className="space-y-4">
          {activeGroups.map((group) => (
            <StudyGroupCard
              key={group.groupId}
              group={group}
              onJoin={() => console.log('Join group:', group.groupId)}
              onView={() => console.log('View group:', group.groupId)}
            />
          ))}
        </div>
      </section>

      {/* Find Tutor Modal */}
      <Modal
        isOpen={activeModal === 'findTutor'}
        onClose={closeModal}
        title="Find a Tutor"
        variant="dialog"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Subject
            </label>
            <select className="input-field">
              <option value="">Select a subject</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Description
            </label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Describe what you need help with..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Budget (USDC)
            </label>
            <Input type="number" placeholder="25" min="5" max="100" />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button onClick={closeModal} className="flex-1">
              Find Tutors
            </Button>
          </div>
        </div>
      </Modal>

      {/* Browse Resources Modal */}
      <Modal
        isOpen={activeModal === 'browseResources'}
        onClose={closeModal}
        title="Browse Resources"
        variant="sheet"
      >
        <div className="space-y-4">
          <Input variant="search" placeholder="Search resources..." />
          
          <div className="grid grid-cols-2 gap-2">
            {['All', 'Notes', 'Guides', 'Exams', 'Projects'].map((category) => (
              <button
                key={category}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {featuredResources.map((resource) => (
              <ResourceCard
                key={resource.resourceId}
                resource={resource}
                onPurchase={() => console.log('Purchase:', resource.resourceId)}
              />
            ))}
          </div>
        </div>
      </Modal>

      {/* Join Group Modal */}
      <Modal
        isOpen={activeModal === 'joinGroup'}
        onClose={closeModal}
        title="Join Study Group"
        variant="dialog"
      >
        <div className="space-y-4">
          <Input placeholder="Search groups..." />
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activeGroups.map((group) => (
              <StudyGroupCard
                key={group.groupId}
                group={group}
                onJoin={() => {
                  console.log('Join group:', group.groupId);
                  closeModal();
                }}
              />
            ))}
          </div>
        </div>
      </Modal>

      {/* Offer Skill Modal */}
      <Modal
        isOpen={activeModal === 'offerSkill'}
        onClose={closeModal}
        title="Offer Your Skill"
        variant="dialog"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Skill
            </label>
            <select className="input-field">
              <option value="">Select a skill</option>
              {SKILLS.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Description
            </label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Describe your expertise and what you can teach..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Rate (USDC/hour)
            </label>
            <Input type="number" placeholder="30" min="10" max="200" />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button onClick={closeModal} className="flex-1">
              List Skill
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
