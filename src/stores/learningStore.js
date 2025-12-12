import { create } from 'zustand';
import { learningAPI } from '../services/api';

const useLearningStore = create((set, get) => ({
  subjects: [],
  subjectLevels: [],
  levels: [],
  isLoading: false,
  error: null,

  getSubjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await learningAPI.getSubjects();
      if (response.success) {
        set({ subjects: response.data || [], isLoading: false, error: null });
        return { success: true, data: response.data || [] };
      } else {
        set({ isLoading: false, error: response.error || 'Failed to load subjects' });
        return { success: false, error: response.error || 'Failed to load subjects' };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Failed to load subjects' });
      return { success: false, error: error.message || 'Failed to load subjects' };
    }
  },

  getSubjectLevelsByClass: async (classId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await learningAPI.getSubjectLevelsByClass(classId);
      if (response.success) {
        set({ subjectLevels: response.data || [], isLoading: false, error: null });
        return { success: true, data: response.data || [] };
      } else {
        set({ isLoading: false, error: response.error || 'Failed to load subject levels' });
        return { success: false, error: response.error || 'Failed to load subject levels' };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Failed to load subject levels' });
      return { success: false, error: error.message || 'Failed to load subject levels' };
    }
  },

  getLevelsBySubjectLevel: async (subjectLevelId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await learningAPI.getLevelsBySubjectLevel(subjectLevelId);
      if (response.success) {
        set({ levels: response.data || [], isLoading: false, error: null });
        return { success: true, data: response.data || [] };
      } else {
        set({ isLoading: false, error: response.error || 'Failed to load levels' });
        return { success: false, error: response.error || 'Failed to load levels' };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Failed to load levels' });
      return { success: false, error: error.message || 'Failed to load levels' };
    }
  },
}));

export default useLearningStore;

