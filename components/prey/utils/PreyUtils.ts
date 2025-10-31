import { Position, StageProps } from "../types";

export class PreyUtils {
  static random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  static getRandomPosition({ width, height, size }: StageProps): Position {
    const maxX = Math.max(0, width - size);
    const maxY = Math.max(0, height - size);
    
    return {
      x: this.random(0, maxX),
      y: this.random(0, maxY),
    };
  }

  static getMovementLimits(width: number, height: number, size: number) {
    return {
      maxX: Math.max(0, width - size),
      maxY: Math.max(0, height - size),
    };
  }

  static getCenterPosition(maxX: number, maxY: number): Position {
    return {
      x: maxX / 2,
      y: maxY / 2,
    };
  }
}