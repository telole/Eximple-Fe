import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authAPI } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      setToken: (token) => {
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
        set({ token, isAuthenticated: !!token });
      },

      setUser: (user) => {
        set({ user });
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          set({ isLoading: false });
          return { success: true, data: response.data };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      requestOTP: async (email, purpose = 'email_verification') => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.requestOTP(email, purpose);
          set({ isLoading: false });
          return { success: true, data: response };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      verifyEmail: async (email, otpCode) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.verifyEmail(email, otpCode);
          const { token, user } = response.data;
          get().setToken(token);
          get().setUser(user);
          set({ isLoading: false, isAuthenticated: true });
          return { success: true, data: response.data };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(email, password);
          const { token, user } = response.data;
          get().setToken(token);
          get().setUser(user);
          set({ isLoading: false, isAuthenticated: true });
          return { success: true, data: response.data };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      getMe: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.getMe();
          get().setUser(response.data);
          set({ isLoading: false });
          return { success: true, data: response.data };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          if (error.message.includes('token') || error.message.includes('Unauthorized')) {
            get().logout();
          }
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (token) {
          get().setToken(token);
          const result = await get().getMe();
          if (result.success) {
            set({ isAuthenticated: true });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;

