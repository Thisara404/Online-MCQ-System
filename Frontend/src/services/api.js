import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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
};

export const examAPI = {
  getAllExams: () => api.get('/exams'),
  getExam: (id) => api.get(`/exams/${id}`),
  getExamQuestions: (id) => api.get(`/exams/${id}/questions`),
};

export const resultAPI = {
  submitExam: (data) => api.post('/results/submit', data),
  getMyResults: () => api.get('/results/my-results'),
  getResult: (id) => api.get(`/results/${id}`),
};

export default api;