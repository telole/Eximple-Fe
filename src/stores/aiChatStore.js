import { create } from 'zustand';
import { aiChatAPI } from '../services/api';

const useAiChatStore = create((set, get) => ({
  sessions: [],
  currentSession: null,
  messages: [],
  isLoading: false,
  error: null,

  createSession: async (subjectId = null, levelId = null) => {
    set({ isLoading: true, error: null });
    try {
      const response = await aiChatAPI.createSession(subjectId, levelId);
      if (response.success) {
        const newSession = response.data;
        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSession: newSession,
          messages: [],
          isLoading: false,
        }));
        return { success: true, data: newSession };
      }
      set({ isLoading: false });
      return { success: false, error: response.error || 'Failed to create session' };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  getSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await aiChatAPI.getSessions();
      if (response.success) {
        set({ sessions: response.data, isLoading: false });
        return { success: true, data: response.data };
      }
      set({ isLoading: false });
      return { success: false, error: response.error || 'Failed to load sessions' };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  setCurrentSession: (session) => {
    set({ currentSession: session });
  },

  getMessages: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await aiChatAPI.getMessages(sessionId);
      if (response.success) {
        const messagesData = Array.isArray(response.data) ? response.data : [];
        set({ messages: messagesData, isLoading: false });
        return { success: true, data: messagesData };
      }
      set({ isLoading: false });
      return { success: false, error: response.error || 'Failed to load messages' };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  sendMessage: async (sessionId, message) => {
    set({ isLoading: true, error: null });
    
    const userMessage = {
      id: `temp-${Date.now()}`,
      session_id: sessionId,
      sender: 'user',
      message: message,
      created_at: new Date().toISOString()
    };
    
    set((state) => ({
      messages: [...(state.messages || []), userMessage],
    }));
    
    try {
      const response = await aiChatAPI.sendMessage(sessionId, message);
      
      if (response.success && response.data) {
        const { user_message, bot_message, ai_message } = response.data;
        const botResponse = ai_message || bot_message;
        
        const currentMessages = get().messages || [];
        
        let updatedMessages = currentMessages.map(msg => 
          msg.id === userMessage.id && user_message ? user_message : msg
        );
        
        if (!user_message) {
          updatedMessages = currentMessages;
        }
        
        if (botResponse) {
          const botExists = updatedMessages.some(msg => 
            msg.id === botResponse.id || 
            (msg.sender === 'bot' && msg.message === botResponse.message && 
             Math.abs(new Date(msg.created_at) - new Date(botResponse.created_at)) < 1000)
          );
          
          if (!botExists) {
            updatedMessages.push(botResponse);
          }
        } else {
          const errorExists = updatedMessages.some(msg => 
            msg.sender === 'bot' && 
            msg.message.includes('AI tidak memberikan respons')
          );
          
          if (!errorExists) {
            updatedMessages.push({
              id: Date.now(),
              session_id: sessionId,
              sender: 'bot',
              message: 'Maaf, AI tidak memberikan respons. Silakan coba lagi atau hubungi support jika masalah berlanjut.',
              created_at: new Date().toISOString()
            });
          }
        }
        
        set({
          messages: [...updatedMessages],
          isLoading: false,
        });
        
        console.log('Updated messages:', updatedMessages);
        return { success: true, data: response.data };
      }
      
      const currentMessages = get().messages || [];
      const errorExists = currentMessages.some(msg => 
        msg.sender === 'bot' && 
        msg.message.includes(response.error || 'terjadi kesalahan')
      );
      
      if (!errorExists) {
        const errorBotMessage = {
          id: Date.now(),
          session_id: sessionId,
          sender: 'bot',
          message: response.error || 'Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.',
          created_at: new Date().toISOString()
        };
        
        set((state) => ({
          messages: [...(state.messages || []), errorBotMessage],
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
      
      return { success: false, error: response.error || 'Failed to send message' };
    } catch (error) {
      console.error('AI Chat Error:', error);
      
      const currentMessages = get().messages || [];
      const errorExists = currentMessages.some(msg => 
        msg.sender === 'bot' && 
        msg.message.includes('terjadi kesalahan')
      );
      
      if (!errorExists) {
        const errorBotMessage = {
          id: Date.now(),
          session_id: sessionId,
          sender: 'bot',
          message: 'Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.',
          created_at: new Date().toISOString()
        };
        
        set((state) => ({
          messages: [...(state.messages || []), errorBotMessage],
          isLoading: false,
          error: error.message,
        }));
      } else {
        set({ isLoading: false, error: error.message });
      }
      
      return { success: false, error: error.message };
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));

export default useAiChatStore;

