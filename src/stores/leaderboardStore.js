import { create } from 'zustand';
import { leaderboardAPI } from '../services/api';

const useLeaderboardStore = create((set, get) => ({
  leaderboard: [],
  myRank: null,
  isLoading: false,
  error: null,

  getLeaderboard: async (type = 'total', limit = 100) => {
    set({ isLoading: true, error: null });
    try {
      const response = await leaderboardAPI.getLeaderboard(type, limit);
      // API response structure: { success: true, data: { type: "total", leaderboard: [...] } }
      // Or: { success: true, data: [...] } (array directly)
      let leaderboardData = [];
      
      if (Array.isArray(response)) {
        // Response is directly an array
        leaderboardData = response;
      } else if (response.data) {
        if (Array.isArray(response.data)) {
          // response.data is an array
          leaderboardData = response.data;
        } else if (response.data.leaderboard && Array.isArray(response.data.leaderboard)) {
          // response.data.leaderboard is the array (from API docs)
          leaderboardData = response.data.leaderboard;
        } else {
          leaderboardData = [];
        }
      } else {
        leaderboardData = [];
      }
      
      set({ leaderboard: leaderboardData, isLoading: false, error: null });
      return { success: true, data: leaderboardData };
    } catch (error) {
      const errorMessage = error.message || 'Failed to load leaderboard';
      set({ isLoading: false, error: errorMessage, leaderboard: [] });
      return { success: false, error: errorMessage };
    }
  },

  getMyRank: async (type = 'total') => {
    // Don't set loading here to avoid double loading state
    try {
      const response = await leaderboardAPI.getMyRank(type);
      // API returns data directly, not wrapped in {success, data}
      const rankData = response.data || response || null;
      set({ myRank: rankData, error: null });
      return { success: true, data: rankData };
    } catch (error) {
      const errorMessage = error.message || 'Failed to load rank';
      set({ myRank: null, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },
}));

export default useLeaderboardStore;

