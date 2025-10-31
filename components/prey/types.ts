import { ImageSourcePropType } from "react-native";
import { GameState } from "../../types";

export interface PreyProps {
  onCatch: () => void;
  onMiss: () => void;
  difficulty: GameState['difficulty'];
  isPlaying: boolean;
  source?: ImageSourcePropType;
}

export interface Position {
  x: number;
  y: number;
}

export interface MovementConfig {
  min: number;
  max: number;
}

export interface PreyConfig {
  size: number;
  speed: MovementConfig;
  pauseTime: MovementConfig;
}

export interface StageProps {
  width: number;
  height: number;
  size: number;
}