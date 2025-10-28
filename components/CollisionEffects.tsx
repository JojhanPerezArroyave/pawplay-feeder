import React from 'react';
import { Animated } from 'react-native';
import { theme } from '../constants/theme';

interface ParticleProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export const CollisionEffect: React.FC<ParticleProps> = ({ x, y, onComplete }) => {
  const particles = React.useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      animation: new Animated.ValueXY({ x, y }),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      rotation: new Animated.Value(0),
    })), [x, y]
  );

  React.useEffect(() => {
    const animateParticles = () => {
      const particleAnimations = particles.map((particle, index) => {
        const angle = (index / particles.length) * 2 * Math.PI;
        const distance = 50 + Math.random() * 30;
        const targetX = x + Math.cos(angle) * distance;
        const targetY = y + Math.sin(angle) * distance;

        return Animated.parallel([
          // Movimiento
          Animated.timing(particle.animation, {
            toValue: { x: targetX, y: targetY },
            duration: 600 + Math.random() * 400,
            useNativeDriver: true,
          }),
          // Escala
          Animated.sequence([
            Animated.timing(particle.scale, {
              toValue: 1.5,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 0,
              duration: 500 + Math.random() * 300,
              useNativeDriver: true,
            }),
          ]),
          // Opacidad
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          // Rotación
          Animated.timing(particle.rotation, {
            toValue: Math.random() > 0.5 ? 1 : -1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.parallel(particleAnimations).start(() => {
        onComplete();
      });
    };

    animateParticles();
  }, [particles, x, y, onComplete]);

  return (
    <>
      {particles.map((particle, index) => {
        const rotateZ = particle.rotation.interpolate({
          inputRange: [-1, 1],
          outputRange: ['-360deg', '360deg'],
        });

        const colors = [
          theme.colors.accent.primary,
          theme.colors.accent.secondary,
          theme.colors.accent.success,
          theme.colors.accent.warning,
          theme.colors.accent.danger,
        ];

        return (
          <Animated.View
            key={particle.id}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              backgroundColor: colors[index % colors.length],
              borderRadius: 4,
              transform: [
                { translateX: particle.animation.x },
                { translateY: particle.animation.y },
                { scale: particle.scale },
                { rotate: rotateZ },
              ],
              opacity: particle.opacity,
              zIndex: 100,
            }}
          />
        );
      })}
    </>
  );
};

interface RippleProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export const RippleEffect: React.FC<RippleProps> = ({ x, y, onComplete }) => {
  const scale = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 3,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  }, [scale, opacity, onComplete]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x - 25,
        top: y - 25,
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: theme.colors.accent.success,
        transform: [{ scale }],
        opacity,
        zIndex: 99,
      }}
    />
  );
};