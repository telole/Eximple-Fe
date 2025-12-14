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
        // Backend may return array directly or object with 'levels' property
        // Normalize to always have 'levels' property
        const journeyMapData = Array.isArray(response.data) 
          ? { levels: response.data }
          : (response.data?.levels ? response.data : { levels: response.data || [] });
        
        set({ journeyMap: journeyMapData, isLoading: false, error: null });
        return { success: true, data: journeyMapData };
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

  startLevel: async (levelId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await progressAPI.startLevel(levelId);
      if (response.success) {
        set({ isLoading: false, error: null });
        return { success: true, data: response.data };
      } else {
        set({ isLoading: false, error: response.error || 'Failed to start level' });
        return { success: false, error: response.error || 'Failed to start level' };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Failed to start level' });
      return { success: false, error: error.message || 'Failed to start level' };
    }
  },

  completeLevel: async (levelId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await progressAPI.completeLevel(levelId);
      if (response.success) {
        set({ isLoading: false, error: null });
        return { 
          success: true, 
          data: response.data,
          message: response.message || 'Level completed successfully'
        };
      } else {
        // Extract error message from response
        let errorMessage = 'Gagal menyelesaikan level.';
        if (response.error) {
          errorMessage = typeof response.error === 'string' 
            ? response.error 
            : (response.error.message || errorMessage);
        } else if (response.message) {
          errorMessage = response.message;
        }
        
        set({ isLoading: false, error: errorMessage });
        return { 
          success: false, 
          error: errorMessage
        };
      }
    } catch (error) {
      let errorMessage = 'Gagal menyelesaikan level.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
}));

export default useProgressStore;

