'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useUserStore } from '@/lib/store/useUserStore';
import { useAppStore } from '@/lib/store/useAppStore';
import { SUBJECTS, SKILLS } from '@/lib/constants';
import { User } from '@/lib/types';

export default function ProfilePage() {
  const { user, updateUser, isLoading } = useUserStore();
  const { userSkills, fetchUserSkills } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
      fetchUserSkills(user.userId);
      setEditForm({
        username: user.username,
        bio: user.bio,
        skills: user.skills,
        courses: user.courses,
      });
    }
  }, [user, fetchUserSkills]);

  const handleSave = async () => {
    if (!user || !editForm) return;
    
    await updateUser(editForm);
    setIsEditing(false);
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = editForm.skills || [];
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    
    setEditForm(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleCourseToggle = (course: string) => {
    const currentCourses = editForm.courses || [];
    const updatedCourses = currentCourses.includes(course)
      ? currentCourses.filter(c => c !== course)
      : [...currentCourses, course];
    
    setEditForm(prev => ({ ...prev, courses: updatedCourses }));
  };

  if (!user) {
    return (
      <AppShell variant="glass">
        <Header title="Profile" />
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-textSecondary">Please connect your wallet to view your profile.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell variant="glass">
      <Header title="My Profile" />
      
      {/* Profile Card */}
      <div className="mb-8">
        <ProfileCard
          user={user}
          variant="detailed"
          onEdit={() => setIsEditing(true)}
        />
      </div>

      {/* Stats Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Activity Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface/60 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-sm text-textSecondary">Sessions Completed</div>
          </div>
          <div className="bg-surface/60 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent">4.8</div>
            <div className="text-sm text-textSecondary">Average Rating</div>
          </div>
          <div className="bg-surface/60 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">$156</div>
            <div className="text-sm text-textSecondary">Total Earned</div>
          </div>
          <div className="bg-surface/60 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent">3</div>
            <div className="text-sm text-textSecondary">Study Groups</div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">My Skills</h2>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
          {user.skills.length === 0 && (
            <p className="text-textSecondary text-sm">
              No skills added yet. Edit your profile to add skills.
            </p>
          )}
        </div>
      </section>

      {/* Courses Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">My Courses</h2>
        <div className="flex flex-wrap gap-2">
          {user.courses.map((course) => (
            <span
              key={course}
              className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
            >
              {course}
            </span>
          ))}
          {user.courses.length === 0 && (
            <p className="text-textSecondary text-sm">
              No courses added yet. Edit your profile to add courses.
            </p>
          )}
        </div>
      </section>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
        variant="sheet"
      >
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Username
              </label>
              <Input
                value={editForm.username || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Your username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Bio
              </label>
              <textarea
                className="input-field resize-none"
                rows={3}
                value={editForm.bio || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell others about yourself..."
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-3">
              Skills
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    editForm.skills?.includes(skill)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface border-gray-300 text-textPrimary hover:bg-gray-50'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Courses */}
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-3">
              Courses
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {SUBJECTS.map((course) => (
                <button
                  key={course}
                  onClick={() => handleCourseToggle(course)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    editForm.courses?.includes(course)
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface border-gray-300 text-textPrimary hover:bg-gray-50'
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
