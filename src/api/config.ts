// API configuration
export const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login/',
  REGISTER: '/api/auth/register/',
  REFRESH_TOKEN: '/api/auth/token/refresh/',
  
  // Game endpoints
  TOPICS: '/api/topics/',
  WORDS: '/api/words/',
  PROGRESS: '/api/progress/',
  AUDIO: '/api/audio/',
  LETTER_STATS: '/api/letter-stats/',
  PROFILES: '/api/profiles/',
} as const;

// Axios config
export const AXIOS_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};
