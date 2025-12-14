import { parseResponse, handleApiError } from '../utils/apiErrorHandler';

// Get API base URL from environment variable
// Default to localhost if not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle network errors (CORS, connection failed, etc.)
    if (!response.ok && response.status === 0) {
      throw new Error('Network error. Periksa koneksi internet atau hubungi administrator jika masalah berlanjut.');
    }
    
    // Parse response even if status is not ok to get error details
    let data;
    try {
      data = await parseResponse(response);
    } catch (parseError) {
      // If parsing fails, create a basic error structure
      data = { 
        message: parseError.message || `Server error (${response.status})`,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
    
    return handleApiError(data, response);
  } catch (error) {
    // If error already has status, it's from handleApiError - re-throw it
    if (error.status) {
      throw error;
    }
    
    // Handle CORS and network errors
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Gagal terhubung ke server. Masalah CORS terdeteksi. Silakan hubungi administrator backend untuk mengaktifkan CORS atau gunakan proxy.');
    }
    // Re-throw other errors
    throw error;
  }
}

export const authAPI = {
  register: async (userData) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: userData,
    });
  },

  requestOTP: async (email, purpose = 'email_verification') => {
    return apiRequest('/api/auth/request-otp', {
      method: 'POST',
      body: { email, purpose },
    });
  },

  verifyEmail: async (email, otpCode) => {
    return apiRequest('/api/auth/verify-email', {
      method: 'POST',
      body: { email, otp_code: otpCode },
    });
  },

  login: async (email, password) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  getMe: async () => {
    return apiRequest('/api/auth/me', {
      method: 'GET',
    });
  },
};

export const profileAPI = {
  getProfile: async () => {
    return apiRequest('/api/profile', {
      method: 'GET',
    });
  },

  completeProfile: async (profileData) => {
    return apiRequest('/api/profile/complete', {
      method: 'PUT',
      body: profileData,
    });
  },

  updateProfile: async (profileData) => {
    return apiRequest('/api/profile', {
      method: 'PUT',
      body: profileData,
    });
  },

  updateAvatar: async (avatarUrl) => {
    return apiRequest('/api/profile/avatar', {
      method: 'PUT',
      body: { avatar_url: avatarUrl },
    });
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}/api/profile/avatar/upload`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    const data = await parseResponse(response);
    return handleApiError(data, response);
  },
};

export const learningAPI = {
  getSubjects: async () => {
    try {
      return await apiRequest('/api/subjects', {
        method: 'GET',
      });
    } catch (error) {
      try {
        return await apiRequest('/api/learning/subjects', {
          method: 'GET',
        });
      } catch {
        throw error;
      }
    }
  },

  getSubject: async (subjectId) => {
    return apiRequest(`/api/learning/subjects/${subjectId}`, {
      method: 'GET',
    });
  },

  getSubjectLevels: async (subjectId) => {
    return apiRequest(`/api/learning/subjects/${subjectId}/subject-levels`, {
      method: 'GET',
    });
  },

  getSubjectLevelsByClass: async (classId) => {
    try {
      return await apiRequest(`/api/subjects/class/${classId}`, {
        method: 'GET',
      });
    } catch (error) {
      try {
        return await apiRequest(`/api/learning/classes/${classId}/subjects`, {
          method: 'GET',
        });
      } catch {
        throw error;
      }
    }
  },

  getLevels: async (subjectId) => {
    return apiRequest(`/api/learning/subjects/${subjectId}/levels`, {
      method: 'GET',
    });
  },

  getLevelsBySubjectLevel: async (subjectLevelId) => {
    try {
      return await apiRequest(`/api/levels/subject-level/${subjectLevelId}`, {
        method: 'GET',
      });
    } catch (error) {
      if (error.status === 404 || error.message?.includes('404')) {
        try {
          return await apiRequest(`/api/learning/subject-levels/${subjectLevelId}/levels`, {
            method: 'GET',
          });
        } catch {
          throw new Error(`Endpoint tidak tersedia dan database mungkin kosong. Error: ${error.message}`);
        }
      }
      throw error;
    }
  },

  getLevel: async (levelId) => {
    return apiRequest(`/api/learning/levels/${levelId}`, {
      method: 'GET',
    });
  },

  getMaterials: async (levelId) => {
    return apiRequest(`/api/learning/levels/${levelId}/materials`, {
      method: 'GET',
    });
  },

  getClassSubjects: async (classId) => {
    return apiRequest(`/api/learning/classes/${classId}/subjects`, {
      method: 'GET',
    });
  },
};

export const progressAPI = {
  startLevel: async (levelId) => {
    return apiRequest(`/api/progress/levels/${levelId}/start`, {
      method: 'POST',
    });
  },

  getLevelProgress: async (levelId) => {
    return apiRequest(`/api/progress/levels/${levelId}`, {
      method: 'GET',
    });
  },

  updateLevelProgress: async (levelId, progressData) => {
    return apiRequest(`/api/progress/levels/${levelId}`, {
      method: 'PUT',
      body: progressData,
    });
  },

  completeLevel: async (levelId) => {
    return apiRequest(`/api/progress/levels/${levelId}/complete`, {
      method: 'POST',
      body: {}, // Empty body as per API documentation
    });
  },

  getMyProgress: async (status = null) => {
    const params = status ? `?status=${status}` : '';
    return apiRequest(`/api/progress/my-progress${params}`, {
      method: 'GET',
    });
  },

  getJourneyMap: async (subjectLevelId) => {
    return apiRequest(`/api/progress/journey-map/${subjectLevelId}`, {
      method: 'GET',
    });
  },

  getStats: async () => {
    return apiRequest('/api/progress/stats', {
      method: 'GET',
    });
  },
};

export const quizAPI = {
  getQuestions: async (levelId) => {
    return apiRequest(`/api/questions/level/${levelId}`, {
      method: 'GET',
    });
  },

  getQuestionsByLevel: async (levelId) => {
    return apiRequest(`/api/quiz/levels/${levelId}/questions`, {
      method: 'GET',
    });
  },

  submitAnswers: async (levelId, answers) => {
    return apiRequest(`/api/quiz/levels/${levelId}/submit`, {
      method: 'POST',
      body: { answers },
    });
  },
};

export const leaderboardAPI = {
  getLeaderboard: async (type = 'total', limit = 100) => {
    return apiRequest(`/api/leaderboard?type=${type}&limit=${limit}`, {
      method: 'GET',
    });
  },

  getMyRank: async (type = 'total') => {
    return apiRequest(`/api/leaderboard/my-rank?type=${type}`, {
      method: 'GET',
    });
  },
};

export const achievementsAPI = {
  getAchievements: async () => {
    return apiRequest('/api/achievements', {
      method: 'GET',
    });
  },

  getMyAchievements: async () => {
    return apiRequest('/api/achievements/my-achievements', {
      method: 'GET',
    });
  },
};

export const notificationsAPI = {
  getNotifications: async (unreadOnly = false, limit = null) => {
    const params = new URLSearchParams();
    if (unreadOnly) params.append('unread_only', 'true');
    if (limit) params.append('limit', limit);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/notifications${query}`, {
      method: 'GET',
    });
  },

  getUnreadCount: async () => {
    return apiRequest('/api/notifications/unread-count', {
      method: 'GET',
    });
  },

  markAsRead: async (notificationId) => {
    return apiRequest(`/api/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async () => {
    return apiRequest('/api/notifications/read-all', {
      method: 'PUT',
    });
  },
};

export const aiChatAPI = {
  createSession: async (subjectId = null, levelId = null) => {
    return apiRequest('/api/ai-chat/sessions', {
      method: 'POST',
      body: { subject_id: subjectId, level_id: levelId },
    });
  },

  getSessions: async () => {
    return apiRequest('/api/ai-chat/sessions', {
      method: 'GET',
    });
  },

  getMessages: async (sessionId) => {
    return apiRequest(`/api/ai-chat/sessions/${sessionId}/messages`, {
      method: 'GET',
    });
  },

  sendMessage: async (sessionId, message) => {
    return apiRequest(`/api/ai-chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: { message },
    });
  },
};
