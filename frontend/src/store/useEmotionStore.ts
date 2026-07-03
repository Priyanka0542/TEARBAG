import { create } from 'zustand';
import { type Emotion, applyEmotionTheme } from '../lib/emotionThemes';

interface EmotionState {
  currentEmotion: Emotion;
  intensity: number;
  setEmotion: (emotion: Emotion, intensity?: number) => void;
}

// Restore from sessionStorage on load
const stored = sessionStorage.getItem('tearBagEmotion');
const initial: { currentEmotion: Emotion; intensity: number } = stored
  ? JSON.parse(stored)
  : { currentEmotion: 'calm', intensity: 0.5 };

// Apply theme immediately on load
applyEmotionTheme(initial.currentEmotion, initial.intensity);

export const useEmotionStore = create<EmotionState>((set) => ({
  currentEmotion: initial.currentEmotion,
  intensity: initial.intensity,
  setEmotion: (emotion, intensity = 0.5) => {
    applyEmotionTheme(emotion, intensity);
    sessionStorage.setItem(
      'tearBagEmotion',
      JSON.stringify({ currentEmotion: emotion, intensity })
    );
    set({ currentEmotion: emotion, intensity });
  },
}));
