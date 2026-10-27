import axios from 'axios';

const API_BASE_URL = 'https://women-safety-backend-1-34sx.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — token automatic-a add pannum
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// API functions
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  profile: () => api.get('/auth/profile/'),
};

export const sosAPI = {
  createSOS: (data) => api.post('/sos/create/', data),
  getSOSList: () => api.get('/sos/list/'),
  resolveSOS: (id) => api.patch(`/sos/${id}/resolve/`),
};