import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Response interceptor — log errors in dev
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API Error]', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

// ── Members ────────────────────────────────────────────
export const initProject = (payload) => api.post('/api/members/init', payload);
export const getMembers  = (projectId) => api.get(`/api/members/${projectId}`);
export const getMemberTasks = (projectId) => api.get(`/api/members/${projectId}/tasks`);

// ── Tasks ──────────────────────────────────────────────
export const getActiveTasks = (projectId) => api.get(`/api/tasks/active/${projectId}`);
export const createTask     = (payload)  => api.post('/api/tasks/', payload);
export const updateTask     = (taskId, payload) => api.put(`/api/tasks/${taskId}`, payload);
export const logDecision    = (payload)  => api.post('/api/tasks/decision', payload);

// ── AI ──────────────────────────────────────────────────
export const logMeeting       = (payload)   => api.post('/api/ai/meeting/log', payload);
export const getMeetingHistory = (projectId) => api.get(`/api/ai/meeting/history/${projectId}`);
export const recommendTasks   = (projectId) => api.get(`/api/ai/tasks/recommend/${projectId}`);
export const getReminders     = (projectId) => api.get(`/api/ai/reminders/${projectId}`);
export const getContext       = (projectId) => api.get(`/api/ai/context/${projectId}`);
export const getDashboardSummary = (projectId) => api.get(`/api/ai/dashboard/summary/${projectId}`);

export default api;
