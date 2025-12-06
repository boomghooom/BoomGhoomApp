/**
 * Finance Entities
 * Core domain models for dues, commissions, and transactions
 */

export type TransactionType =
  | 'due_added'
  | 'due_cleared'
  | 'commission_earned'
  | 'commission_available'
  | 'withdrawal_requested'
  | 'withdrawal_completed'
  | 'withdrawal_failed'
  | 'referral_reward';

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'commission';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description: string;
  eventId?: string;
  eventTitle?: string;
  paymentMethod?: PaymentMethod;
  gatewayFee?: number;
  gst?: number;
  netAmount?: number;
  referenceId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface DueRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  amount: number;
  currency: string;
  status: 'pending' | 'cleared';
  clearedVia?: 'payment' | 'commission';
  createdAt: string;
  clearedAt?: string;
}

export interface CommissionRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  totalGenerated: number;
  commissionRate: number; // 0.8 for 80%
  grossAmount: number;
  status: 'pending' | 'available' | 'withdrawn';
  participantsDuesCleared: number;
  totalParticipants: number;
  createdAt: string;
  availableAt?: string;
}

export interface WithdrawalRecord {
  id: string;
  amount: number;
  currency: string;
  gatewayFee: number;
  gst: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  bankDetails: BankDetails;
  requestedAt: string;
  processedAt?: string;
  failureReason?: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId?: string;
}

export interface FinanceSummary {
  totalDues: number;
  pendingCommission: number;
  availableCommission: number;
  minWithdrawalAmount: number;
  gatewayFeePercentage: number;
  gstPercentage: number;
  canWithdraw: boolean;
  currency: string;
}

// Constants
export const DUE_AMOUNT = 25; // INR
export const COMMISSION_RATE = 0.8; // 80%
export const MIN_WITHDRAWAL_AMOUNT = 1000; // INR
export const GATEWAY_FEE_PERCENTAGE = 0.02; // 2%
export const GST_PERCENTAGE = 0.18; // 18%

export const calculateWithdrawalBreakdown = (
  grossAmount: number
): {
  gatewayFee: number;
  gst: number;
  netAmount: number;
} => {
  const gatewayFee = grossAmount * GATEWAY_FEE_PERCENTAGE;
  const gst = gatewayFee * GST_PERCENTAGE;
  const netAmount = grossAmount - gatewayFee - gst;
  return { gatewayFee, gst, netAmount };
};

