/**
 * Event Entity
 * Core domain model for events and group activities
 */

import { Gender, UserSummary } from './User';

export type EventType = 'sponsored' | 'user_created';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EventCategory =
  | 'sports'
  | 'music'
  | 'food'
  | 'travel'
  | 'games'
  | 'movies'
  | 'art'
  | 'tech'
  | 'fitness'
  | 'nightlife'
  | 'outdoor'
  | 'learning'
  | 'networking'
  | 'other';

export interface EventLocation {
  latitude: number;
  longitude: number;
  address: string;
  venueName: string;
  city: string;
  state?: string;
}

export interface EventEligibility {
  genderAllowed: Gender[];
  minAge: number;
  maxAge: number;
  maxDistance?: number; // in km
  memberLimit: number;
  requiresApproval: boolean;
}

export interface EventGenderRatio {
  male: number;
  female: number;
  other: number;
}

export interface EventPricing {
  isFree: boolean;
  price?: number;
  currency: string;
  includesGST: boolean;
}

export interface EventCoupon {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  maxUses: number;
  usedCount: number;
  validUntil: string;
}

export interface EventAdmin {
  id: string;
  displayName: string;
  avatarUrl?: string;
  averageRating: number;
  eventsCreated: number;
  isKYCVerified: boolean;
}

export interface Event {
  id: string;
  type: EventType;
  status: EventStatus;
  category: EventCategory;
  title: string;
  description: string;
  location: EventLocation;
  startTime: string;
  endTime: string;
  imageUrls: string[];
  coverImageUrl?: string;
  admin: EventAdmin;
  eligibility: EventEligibility;
  pricing: EventPricing;
  coupons: EventCoupon[];
  rules: string[];
  participants: UserSummary[];
  participantCount: number;
  waitlistCount: number;
  genderRatio: EventGenderRatio;
  averageAge: number;
  totalDuesGenerated: number;
  isJoined: boolean;
  isPendingApproval: boolean;
  isWaitlisted: boolean;
  canLeave: boolean;
  leaveDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventSummary {
  id: string;
  type: EventType;
  status: EventStatus;
  category: EventCategory;
  title: string;
  coverImageUrl?: string;
  location: Pick<EventLocation, 'venueName' | 'city'>;
  startTime: string;
  participantCount: number;
  memberLimit: number;
  pricing: EventPricing;
  averageRating?: number;
  distance?: number;
}

export interface CreateEventInput {
  category: EventCategory;
  title: string;
  description: string;
  location: EventLocation;
  startTime: string;
  endTime: string;
  imageUrls: string[];
  eligibility: EventEligibility;
  rules: string[];
}

export const getEventCategoryIcon = (category: EventCategory): string => {
  const icons: Record<EventCategory, string> = {
    sports: 'basketball-outline',
    music: 'musical-notes-outline',
    food: 'restaurant-outline',
    travel: 'airplane-outline',
    games: 'game-controller-outline',
    movies: 'film-outline',
    art: 'color-palette-outline',
    tech: 'laptop-outline',
    fitness: 'fitness-outline',
    nightlife: 'moon-outline',
    outdoor: 'leaf-outline',
    learning: 'book-outline',
    networking: 'people-outline',
    other: 'ellipsis-horizontal-outline',
  };
  return icons[category];
};

export const getEventCategoryLabel = (category: EventCategory): string => {
  const labels: Record<EventCategory, string> = {
    sports: 'Sports',
    music: 'Music',
    food: 'Food & Drinks',
    travel: 'Travel',
    games: 'Games',
    movies: 'Movies',
    art: 'Art & Culture',
    tech: 'Tech',
    fitness: 'Fitness',
    nightlife: 'Nightlife',
    outdoor: 'Outdoor',
    learning: 'Learning',
    networking: 'Networking',
    other: 'Other',
  };
  return labels[category];
};

