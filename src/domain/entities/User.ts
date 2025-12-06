/**
 * User Entity
 * Core domain model for user data
 */

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type KYCStatus = 'not_started' | 'pending' | 'verified' | 'rejected';

export interface UserLocation {
  latitude: number;
  longitude: number;
  city: string;
  state?: string;
  country: string;
}

export interface UserKYC {
  status: KYCStatus;
  selfieUrl?: string;
  idUrl?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface UserFinance {
  dues: number;
  pendingCommission: number;
  availableCommission: number;
  totalEarned: number;
  totalWithdrawn: number;
}

export interface UserStats {
  eventsJoined: number;
  eventsCreated: number;
  eventsCompleted: number;
  friendsCount: number;
  averageRating: number;
  totalRatings: number;
}

export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  fullName: string;
  displayName?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bio?: string;
  location?: UserLocation;
  kyc: UserKYC;
  finance: UserFinance;
  stats: UserStats;
  referralCode: string;
  referredBy?: string;
  isOnline: boolean;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: string;
  displayName: string;
  avatarUrl?: string;
  gender?: Gender;
  age?: number;
  isOnline: boolean;
  averageRating: number;
}

export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

