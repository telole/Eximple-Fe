import { create } from 'zustand';
import { achievementsAPI } from '../services/api';
import { triggerAchievement } from '../hooks/useAchievement.jsx';

const useAchievementsStore = create((set, get) => ({
  // State
  allAchievements: [],
  myAchievements: [],
  isLoading: false,
  error: null,

  // Actions
  getAchievements: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await achievementsAPI.getAchievements();
      set({ allAchievements: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  getMyAchievements: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await achievementsAPI.getMyAchievements();
      set({ myAchievements: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Helper to check and trigger achievement
  checkAndTriggerAchievement: (achievement) => {
    if (achievement) {
      triggerAchievement(
        achievement.title || achievement.name,
        achievement.description,
        achievement.icon_url ? 'a"���' : '���',
        achievement.points_reward || 0
      );
    }
  },
}));

export default useAchievementsStore;

