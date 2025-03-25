export enum SoundEffect {
  LETTER_SELECT = 'letter-select',
  LETTER_CORRECT = 'letter-correct',
  LETTER_INCORRECT = 'letter-incorrect',
  TOPIC_COMPLETE = 'topic-complete',
}

const soundFiles: Record<SoundEffect, string> = {
  [SoundEffect.LETTER_SELECT]: '/sounds/letter-select.mp3',
  [SoundEffect.LETTER_CORRECT]: '/sounds/letter-correct.mp3',
  [SoundEffect.LETTER_INCORRECT]: '/sounds/letter-incorrect.mp3',
  [SoundEffect.TOPIC_COMPLETE]: '/sounds/topic-complete.mp3',
};

class SoundService {
  private audioCache: Map<SoundEffect, HTMLAudioElement> = new Map();
  private enabled: boolean = false;

  constructor() {
    // Pre-load sound effects
    Object.entries(soundFiles).forEach(([effect, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.audioCache.set(effect as SoundEffect, audio);
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async play(effect: SoundEffect) {
    if (!this.enabled) return;

    const audio = this.audioCache.get(effect);
    if (!audio) return;

    try {
      audio.currentTime = 0; // Reset to start
      await audio.play();
    } catch (error) {
      console.error('Failed to play sound effect:', error);
    }
  }

  // Stop all playing sounds
  stopAll() {
    this.audioCache.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}

// Export singleton instance
export const soundService = new SoundService();
