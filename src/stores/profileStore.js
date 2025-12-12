import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { profileAPI } from '../services/api';

const useProfileStore = create(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,
      points: 0,
      streak: 0,

      getProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileAPI.getProfile();
          if (response.success) {
            const profileData = response.data?.profile || response.data;
            set({ 
              profile: profileData, 
              points: profileData?.points || 0,
              streak: profileData?.streak || 0,
              isLoading: false, 
              error: null 
            });
            return { success: true, data: { profile: profileData } };
          } else {
            set({ isLoading: false, error: response.error || 'Failed to load profile' });
            return { success: false, error: response.error || 'Failed to load profile' };
          }
        } catch (error) {
          set({ isLoading: false, error: error.message || 'Failed to load profile' });
          return { success: false, error: error.message || 'Failed to load profile' };
        }
      },

      completeProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileAPI.completeProfile(profileData);
          if (response.success) {
            const profile = response.data?.profile || response.data;
            set({ 
              profile, 
              points: profile?.points || 0,
              streak: profile?.streak || 0,
              isLoading: false, 
              error: null 
            });
            return { success: true, data: response.data };
          } else {
            set({ isLoading: false, error: response.error || 'Failed to complete profile' });
            return { success: false, error: response.error || 'Failed to complete profile' };
          }
        } catch (error) {
          set({ isLoading: false, error: error.message || 'Failed to complete profile' });
          return { success: false, error: error.message || 'Failed to complete profile' };
        }
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileAPI.updateProfile(profileData);
          if (response.success) {
            const profile = response.data?.profile || response.data;
            set({ 
              profile, 
              points: profile?.points || get().points,
              streak: profile?.streak || get().streak,
              isLoading: false, 
              error: null 
            });
            return { success: true, data: response.data };
          } else {
            set({ isLoading: false, error: response.error || 'Failed to update profile' });
            return { success: false, error: response.error || 'Failed to update profile' };
          }
        } catch (error) {
          set({ isLoading: false, error: error.message || 'Failed to update profile' });
          return { success: false, error: error.message || 'Failed to update profile' };
        }
      },

      updateAvatar: async (avatarUrl) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileAPI.updateAvatar(avatarUrl);
          if (response.success) {
            const profile = response.data?.profile || response.data;
            set({ 
              profile: { ...get().profile, ...profile },
              isLoading: false, 
              error: null 
            });
            return { success: true, data: response.data };
          } else {
            set({ isLoading: false, error: response.error || 'Failed to update avatar' });
            return { success: false, error: response.error || 'Failed to update avatar' };
          }
        } catch (error) {
          set({ isLoading: false, error: error.message || 'Failed to update avatar' });
          return { success: false, error: error.message || 'Failed to update avatar' };
        }
      },

      uploadAvatar: async (file) => {
        set({ isLoading: true, error: null });
        try {
          const response = await profileAPI.uploadAvatar(file);
          if (response.success) {
            const profile = response.data?.profile || response.data;
            set({ 
              profile: { ...get().profile, ...profile },
              isLoading: false, 
              error: null 
            });
            return { success: true, data: response.data };
          } else {
            set({ isLoading: false, error: response.error || 'Failed to upload avatar' });
            return { success: false, error: response.error || 'Failed to upload avatar' };
          }
        } catch (error) {
          set({ isLoading: false, error: error.message || 'Failed to upload avatar' });
          return { success: false, error: error.message || 'Failed to upload avatar' };
        }
      },
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useProfileStore;

