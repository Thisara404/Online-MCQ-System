import axios from 'axios';

// Use environment variable for API URL, fallback to local for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/users'),
};

export const examAPI = {
  getAllExams: () => api.get('/exams'),
  getAllExamsAdmin: () => api.get('/exams/admin/all'),
  getExam: (id) => api.get(`/exams/${id}`),
  getExamQuestions: (id) => api.get(`/exams/${id}/questions`),
  createExam: (data) => api.post('/exams', data),
  updateExam: (id, data) => api.put(`/exams/${id}`, data),
  deleteExam: (id) => api.delete(`/exams/${id}`),
};

export const resultAPI = {
  submitExam: (data) => api.post('/results/submit', data),
  getMyResults: () => api.get('/results/my-results'),
  getResult: (id) => api.get(`/results/${id}`),
  getAllResults: () => api.get('/results'),
  getExamStats: (examId) => api.get(`/results/exam/${examId}/stats`),
  deleteResult: (id) => api.delete(`/results/${id}`),
};

export default api;