import React, { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';

interface FireworkExplosionProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

export const FireworkExplosion: React.FC<FireworkExplosionProps> = ({
  x,
  y,
  color,
  onComplete,
}) => {
  const [particles] = useState(() => {
    // Crear 8 partículas grandes y visibles
    const particlesArray = [];
    
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 * Math.PI) / 180; // Cada 45 grados
      const distance = 60;
      
      particlesArray.push({
        id: i,
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        opacity: new Animated.Value(1),
        scale: new Animated.Value(1),
        finalX: Math.cos(angle) * distance,
        finalY: Math.sin(angle) * distance,
        color: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#FFFFFF'][i],
      });
    }
    
    return particlesArray;
  });

  useEffect(() => {
    // Crear animaciones para todas las partículas
    const animations = particles.map(particle => 
      Animated.parallel([
        // Movimiento
        Animated.timing(particle.x, {
          toValue: particle.finalX,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: particle.finalY,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Desvanecimiento
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Escala para mayor visibilidad
        Animated.sequence([
          Animated.timing(particle.scale, {
            toValue: 2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Ejecutar todas las animaciones
    Animated.parallel(animations).start(({ finished }) => {
      if (finished) {
        onComplete();
      }
    });

    // Cleanup
    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [particles, onComplete]);

  return (
    <View
      style={{
        position: 'absolute',
        left: x - 80,
        top: y - 80,
        width: 160,
        height: 160,
        zIndex: 1000,
        pointerEvents: 'none',
        // Sin bordes de debug
      }}
    >
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={{
            position: 'absolute',
            left: 80 - 10, // Centro del contenedor
            top: 80 - 10,
            width: 20,
            height: 20,
            backgroundColor: particle.color,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#FFFFFF',
            transform: [
              { translateX: particle.x },
              { translateY: particle.y },
              { scale: particle.scale },
            ],
            opacity: particle.opacity,
            shadowColor: particle.color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 8,
          }}
        />
      ))}
    </View>
  );
};