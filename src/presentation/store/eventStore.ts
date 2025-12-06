/**
 * Event Store
 * Manages event-related state using Zustand
 */

import { create } from 'zustand';
import { Event, EventSummary, EventCategory } from '@domain/entities';

interface EventFilters {
  category?: EventCategory;
  priceRange?: { min: number; max: number };
  distance?: number;
  dateRange?: { start: string; end: string };
  genderAllowed?: string[];
  ageRange?: { min: number; max: number };
}

interface EventState {
  // State
  events: EventSummary[];
  featuredEvents: EventSummary[];
  nearbyEvents: EventSummary[];
  userEvents: EventSummary[];
  selectedEvent: Event | null;
  filters: EventFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  setEvents: (events: EventSummary[]) => void;
  setFeaturedEvents: (events: EventSummary[]) => void;
  setNearbyEvents: (events: EventSummary[]) => void;
  setUserEvents: (events: EventSummary[]) => void;
  setSelectedEvent: (event: Event | null) => void;
  setFilters: (filters: Partial<EventFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialFilters: EventFilters = {};

const initialState = {
  events: [],
  featuredEvents: [],
  nearbyEvents: [],
  userEvents: [],
  selectedEvent: null,
  filters: initialFilters,
  isLoading: false,
  error: null,
};

export const useEventStore = create<EventState>((set) => ({
  ...initialState,

  setEvents: (events) => set({ events }),
  setFeaturedEvents: (featuredEvents) => set({ featuredEvents }),
  setNearbyEvents: (nearbyEvents) => set({ nearbyEvents }),
  setUserEvents: (userEvents) => set({ userEvents }),
  setSelectedEvent: (selectedEvent) => set({ selectedEvent }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearFilters: () => set({ filters: initialFilters }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));

