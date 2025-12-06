/**
 * Auth Store
 * Manages authentication state using Zustand
 */

import { create } from 'zustand';
import { User, KYCStatus } from '@domain/entities';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnboardingComplete: boolean;
  token: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  updateKYCStatus: (status: KYCStatus) => void;
  logout: () => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isOnboardingComplete: false,
  token: null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setToken: (token) => set({ token }),

  setLoading: (isLoading) => set({ isLoading }),

  setOnboardingComplete: (isOnboardingComplete) => set({ isOnboardingComplete }),

  updateKYCStatus: (status) => {
    const { user } = get();
    if (user) {
      set({
        user: {
          ...user,
          kyc: { ...user.kyc, status },
        },
      });
    }
  },

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      token: null,
    }),

  reset: () => set(initialState),
}));

