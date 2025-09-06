export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Engineering',
  'Economics',
  'Business',
  'Literature',
  'History',
  'Psychology',
  'Statistics',
  'Data Science',
  'Machine Learning',
] as const;

export const SKILLS = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Data Analysis',
  'Public Speaking',
  'Writing',
  'Photography',
  'Video Editing',
  'Marketing',
  'Project Management',
  'Language Learning',
  'Music Production',
] as const;

export const RESOURCE_CATEGORIES = [
  'Lecture Notes',
  'Study Guides',
  'Past Exams',
  'Assignments',
  'Research Papers',
  'Textbooks',
  'Video Tutorials',
  'Code Examples',
] as const;

export const URGENCY_LEVELS = [
  { value: 'low', label: 'Within a week', color: 'text-green-600' },
  { value: 'medium', label: 'Within 24 hours', color: 'text-yellow-600' },
  { value: 'high', label: 'ASAP', color: 'text-red-600' },
] as const;

export const MAX_STUDY_GROUP_MEMBERS = 12;
export const MIN_TUTORING_PRICE = 5; // USDC
export const MAX_TUTORING_PRICE = 100; // USDC
export const PLATFORM_FEE_PERCENTAGE = 5; // 5% platform fee
