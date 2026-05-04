import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('intellmeet-auth');
  if (stored) {
    const { state } = JSON.parse(stored);
    if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('intellmeet-auth');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Meetings
export const meetingsAPI = {
  create: (data: { title: string; tags?: string[] }) =>
    api.post('/meetings/create', data),
  getById: (meetingId: string) => api.get(`/meetings/${meetingId}`),
  getUserMeetings: (userId: string) => api.get(`/meetings/user/${userId}`),
  end: (meetingId: string) => api.put(`/meetings/${meetingId}/end`),
  saveSummary: (meetingId: string, data: { summary: string; actionItems: string[] }) =>
    api.put(`/meetings/${meetingId}/summary`, data),
};

// AI
export const aiAPI = {
  generateSummary: (data: {
    meetingTitle?: string;
    duration?: number;
    participantCount?: number;
    chatMessages?: string[];
  }) => api.post('/ai/summary', data),
};

// Tasks
export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  create: (data: Partial<{ title: string; description: string; status: string; priority: string; dueDate: string }>) =>
    api.post('/tasks', data),
  update: (id: string, data: Partial<{ title: string; status: string; priority: string }>) =>
    api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export default api;
