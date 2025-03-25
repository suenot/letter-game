import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS, AXIOS_CONFIG } from './config';
import { ApiError, AuthResponse } from './types';

// Create axios instance
const api = axios.create(AXIOS_CONFIG);

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Prevent infinite loops
    if ((originalRequest as any)._retry) {
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');

      // If no refresh token, reject the request
      if (!refreshToken) {
        localStorage.removeItem('access_token');
        return Promise.reject(error);
      }

      try {
        (originalRequest as any)._retry = true;

        // Try to refresh the token
        const response = await axios.post<AuthResponse>(
          `${AXIOS_CONFIG.baseURL}${API_ENDPOINTS.REFRESH_TOKEN}`,
          { refresh: refreshToken }
        );

        const { access: newAccessToken } = response.data;

        // Save the new access token
        localStorage.setItem('access_token', newAccessToken);

        // Update the failed request's authorization header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, clear auth storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(refreshError);
      }
    }

    // Format error response
    const errorResponse: ApiError = {
      message: error.response?.data?.message || 'An error occurred',
      code: error.response?.data?.code,
      details: error.response?.data?.details,
    };

    return Promise.reject(errorResponse);
  }
);

export default api;

// Helper function to handle API errors
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message || 'An error occurred',
      code: error.response?.data?.code,
      details: error.response?.data?.details,
    };
  }
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  };
};
