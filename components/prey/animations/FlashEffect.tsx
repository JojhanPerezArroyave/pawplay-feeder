import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface FlashEffectProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

export const FlashEffect: React.FC<FlashEffectProps> = ({
  x,
  y,
  color,
  onComplete,
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Flash inicial rápido y dramático
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 8, // Escala muy grande
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 12,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.9,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onComplete();
    });
  }, [scale, opacity, onComplete]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x - 100,
        top: y - 100,
        width: 200,
        height: 200,
        backgroundColor: '#FFF',
        borderRadius: 100,
        transform: [{ scale }],
        opacity,
        zIndex: 999, // Justo debajo de las partículas
        pointerEvents: 'none',
      }}
    />
  );
};