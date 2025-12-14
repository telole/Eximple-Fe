import { create } from 'zustand';
import { learningAPI } from '../services/api';

const useLearningStore = create((set, get) => ({
  subjects: [],
  subjectLevels: [],
  levels: [],
  currentLevel: null,
  currentLevelMaterials: [],
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

  getLevel: async (levelId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await learningAPI.getLevel(levelId);
      if (response.success) {
        const levelData = response.data;
        // Sort materials by order_index
        const sortedMaterials = (levelData.materials || []).sort((a, b) => 
          (a.order_index || 0) - (b.order_index || 0)
        );
        
        set({ 
          currentLevel: levelData,
          currentLevelMaterials: sortedMaterials,
          isLoading: false, 
          error: null 
        });
        return { success: true, data: levelData };
      } else {
        set({ isLoading: false, error: response.error || 'Failed to load level' });
        return { success: false, error: response.error || 'Failed to load level' };
      }
    } catch (error) {
      set({ isLoading: false, error: error.message || 'Failed to load level' });
      return { success: false, error: error.message || 'Failed to load level' };
    }
  },
}));

export default useLearningStore;

