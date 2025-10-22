import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Determine the API base URL based on the platform
const getApiBase = () => {
  // Check for environment variable first
  if (process.env.EXPO_PUBLIC_API_BASE) {
    console.log('[API] Using env variable:', process.env.EXPO_PUBLIC_API_BASE);
    return process.env.EXPO_PUBLIC_API_BASE;
  }
  
  // Check expo config - but override for web platform
  if (Constants.expoConfig?.extra?.apiBase) {
    const configUrl = Constants.expoConfig.extra.apiBase;
    // If on web, replace mobile IP/Android emulator address with localhost
    if (Platform.OS === 'web') {
      if (configUrl.includes('10.0.2.2')) {
        console.log('[API] Web platform detected, using localhost instead of 10.0.2.2');
        return configUrl.replace('10.0.2.2', 'localhost');
      }
      if (configUrl.includes('192.168.')) {
        console.log('[API] Web platform detected, using localhost instead of mobile IP');
        return configUrl.replace(/192\.168\.\d+\.\d+/, 'localhost');
      }
    }
    console.log('[API] Using expo config:', configUrl);
    return configUrl;
  }
  
  // Platform-specific defaults
  if (Platform.OS === 'android') {
    // For Android emulator, use 10.0.2.2 to access localhost
    console.log('[API] Android platform, using 10.0.2.2');
    return 'http://10.0.2.2:4000';
  } else if (Platform.OS === 'ios') {
    // For iOS simulator, use localhost
    console.log('[API] iOS platform, using localhost');
    return 'http://localhost:4000';
  } else if (Platform.OS === 'web') {
    // For web, use localhost
    console.log('[API] Web platform, using localhost');
    return 'http://localhost:4000';
  }
  
  // Fallback
  console.log('[API] Fallback, using localhost');
  return 'http://localhost:4000';
};

const API_BASE = getApiBase();

// Log API base for debugging
console.log('[API] Using API base URL:', API_BASE);
console.log('[API] Platform:', Platform.OS);

// Test connection on startup
(async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE}/health`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('[API] ✓ Backend connection successful');
    } else {
      console.warn('[API] ⚠️  Backend responded with status:', response.status);
    }
  } catch (error) {
    console.error('[API] ✗ Cannot connect to backend at', API_BASE);
    console.error('[API] Error:', error.message);
    console.error('[API] Please ensure:');
    console.error('[API] 1. Backend server is running (npm run dev in Backend folder)');
    console.error('[API] 2. Backend is accessible at', API_BASE);
    console.error('[API] 3. No firewall is blocking the connection');
  }
})();

async function getToken() {
  try {
    return await AsyncStorage.getItem('jwt_token');
  } catch (error) {
    console.error('[API] Error getting token:', error);
    return null;
  }
}

async function request(path, { method = 'GET', body, headers = {}, timeout = 30000 } = {}) {
  try {
    const token = await getToken();
    const url = `${API_BASE}${path}`;
    
    console.log(`[API] ${method} ${url}`);
    if (body) {
      console.log('[API] Request body:', JSON.stringify(body, null, 2));
    }
    
    // Create abort controller for timeout (increased to 30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const text = await res.text();
    console.log(`[API] Response status: ${res.status}`);
    console.log(`[API] Response text:`, text);
    
    let data;
    try { 
      data = text ? JSON.parse(text) : {}; 
    } catch (parseError) { 
      console.error('[API] JSON parse error:', parseError);
      data = { raw: text }; 
    }
    
    if (!res.ok) {
      const msg = data?.error || data?.message || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      err.data = data;
      console.error('[API] Request failed:', msg);
      throw err;
    }
    
    console.log('[API] Request successful');
    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Request timeout - please check your internet connection');
      timeoutError.status = 408;
      console.error('[API] Request timeout');
      throw timeoutError;
    }
    
    if (error.message === 'Network request failed' || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      const networkError = new Error(`Network error - cannot reach server at ${API_BASE}. Please ensure the backend is running on port 4000.`);
      networkError.status = 0;
      console.error('[API] Network error:', error.message);
      console.error('[API] Attempted URL:', url);
      console.error('[API] Backend should be at:', API_BASE);
      throw networkError;
    }
    
    console.error('[API] Request error:', error);
    throw error;
  }
}

export const api = {
  // Connection test
  testConnection: async () => {
    try {
      const response = await fetch(`${API_BASE}/health`, {
        method: 'GET',
      });
      const data = await response.json();
      return { ok: true, data, url: API_BASE };
    } catch (error) {
      return { ok: false, error: error.message, url: API_BASE };
    }
  },
  
  // Auth
  register: async (email, password, metadata = {}) => {
    try {
      console.log('[API] Registering user:', email);
      // Use longer timeout for registration (bcrypt hashing can be slow)
      const data = await request('/api/auth/register', {
        method: 'POST',
        body: { email, password, ...metadata },
        timeout: 45000, // 45 seconds for registration
      });
      
      if (data?.token) {
        console.log('[API] Registration successful, saving token');
        await AsyncStorage.setItem('jwt_token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('[API] Registration failed:', error.message);
      throw error;
    }
  },
  login: async (email, password) => {
    try {
      console.log('[API] Logging in user:', email);
      // Use longer timeout for login (bcrypt comparison can be slow)
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        timeout: 45000, // 45 seconds for login
      });
      
      if (data?.token) {
        console.log('[API] Login successful, saving token');
        await AsyncStorage.setItem('jwt_token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('[API] Login failed:', error.message);
      throw error;
    }
  },
  logout: async () => {
    await AsyncStorage.removeItem('jwt_token');
    return { ok: true };
  },
  me: async () => request('/api/auth/me'),
  updateMe: async (updates) => request('/api/auth/me', { method: 'PUT', body: updates }),
  removeAvatar: async () => request('/api/auth/avatar', { method: 'DELETE' }),
  changePassword: async (currentPassword, newPassword) => 
    request('/api/auth/change-password', { 
      method: 'POST', 
      body: { currentPassword, newPassword } 
    }),

  // Posts
  feed: async (limit = 50) => request(`/api/posts/feed?limit=${limit}`),
  createPost: async (post) => request('/api/posts', { method: 'POST', body: post }),
  like: async (postId) => request(`/api/posts/${postId}/like`, { method: 'POST' }),
  unlike: async (postId) => request(`/api/posts/${postId}/like`, { method: 'DELETE' }),
  share: async (postId) => request(`/api/posts/${postId}/share`, { method: 'POST' }),
  deletePost: async (postId) => request(`/api/posts/${postId}`, { method: 'DELETE' }),

  // Comments
  listComments: async (postId) => request(`/api/comments/${postId}`),
  addComment: async (postId, content) => request(`/api/comments/${postId}`, { method: 'POST', body: { content } }),

  // Uploads
  uploadImage: async (uri) => {
    const token = await getToken();
    const form = new FormData();
    const name = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
    form.append('file', { uri, type: 'image/jpeg', name });

    const res = await fetch(`${API_BASE}/api/uploads`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || 'Upload failed');
    return json; // { url }
  },

  // Stories
  getStories: async () => request('/api/stories'),
  createStory: async (image_url, text = '', background_color = '#6C63FF') => 
    request('/api/stories', { 
      method: 'POST', 
      body: { image_url, text, background_color } 
    }),
  viewStory: async (storyId) => request(`/api/stories/${storyId}/view`, { method: 'POST' }),
  deleteStory: async (storyId) => request(`/api/stories/${storyId}`, { method: 'DELETE' }),

  // Connections
  sendConnectionRequest: async (recipient_id) => 
    request('/api/connections/send', { method: 'POST', body: { recipient_id } }),
  acceptConnectionRequest: async (connection_id) => 
    request('/api/connections/accept', { method: 'POST', body: { connection_id } }),
  rejectConnectionRequest: async (connection_id) => 
    request('/api/connections/reject', { method: 'POST', body: { connection_id } }),
  removeConnection: async (connection_id) => 
    request('/api/connections/remove', { method: 'POST', body: { connection_id } }),
  getConnections: async () => request('/api/connections'),
  getPendingRequests: async () => request('/api/connections/pending'),
  getConnectionStatus: async (other_user_id) => 
    request(`/api/connections/status/${other_user_id}`),

  // User Profiles
  getUserProfile: async (user_id) => request(`/api/auth/user/${user_id}`),
  searchUsers: async (query, limit = 20) => 
    request(`/api/auth/search?query=${encodeURIComponent(query)}&limit=${limit}`),

  // Projects
  createProject: async (projectData) => 
    request('/api/projects', { method: 'POST', body: projectData }),
  getMyProjects: async (status = null) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request(`/api/projects/my-projects${query}`);
  },
  getProjectById: async (projectId) => request(`/api/projects/${projectId}`),
  getUserProjects: async (userId) => request(`/api/projects/user/${userId}`),
  updateProject: async (projectId, projectData) => 
    request(`/api/projects/${projectId}`, { method: 'PUT', body: projectData }),
  deleteProject: async (projectId) => 
    request(`/api/projects/${projectId}`, { method: 'DELETE' }),
  getProjectStats: async () => request('/api/projects/stats'),

  // Messages
  sendMessage: async (receiver_id, content) => 
    request('/api/messages/send', { method: 'POST', body: { receiver_id, content } }),
  getConversation: async (other_user_id) => 
    request(`/api/messages/conversation/${other_user_id}`),
  getConversations: async () => request('/api/messages/conversations'),
  markMessagesAsRead: async (sender_id) => 
    request('/api/messages/mark-read', { method: 'POST', body: { sender_id } }),
  getUnreadMessageCount: async () => request('/api/messages/unread-count'),
  deleteMessage: async (message_id) => 
    request(`/api/messages/${message_id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: async () => request('/api/notifications'),
  getUnreadNotificationCount: async () => request('/api/notifications/unread-count'),
  markNotificationAsRead: async (notification_id) => 
    request(`/api/notifications/${notification_id}/read`, { method: 'POST' }),
  markAllNotificationsAsRead: async () => 
    request('/api/notifications/mark-all-read', { method: 'POST' }),
  deleteNotification: async (notification_id) => 
    request(`/api/notifications/${notification_id}`, { method: 'DELETE' }),
};

export default api;
