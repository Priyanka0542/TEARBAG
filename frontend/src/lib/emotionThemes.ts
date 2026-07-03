export type Emotion = 'calm' | 'joy' | 'sadness' | 'anger' | 'anxiety';

export interface EmotionTheme {
  primary: string;
  glow: string;
  particle: string;
  bgStart: string;
  bgEnd: string;
  orbColor: string;
  label: string;
}

export const emotionThemes: Record<Emotion, EmotionTheme> = {
  calm: {
    primary: '#F6C445',
    glow: 'rgba(246, 196, 69, 0.3)',
    particle: '#FDE68A',
    bgStart: 'rgba(246, 196, 69, 0.15)',
    bgEnd: 'rgba(180, 140, 50, 0.08)',
    orbColor: '#F6C445',
    label: 'Calm',
  },
  joy: {
    primary: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.4)',
    particle: '#FCD34D',
    bgStart: 'rgba(245, 158, 11, 0.18)',
    bgEnd: 'rgba(252, 211, 77, 0.08)',
    orbColor: '#FBBF24',
    label: 'Joyful',
  },
  sadness: {
    primary: '#60A5FA',
    glow: 'rgba(96, 165, 250, 0.3)',
    particle: '#93C5FD',
    bgStart: 'rgba(96, 165, 250, 0.15)',
    bgEnd: 'rgba(59, 130, 246, 0.08)',
    orbColor: '#60A5FA',
    label: 'Reflective',
  },
  anger: {
    primary: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.4)',
    particle: '#FCA5A5',
    bgStart: 'rgba(239, 68, 68, 0.18)',
    bgEnd: 'rgba(185, 28, 28, 0.08)',
    orbColor: '#EF4444',
    label: 'Intense',
  },
  anxiety: {
    primary: '#A78BFA',
    glow: 'rgba(167, 139, 250, 0.3)',
    particle: '#C4B5FD',
    bgStart: 'rgba(167, 139, 250, 0.15)',
    bgEnd: 'rgba(139, 92, 246, 0.08)',
    orbColor: '#A78BFA',
    label: 'Uneasy',
  },
};

// Maps user-facing mood labels to emotion theme keys
export const moodToEmotion: Record<string, Emotion> = {
  Happy: 'joy',
  Excited: 'joy',
  Loved: 'joy',
  Grateful: 'calm',
  Calm: 'calm',
  Sad: 'sadness',
  Crying: 'sadness',
  Lonely: 'sadness',
  Angry: 'anger',
  Anxious: 'anxiety',
  Confused: 'anxiety',
  Tired: 'calm',
};

export function applyEmotionTheme(emotion: Emotion, intensity: number = 0.5) {
  const theme = emotionThemes[emotion];
  const root = document.documentElement;

  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-glow', theme.glow);
  root.style.setProperty('--theme-particle', theme.particle);
  root.style.setProperty('--theme-bg-start', theme.bgStart);
  root.style.setProperty('--theme-bg-end', theme.bgEnd);
  root.style.setProperty('--theme-orb-color', theme.orbColor);
  root.style.setProperty('--theme-intensity', String(intensity));
}
