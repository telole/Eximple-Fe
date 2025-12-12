import { create } from 'zustand';
import { progressAPI } from '../services/api';

const useProgressStore = create((set, get) => ({
  journeyMap: null,
  stats: null,
  isLoading: false,
  error: null,

  getJourneyMap: async (subjectLevelId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await progressAPI.getJourneyMap(subjectLevelId);
      if (response.success) {
        set({ journeyMap: response.data, isLoading: false, error: null });
        return { success: true, data: response.data };
      } else {
        set({ isLoading: false, error: response.error || 'Failed to load journey map' });
        return { success: false, error: response.error || 'Failed to load journey map' };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Failed to load journey map' });
      return { success: false, error: error.message || 'Failed to load journey map' };
    }
  },

  getStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await progressAPI.getStats();
      if (response.success) {
        set({ stats: response.data, isLoading: false, error: null });
        return { success: true, data: response.data };
      } else {
        set({ isLoading: false, error: response.error || 'Failed to load stats' });
        return { success: false, error: response.error || 'Failed to load stats' };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Failed to load stats' });
      return { success: false, error: error.message || 'Failed to load stats' };
    }
  },
}));

export default useProgressStore;

