/**
 * Notification Entity
 * Core domain model for notifications
 */

export type NotificationType =
  | 'event_join_request'
  | 'event_join_approved'
  | 'event_join_rejected'
  | 'event_reminder'
  | 'event_update'
  | 'event_cancelled'
  | 'event_completed'
  | 'friend_request'
  | 'friend_accepted'
  | 'friend_event_created'
  | 'message_received'
  | 'due_reminder'
  | 'commission_available'
  | 'withdrawal_completed'
  | 'kyc_approved'
  | 'kyc_rejected'
  | 'referral_reward'
  | 'system';

export interface NotificationAction {
  label: string;
  route: string;
  params?: Record<string, string>;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  imageUrl?: string;
  data?: Record<string, unknown>;
  action?: NotificationAction;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationGroup {
  date: string;
  notifications: Notification[];
}

export const getNotificationIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    event_join_request: 'person-add-outline',
    event_join_approved: 'checkmark-circle-outline',
    event_join_rejected: 'close-circle-outline',
    event_reminder: 'alarm-outline',
    event_update: 'refresh-outline',
    event_cancelled: 'calendar-outline',
    event_completed: 'trophy-outline',
    friend_request: 'people-outline',
    friend_accepted: 'heart-outline',
    friend_event_created: 'sparkles-outline',
    message_received: 'chatbubble-outline',
    due_reminder: 'wallet-outline',
    commission_available: 'cash-outline',
    withdrawal_completed: 'card-outline',
    kyc_approved: 'shield-checkmark-outline',
    kyc_rejected: 'shield-outline',
    referral_reward: 'gift-outline',
    system: 'information-circle-outline',
  };
  return icons[type];
};

export const getNotificationColor = (type: NotificationType): string => {
  const successTypes: NotificationType[] = [
    'event_join_approved',
    'event_completed',
    'friend_accepted',
    'commission_available',
    'withdrawal_completed',
    'kyc_approved',
    'referral_reward',
  ];
  const warningTypes: NotificationType[] = ['event_reminder', 'due_reminder', 'event_update'];
  const errorTypes: NotificationType[] = ['event_join_rejected', 'event_cancelled', 'kyc_rejected'];

  if (successTypes.includes(type)) return 'success';
  if (warningTypes.includes(type)) return 'warning';
  if (errorTypes.includes(type)) return 'error';
  return 'info';
};

