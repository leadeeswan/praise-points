export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Child {
  id: number;
  name: string;
  birthDate: string | null;
  profileImage: string | null;
  username: string | null;
  authKey: string | null;
  totalPoints: number;
  createdAt: string;
}

export interface PointTransaction {
  id: number;
  transactionType: 'EARN' | 'SPEND';
  points: number;
  reason: string | null;
  message: string | null;
  createdAt: string;
}

export interface Reward {
  id: number;
  name: string;
  description: string | null;
  requiredPoints: number;
  category: 'TOY' | 'SNACK' | 'EXPERIENCE' | 'MONEY' | 'OTHER';
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
}

export interface Purchase {
  id: number;
  child: Child;
  reward: Reward;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  approvedAt: string | null;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
}

export interface ChildRequest {
  name: string;
  birthDate: string | null;
  profileImage: string | null;
  username: string | null;
  authKey: string | null;
}

export interface PointAwardRequest {
  childIds: number[];
  points: number;
  reason: string | null;
  message: string | null;
}

export interface RewardRequest {
  name: string;
  description: string | null;
  requiredPoints: number;
  category: 'TOY' | 'SNACK' | 'EXPERIENCE' | 'MONEY' | 'OTHER';
  imageUrl: string | null;
  active: boolean;
}

export interface PurchaseRequest {
  childId: number;
  rewardId: number;
}

export interface ChildAuthRequest {
  username: string;
  authKey: string;
}

export interface ChildAuthResponse {
  token: string;
  childId: number;
  name: string;
  totalPoints: number;
}

export interface ChildProfileResponse {
  id: number;
  name: string;
  birthDate: string | null;
  profileImage: string | null;
  totalPoints: number;
  reservedPoints: number;
  availablePoints: number;
  createdAt: string;
}

export interface PointTransactionResponse {
  id: number;
  transactionType: string;
  points: number;
  reason: string | null;
  message: string | null;
  createdAt: string;
}

export interface PurchaseHistoryResponse {
  id: number;
  rewardName: string;
  rewardDescription: string | null;
  requiredPoints: number;
  rewardImageUrl: string | null;
  status: string;
  requestedAt: string;
  approvedAt: string | null;
}

export interface RewardListResponse {
  id: number;
  name: string;
  description: string | null;
  requiredPoints: number;
  category: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}