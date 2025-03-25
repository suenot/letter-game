import { API_ENDPOINTS } from './config';
import api, { handleApiError } from './api';
import { ApiResponse, LetterStat, PaginatedResponse, Profile, Progress, Topic, Word } from './types';

export const gameService = {
  // Topics
  getTopics: async (): Promise<Topic[]> => {
    try {
      const response = await api.get<PaginatedResponse<Topic>>(API_ENDPOINTS.TOPICS);
      return response.data.results;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Words
  getWordsByTopic: async (topicId: number): Promise<Word[]> => {
    try {
      const response = await api.get<PaginatedResponse<Word>>(
        `${API_ENDPOINTS.WORDS}?topic=${topicId}`
      );
      return response.data.results;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Progress
  saveProgress: async (wordId: number, success: boolean): Promise<Progress> => {
    try {
      const response = await api.post<Progress>(API_ENDPOINTS.PROGRESS, {
        word: wordId,
        success,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getProgress: async (): Promise<Progress[]> => {
    try {
      const response = await api.get<PaginatedResponse<Progress>>(API_ENDPOINTS.PROGRESS);
      return response.data.results;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Letter Statistics
  getLetterStats: async (): Promise<LetterStat[]> => {
    try {
      const response = await api.get<LetterStat[]>(API_ENDPOINTS.LETTER_STATS);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Audio
  getWordAudio: async (word: string): Promise<string> => {
    try {
      const response = await api.get<ApiResponse<{ url: string }>>(
        `${API_ENDPOINTS.AUDIO}?word=${encodeURIComponent(word)}`
      );
      return response.data.data.url;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Profiles
  getProfiles: async (): Promise<Profile[]> => {
    try {
      const response = await api.get<PaginatedResponse<Profile>>(API_ENDPOINTS.PROFILES);
      return response.data.results;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createProfile: async (data: Omit<Profile, 'id'>): Promise<Profile> => {
    try {
      const response = await api.post<Profile>(API_ENDPOINTS.PROFILES, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateProfile: async (id: number, data: Partial<Profile>): Promise<Profile> => {
    try {
      const response = await api.patch<Profile>(`${API_ENDPOINTS.PROFILES}${id}/`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteProfile: async (id: number): Promise<void> => {
    try {
      await api.delete(`${API_ENDPOINTS.PROFILES}${id}/`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
