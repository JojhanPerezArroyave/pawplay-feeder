import { useCallback, useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { theme } from "../../../constants/theme";
import { useStageCalculations } from "../../../hooks/useOrientation";
import { GameState } from "../../../types";
import { MovementPatterns } from "../animations/MovementPatterns";
import { PreyAnimations } from "../animations/PreyAnimations";
import { Position } from "../types";
import { PreyUtils } from "../utils/PreyUtils";

export function usePreyLogic(
  difficulty: GameState['difficulty'],
  isPlaying: boolean,
  onCatch: () => void
) {
  const { width, height } = useStageCalculations();
  
  // Configuración basada en dificultad
  const config = theme.gameConfig.prey;
  const size = config.sizes[difficulty];
  const speed = config.speeds[difficulty];
  const pauseTime = config.pauseTime[difficulty];
  
  // Refs para animaciones
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  
  // Estados
  const [isVisible, setIsVisible] = useState(true);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Límites del movimiento
  const { maxX, maxY } = PreyUtils.getMovementLimits(width, height, size);
  
  // Función para obtener posición aleatoria
  const getRandomPosition = useCallback((): Position => 
    PreyUtils.getRandomPosition({ width, height, size }), 
    [width, height, size]
  );
  
  // Función principal de movimiento
  const hop = useCallback(() => {
    if (!isPlaying) return;
    
    const movement = MovementPatterns.getRandomPattern(
      position,
      getRandomPosition,
      maxX,
      maxY,
      speed
    );
    
    animationRef.current = movement;
    
    movement.start(({ finished }) => {
      if (finished && isPlaying) {
        const nextPause = PreyUtils.random(pauseTime.min, pauseTime.max);
        timeoutRef.current = setTimeout(hop, nextPause);
      }
    });
  }, [isPlaying, position, getRandomPosition, maxX, maxY, speed, pauseTime]);
  
  // Inicialización
  useEffect(() => {
    const initialPos = getRandomPosition();
    position.setValue(initialPos);
    
    // Iniciar rotación
    PreyAnimations.createRotationAnimation(rotation).start();
    
    const initialDelay = PreyUtils.random(100, 500);
    timeoutRef.current = setTimeout(hop, initialDelay);
    
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hop, position, getRandomPosition, rotation]);
  
  // Control de juego
  useEffect(() => {
    if (isPlaying) {
      hop();
    } else {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [isPlaying, hop]);
  
  // Animación de captura
  const animateCatch = useCallback(() => {
    setIsVisible(false);
    
    PreyAnimations.createCatchAnimation(scale, opacity).start(() => {
      // Resetear y reaparecer en nueva posición
      const newPos = getRandomPosition();
      PreyAnimations.resetCatchAnimation(scale, opacity, position, newPos);
      setIsVisible(true);
      
      // Continuar movimiento
      const delay = PreyUtils.random(pauseTime.min, pauseTime.max);
      timeoutRef.current = setTimeout(hop, delay);
    });
  }, [scale, opacity, position, getRandomPosition, pauseTime, hop]);
  
  // Handler de toque
  const handlePress = useCallback(() => {
    console.log("🎯 Toque en presa detectado - isVisible:", isVisible, "isPlaying:", isPlaying);
    if (!isVisible || !isPlaying) return;
    
    // Detener movimiento actual
    if (animationRef.current) {
      animationRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    onCatch();
    animateCatch();
  }, [isVisible, isPlaying, onCatch, animateCatch]);
  
  return {
    // Estados
    isVisible,
    size,
    
    // Valores animados
    position,
    scale,
    rotation,
    opacity,
    rotateZ: PreyAnimations.getRotationInterpolation(rotation),
    
    // Handlers
    handlePress,
  };
}