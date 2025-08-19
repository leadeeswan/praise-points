import axios from 'axios';
import {
  AuthRequest,
  AuthResponse,
  SignupRequest,
  Child,
  ChildRequest,
  PointAwardRequest,
  PointTransaction,
  Reward,
  RewardRequest,
  Purchase,
  PurchaseRequest
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials: AuthRequest): Promise<AuthResponse> =>
    api.post('/auth/login', credentials).then(res => res.data),
  
  signup: (userData: SignupRequest): Promise<AuthResponse> =>
    api.post('/auth/signup', userData).then(res => res.data),
};

export const childAPI = {
  getChildren: (): Promise<Child[]> =>
    api.get('/children').then(res => res.data),
  
  createChild: (childData: ChildRequest): Promise<Child> =>
    api.post('/children', childData).then(res => res.data),
  
  updateChild: (id: number, childData: ChildRequest): Promise<Child> =>
    api.put(`/children/${id}`, childData).then(res => res.data),
  
  deleteChild: (id: number): Promise<void> =>
    api.delete(`/children/${id}`).then(res => res.data),
  
  getChild: (id: number): Promise<Child> =>
    api.get(`/children/${id}`).then(res => res.data),
};

export const pointAPI = {
  awardPoints: (request: PointAwardRequest): Promise<string> =>
    api.post('/points/award', request).then(res => res.data),
  
  getPointHistory: (childId: number): Promise<PointTransaction[]> =>
    api.get(`/points/history/${childId}`).then(res => res.data),
  
  getPointBalance: (childId: number): Promise<number> =>
    api.get(`/points/balance/${childId}`).then(res => res.data),
};

export const rewardAPI = {
  getRewards: (): Promise<Reward[]> =>
    api.get('/rewards').then(res => res.data),
  
  getActiveRewards: (): Promise<Reward[]> =>
    api.get('/rewards/active').then(res => res.data),
  
  createReward: (rewardData: RewardRequest): Promise<Reward> =>
    api.post('/rewards', rewardData).then(res => res.data),
  
  updateReward: (id: number, rewardData: RewardRequest): Promise<Reward> =>
    api.put(`/rewards/${id}`, rewardData).then(res => res.data),
  
  deleteReward: (id: number): Promise<void> =>
    api.delete(`/rewards/${id}`).then(res => res.data),
  
  toggleRewardStatus: (id: number): Promise<string> =>
    api.patch(`/rewards/${id}/toggle-status`).then(res => res.data),
};

export const purchaseAPI = {
  requestPurchase: (request: PurchaseRequest): Promise<Purchase> =>
    api.post('/purchases', request).then(res => res.data),
  
  approvePurchase: (id: number): Promise<Purchase> =>
    api.put(`/purchases/${id}/approve`).then(res => res.data),
  
  rejectPurchase: (id: number): Promise<Purchase> =>
    api.put(`/purchases/${id}/reject`).then(res => res.data),
  
  getPendingPurchases: (): Promise<Purchase[]> =>
    api.get('/purchases/pending').then(res => res.data),
  
  getAllPurchases: (): Promise<Purchase[]> =>
    api.get('/purchases').then(res => res.data),
  
  getPurchasesByChild: (childId: number): Promise<Purchase[]> =>
    api.get(`/purchases/child/${childId}`).then(res => res.data),
};