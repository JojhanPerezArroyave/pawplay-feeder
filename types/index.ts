// Game Types
export interface GameState {
  hits: number;
  level: number;
  score: number;
  isPlaying: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PreyState {
  position: { x: number; y: number };
  isVisible: boolean;
  size: number;
  speed: number;
}

export interface GameStats {
  totalHits: number;
  sessionTime: number;
  accuracy: number;
  bestStreak: number;
  currentStreak: number;
}

// UI Types
export interface Orientation {
  isLandscape: boolean;
  width: number;
  height: number;
}

export interface StageProps {
  width: number;
  height: number;
  padding: number;
}

// Animation Types
export interface AnimationConfig {
  duration: number;
  useNativeDriver: boolean;
  delay?: number;
}

// Sound Types (para futuras mejoras)
export interface SoundConfig {
  catchSound: string;
  backgroundMusic: string;
  enabled: boolean;
}