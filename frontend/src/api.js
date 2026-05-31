import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL;
// Ensure we append /api if the user forgot it, or just use /api for relative Nginx routing
const baseURL = rawUrl 
  ? (rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`) 
  : '/api';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
