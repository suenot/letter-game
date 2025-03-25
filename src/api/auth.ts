import { API_ENDPOINTS } from './config';
import api, { handleApiError } from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from './types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, data);
      // Store tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.REGISTER, data);
      // Store tokens after successful registration
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.REFRESH_TOKEN, {
        refresh: refreshToken,
      });
      localStorage.setItem('access_token', response.data.access);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },
};
