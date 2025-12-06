/**
 * Notification Store
 * Manages notification state using Zustand
 */

import { create } from 'zustand';
import { Notification, NotificationGroup } from '@domain/entities';

interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const calculateUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter((n) => !n.isRead).length;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  ...initialState,

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: calculateUnreadCount(notifications),
    }),

  addNotification: (notification) =>
    set((state) => {
      const newNotifications = [notification, ...state.notifications];
      return {
        notifications: newNotifications,
        unreadCount: calculateUnreadCount(newNotifications),
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const newNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications: newNotifications,
        unreadCount: calculateUnreadCount(newNotifications),
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => {
      const newNotifications = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: newNotifications,
        unreadCount: calculateUnreadCount(newNotifications),
      };
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));

