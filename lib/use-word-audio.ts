import { useState, useCallback } from 'react';
import { gameService } from '@/src/api';

interface WordAudioState {
  isLoading: boolean;
  error: string | null;
  audioUrl: string | null;
}

// Cache audio URLs in memory
const audioCache = new Map<string, string>();

export function useWordAudio() {
  const [state, setState] = useState<Record<string, WordAudioState>>({});

  const getAudio = useCallback(async (word: string) => {
    // Check if we're already loading this word
    if (state[word]?.isLoading) return;
    
    // Check cache first
    if (audioCache.has(word)) {
      setState(prev => ({
        ...prev,
        [word]: {
          isLoading: false,
          error: null,
          audioUrl: audioCache.get(word)!
        }
      }));
      return;
    }

    // Start loading
    setState(prev => ({
      ...prev,
      [word]: {
        isLoading: true,
        error: null,
        audioUrl: null
      }
    }));

    try {
      const audioUrl = await gameService.getWordAudio(word);
      audioCache.set(word, audioUrl);
      setState(prev => ({
        ...prev,
        [word]: {
          isLoading: false,
          error: null,
          audioUrl
        }
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        [word]: {
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load audio',
          audioUrl: null
        }
      }));
    }
  }, []);

  const playAudio = useCallback(async (word: string) => {
    // If we don't have the audio yet, get it first
    if (!state[word]?.audioUrl) {
      await getAudio(word);
      if (!state[word]?.audioUrl) return; // If still no URL after getting audio, return
    }

    // Play the audio
    try {
      const audio = new Audio(state[word].audioUrl!);
      await audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }, [state, getAudio]);

  return {
    getAudio,
    playAudio,
    audioStates: state
  };
}
