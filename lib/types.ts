// Core data types for PeerLink
export interface User {
  userId: string; // Farcaster FID
  username: string;
  bio: string;
  skills: string[];
  courses: string[];
  reputationScore: number;
  onchainAddress: string;
  avatar?: string;
}

export interface TutoringSession {
  sessionId: string;
  tutorId: string;
  studentId: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  price: number; // in USDC
  paymentTxHash?: string;
}

export interface Skill {
  skillId: string;
  skillName: string;
  offeredByUserId: string;
  description: string;
  priceOrExchange: number | 'exchange';
  category: string;
}

export interface Resource {
  resourceId: string;
  title: string;
  description: string;
  uploaderUserId: string;
  ipfsHash: string;
  price: number; // in USDC
  category: string;
  downloadCount: number;
}

export interface StudyGroup {
  groupId: string;
  groupName: string;
  courseSubject: string;
  description: string;
  createdAt: Date;
  members: string[];
  maxMembers: number;
  isPrivate: boolean;
}

export interface TutoringRequest {
  requestId: string;
  studentId: string;
  subject: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  proposedPrice: number;
  status: 'open' | 'accepted' | 'completed';
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Component prop types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface ProfileCardProps {
  user: User;
  variant?: 'compact' | 'detailed' | 'editable';
  onEdit?: () => void;
}

export interface ListItemProps {
  variant?: 'withAvatar' | 'withPrice' | 'withStatus';
  title: string;
  subtitle?: string;
  price?: number;
  status?: string;
  avatar?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}
