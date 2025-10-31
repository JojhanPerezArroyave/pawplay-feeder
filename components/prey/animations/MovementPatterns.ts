import { Animated, Easing } from "react-native";
import { MovementConfig, Position } from "../types";
import { PreyUtils } from "../utils/PreyUtils";

export class MovementPatterns {
  static createDirectMovement(
    position: Animated.ValueXY,
    getRandomPosition: () => Position,
    speed: MovementConfig
  ): Animated.CompositeAnimation {
    const target = getRandomPosition();
    const duration = PreyUtils.random(speed.min, speed.max);
    
    return Animated.timing(position, {
      toValue: target,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
  }

  static createZigzagMovement(
    position: Animated.ValueXY,
    getRandomPosition: () => Position,
    speed: MovementConfig
  ): Animated.CompositeAnimation {
    const waypoints = [
      getRandomPosition(),
      getRandomPosition(),
      getRandomPosition(),
    ];
    
    return Animated.sequence(
      waypoints.map((point, index) => 
        Animated.timing(position, {
          toValue: point,
          duration: PreyUtils.random(speed.min * 0.6, speed.max * 0.6),
          easing: index % 2 === 0 ? Easing.in(Easing.ease) : Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      )
    );
  }

  static createCircularMovement(
    position: Animated.ValueXY,
    maxX: number,
    maxY: number,
    speed: MovementConfig
  ): Animated.CompositeAnimation {
    const center = PreyUtils.getCenterPosition(maxX, maxY);
    const radius = Math.min(maxX, maxY) * 0.3;
    const steps = 8;
    const angles = Array.from({ length: steps }, (_, i) => (i / steps) * 2 * Math.PI);
    
    return Animated.sequence(
      angles.map(angle => 
        Animated.timing(position, {
          toValue: {
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * radius,
          },
          duration: PreyUtils.random(speed.min * 0.3, speed.max * 0.3),
          easing: Easing.linear,
          useNativeDriver: true,
        })
      )
    );
  }

  static getRandomPattern(
    position: Animated.ValueXY,
    getRandomPosition: () => Position,
    maxX: number,
    maxY: number,
    speed: MovementConfig
  ): Animated.CompositeAnimation {
    const patterns = [
      () => this.createDirectMovement(position, getRandomPosition, speed),
      () => this.createZigzagMovement(position, getRandomPosition, speed),
      () => this.createCircularMovement(position, maxX, maxY, speed),
    ];
    
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    return selectedPattern();
  }
}