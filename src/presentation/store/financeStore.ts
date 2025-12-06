/**
 * Finance Store
 * Manages dues, commissions, and transaction state using Zustand
 */

import { create } from 'zustand';
import {
  Transaction,
  DueRecord,
  CommissionRecord,
  WithdrawalRecord,
  FinanceSummary,
} from '@domain/entities';

interface FinanceState {
  // State
  summary: FinanceSummary | null;
  transactions: Transaction[];
  dues: DueRecord[];
  commissions: CommissionRecord[];
  withdrawals: WithdrawalRecord[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setSummary: (summary: FinanceSummary) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setDues: (dues: DueRecord[]) => void;
  setCommissions: (commissions: CommissionRecord[]) => void;
  setWithdrawals: (withdrawals: WithdrawalRecord[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  summary: null,
  transactions: [],
  dues: [],
  commissions: [],
  withdrawals: [],
  isLoading: false,
  error: null,
};

export const useFinanceStore = create<FinanceState>((set) => ({
  ...initialState,

  setSummary: (summary) => set({ summary }),
  setTransactions: (transactions) => set({ transactions }),
  setDues: (dues) => set({ dues }),
  setCommissions: (commissions) => set({ commissions }),
  setWithdrawals: (withdrawals) => set({ withdrawals }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));

