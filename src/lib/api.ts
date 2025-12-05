// src/lib/api.ts
import axios from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // allow refresh cookie
});

// attach access token
api.interceptors.request.use(cfg => {
  const token = getAccessToken();
  if (token && cfg.headers) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

let isRefreshing = false;
let queue: Array<(token?: string) => void> = [];

function processQueue(error: any, token?: string) {
  queue.forEach(cb => cb(token));
  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((token?: string) => {
            if (token) {
              original.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(original));
            } else {
              reject(err);
            }
          });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const r = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
        const newToken = r.data.data.accessToken;
        setAccessToken(newToken);
        original.headers['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, undefined);
        clearAccessToken();
        window.location.href = '/login';
        throw refreshErr;
      } finally {
        isRefreshing = false;
      }
    }
    throw err;
  }
);

export default api;
