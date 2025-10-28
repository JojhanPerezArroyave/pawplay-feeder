import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    ImageSourcePropType,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { theme } from "../constants/theme";
import { useStageCalculations } from "../hooks/useOrientation";
import { GameState } from "../types";

interface Props {
  onCatch: () => void;
  onMiss: () => void;
  difficulty: GameState['difficulty'];
  isPlaying: boolean;
  source?: ImageSourcePropType;
}

export default function Prey({
  onCatch,
  onMiss,
  difficulty = 'medium',
  isPlaying = true,
  source = require("../assets/images/mouse.png"),
}: Props) {
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
  const maxX = Math.max(0, width - size);
  const maxY = Math.max(0, height - size);
  
  // Utilidades
  const random = useCallback((min: number, max: number) => 
    Math.random() * (max - min) + min, []);
  
  const randomPosition = useCallback(() => ({
    x: random(0, maxX),
    y: random(0, maxY),
  }), [maxX, maxY, random]);
  
  // Función de movimiento mejorada con patrones más realistas
  const createMovementPattern = useCallback(() => {
    const patterns = [
      // Movimiento directo rápido
      () => {
        const target = randomPosition();
        const duration = random(speed.min, speed.max);
        
        return Animated.timing(position, {
          toValue: target,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        });
      },
      
      // Movimiento en zigzag
      () => {
        const waypoints = [
          randomPosition(),
          randomPosition(),
          randomPosition(),
        ];
        
        return Animated.sequence(
          waypoints.map((point, index) => 
            Animated.timing(position, {
              toValue: point,
              duration: random(speed.min * 0.6, speed.max * 0.6),
              easing: index % 2 === 0 ? Easing.in(Easing.ease) : Easing.out(Easing.ease),
              useNativeDriver: true,
            })
          )
        );
      },
      
      // Movimiento circular
      () => {
        const center = {
          x: maxX / 2,
          y: maxY / 2,
        };
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
              duration: random(speed.min * 0.3, speed.max * 0.3),
              easing: Easing.linear,
              useNativeDriver: true,
            })
          )
        );
      },
    ];
    
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    return selectedPattern();
  }, [position, randomPosition, maxX, maxY, speed, random]);
  
  // Animación de rotación continua
  const startRotation = useCallback(() => {
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    Animated.loop(
      Animated.timing(rotation, {
        toValue: direction,
        duration: random(3000, 6000),
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation, random]);
  
  // Función principal de movimiento
  const hop = useCallback(() => {
    if (!isPlaying) return;
    
    const movement = createMovementPattern();
    animationRef.current = movement;
    
    movement.start(({ finished }) => {
      if (finished && isPlaying) {
        const nextPause = random(pauseTime.min, pauseTime.max);
        timeoutRef.current = setTimeout(hop, nextPause);
      }
    });
  }, [isPlaying, createMovementPattern, pauseTime, random]);
  
  // Efectos de inicialización
  useEffect(() => {
    const initialPos = randomPosition();
    position.setValue(initialPos);
    startRotation();
    
    const initialDelay = random(100, 500);
    timeoutRef.current = setTimeout(hop, initialDelay);
    
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hop, position, random, randomPosition, startRotation]);
  
  // Efectos de cambio de estado
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
  
  // Animación de captura exitosa
  const animateCatch = useCallback(() => {
    setIsVisible(false);
    
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1.5,
        duration: 150,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Resetear y reaparecer en nueva posición
      const newPos = randomPosition();
      position.setValue(newPos);
      scale.setValue(1);
      opacity.setValue(1);
      setIsVisible(true);
      
      // Continuar movimiento
      const delay = random(pauseTime.min, pauseTime.max);
      timeoutRef.current = setTimeout(hop, delay);
    });
  }, [scale, opacity, position, randomPosition, pauseTime, random, hop]);
  
  // Handler de toque
  const handlePress = useCallback(() => {
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
  
  // Handler para toques fallidos en el stage
  const handleMissTouch = useCallback(() => {
    if (isPlaying) {
      onMiss();
    }
  }, [isPlaying, onMiss]);
  
  // Interpolaciones para animaciones
  const rotateZ = rotation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-360deg', '360deg'],
  });
  
  if (!isVisible) return null;
  
  return (
    <>
      {/* Área invisible para detectar toques fallidos */}
      <TouchableWithoutFeedback onPress={handleMissTouch}>
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }} />
      </TouchableWithoutFeedback>
      
      {/* La presa */}
      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { scale },
              { rotate: rotateZ },
            ],
            opacity,
            zIndex: 10,
          }}
        >
          <Animated.Image
            source={source}
            style={{
              width: '100%',
              height: '100%',
              tintColor: difficulty === 'hard' ? theme.colors.accent.danger : 
                        difficulty === 'easy' ? theme.colors.accent.success : 
                        theme.colors.text.accent,
            }}
            resizeMode="contain"
          />
          
          {/* Efecto de brillo */}
          <Animated.View
            style={{
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              backgroundColor: theme.colors.text.accent,
              borderRadius: size / 2,
              opacity: 0.2,
              zIndex: -1,
            }}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    </>
  );
}
