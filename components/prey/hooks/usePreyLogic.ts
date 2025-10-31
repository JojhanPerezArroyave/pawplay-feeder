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
  onCatch: () => void,
  onExplosion?: (x: number, y: number, color: string) => void
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
  const currentPositionRef = useRef({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUpdateRef = useRef({ x: 0, y: 0 });
  
  // Límites del movimiento
  const { maxX, maxY } = PreyUtils.getMovementLimits(width, height, size);
  
  // Función para obtener posición aleatoria
  const getRandomPosition = useCallback((): Position => 
    PreyUtils.getRandomPosition({ width, height, size }), 
    [width, height, size]
  );
  
  // Función para obtener color de dificultad
  const getDifficultyColor = useCallback(() => {
    switch (difficulty) {
      case 'hard': return theme.colors.accent.danger;
      case 'easy': return theme.colors.accent.success;
      default: return theme.colors.accent.primary;
    }
  }, [difficulty]);
  
  // Listener optimizado para la posición (usando useCallback para estabilidad)
  const positionListener = useCallback(({ x, y }: { x: number; y: number }) => {
    currentPositionRef.current = { x, y };
    // Solo actualizar el estado ocasionalmente para la estela, no en cada frame
    const threshold = 15; // Umbral de distancia para actualizar
    const dx = Math.abs(x - lastUpdateRef.current.x);
    const dy = Math.abs(y - lastUpdateRef.current.y);
    
    if (dx > threshold || dy > threshold) {
      lastUpdateRef.current = { x, y };
      setCurrentPosition({ x, y });
    }
  }, []); // Sin dependencias para evitar recreación
  
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
  
  // Inicialización básica
  useEffect(() => {
    const initialPos = getRandomPosition();
    position.setValue(initialPos);
    setCurrentPosition(initialPos);
    currentPositionRef.current = initialPos;
    lastUpdateRef.current = initialPos;
    
    // Listener optimizado para actualizar la posición para la estela
    const listenerId = position.addListener(positionListener);
    
    // Iniciar rotación
    PreyAnimations.createRotationAnimation(rotation).start();
    
    return () => {
      position.removeListener(listenerId);
      if (animationRef.current) {
        animationRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [getRandomPosition, positionListener, rotation, position]);
  
  // Inicialización del movimiento
  useEffect(() => {
    if (isPlaying) {
      const initialDelay = PreyUtils.random(100, 500);
      timeoutRef.current = setTimeout(hop, initialDelay);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hop, isPlaying]);
  
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
    
    // Usar la posición del ref que se actualiza continuamente
    const explosionPosition = {
      x: currentPositionRef.current.x + size / 2, // Centro de la presa
      y: currentPositionRef.current.y + size / 2,
    };
    
    // Crear explosión si el callback está disponible
    if (onExplosion) {
      onExplosion(
        explosionPosition.x,
        explosionPosition.y,
        getDifficultyColor()
      );
    }
    
    // Detener movimiento actual
    if (animationRef.current) {
      animationRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    onCatch();
    animateCatch();
  }, [isVisible, isPlaying, onCatch, animateCatch, onExplosion, size, getDifficultyColor]);
  
  return {
    // Estados
    isVisible,
    size,
    currentPosition,
    difficultyColor: getDifficultyColor(),
    
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