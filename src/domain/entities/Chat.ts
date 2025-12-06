/**
 * Chat Entity
 * Core domain models for messaging
 */

import { UserSummary } from './User';

export type ChatType = 'direct' | 'event_group';

export type MessageType = 'text' | 'image' | 'event_share' | 'system';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  imageUrl?: string;
  eventId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  imageUrl?: string;
  eventId?: string;
  participants: UserSummary[];
  lastMessage?: Message;
  unreadCount: number;
  isMuted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSummary {
  id: string;
  type: ChatType;
  name: string;
  imageUrl?: string;
  lastMessage?: {
    content: string;
    senderName: string;
    createdAt: string;
  };
  unreadCount: number;
  isOnline?: boolean;
}

export interface FriendRequest {
  id: string;
  fromUser: UserSummary;
  toUserId: string;
  eventId: string;
  eventTitle: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Friend extends UserSummary {
  friendsSince: string;
  mutualEventsCount: number;
  lastActiveAt?: string;
}

