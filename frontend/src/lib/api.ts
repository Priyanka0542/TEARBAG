import axios from 'axios';
import { useStore } from '../store/useStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://tearbag-backend.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = useStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
