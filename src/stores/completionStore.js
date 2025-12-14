import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCompletionStore = create(
  persist(
    (set, get) => ({
      // Track last completion date
      lastCompletionDate: null,
      // Track if first completion today
      firstCompletionToday: false,
      // Track if streak was activated today
      streakActivatedToday: false,
      // Track previous streak count
      previousStreak: 0,

      // Mark completion
      markCompletion: (currentStreak) => {
        const today = new Date().toDateString();
        const lastDate = get().lastCompletionDate;
        const wasFirstToday = lastDate !== today;
        const wasStreakActivated = currentStreak === 1 && get().previousStreak === 0;

        set({
          lastCompletionDate: today,
          firstCompletionToday: wasFirstToday,
          streakActivatedToday: wasStreakActivated,
          previousStreak: currentStreak,
        });

        return {
          firstCompletionToday: wasFirstToday,
          streakActivatedToday: wasStreakActivated,
        };
      },

      // Update streak
      updateStreak: (currentStreak) => {
        set({ previousStreak: currentStreak });
      },

      // Reset daily flags
      resetDailyFlags: () => {
        const today = new Date().toDateString();
        const lastDate = get().lastCompletionDate;
        
        if (lastDate !== today) {
          set({
            firstCompletionToday: false,
            streakActivatedToday: false,
          });
        }
      },

      // Check if first completion today
      isFirstCompletionToday: () => {
        const today = new Date().toDateString();
        const lastDate = get().lastCompletionDate;
        return lastDate !== today;
      },
    }),
    {
      name: 'completion-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCompletionStore;

