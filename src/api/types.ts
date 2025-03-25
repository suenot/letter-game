// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  email: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

// Game types
export interface Topic {
  id: number;
  name: string;
  description: string;
  words_count: number;
  completed: boolean;
}

export interface Word {
  id: number;
  topic: number;
  word: string;
  translation?: string;
  image_url?: string;
  audio_url?: string;
}

export interface Progress {
  id: number;
  user: number;
  word: number;
  success_rate: number;
  attempts: number;
  last_attempt: string;
}

export interface LetterStat {
  letter: string;
  success_rate: number;
  attempts: number;
}

export interface Profile {
  id: number;
  name: string;
  age: number;
  avatar_url?: string;
  active: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string | React.ReactNode;
  code?: string;
  details?: Record<string, unknown> | string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface GameSettings {
  id: number;
  user: number;
  uppercase_enabled: boolean;
  lowercase_enabled: boolean;
  show_images: boolean;
  sound_effects_enabled: boolean;
  created_at: string;
  updated_at: string;
}
