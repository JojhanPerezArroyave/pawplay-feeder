import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  rotation: Animated.Value;
  color: string;
  size: number;
  type: 'spark' | 'star' | 'circle' | 'trail' | 'diamond';
}

interface ExplosionEffectProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

export const ExplosionEffect: React.FC<ExplosionEffectProps> = ({
  x,
  y,
  color,
  onComplete,
}) => {
  const particlesRef = useRef<Particle[]>([]);
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    // Crear múltiples tipos de partículas como fuegos artificiales reales
    const particleCount = 32; // Más partículas para mejor efecto
    const particles: Particle[] = [];
    const animations: Animated.CompositeAnimation[] = [];

    // Tipos de partículas
    const particleTypes: ('spark' | 'star' | 'circle' | 'trail' | 'diamond')[] = 
      ['spark', 'star', 'circle', 'trail', 'diamond'];

    for (let i = 0; i < particleCount; i++) {
      const particleType = particleTypes[i % particleTypes.length];
      
      const particle: Particle = {
        id: i,
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        opacity: new Animated.Value(1),
        scale: new Animated.Value(0.2),
        rotation: new Animated.Value(0),
        color: i % 8 === 0 ? color : 
               i % 8 === 1 ? '#FFD700' : // Dorado
               i % 8 === 2 ? '#FFF' :    // Blanco
               i % 8 === 3 ? '#FF6B6B' : // Rosa
               i % 8 === 4 ? '#00CED1' : // Cian
               i % 8 === 5 ? '#FF1493' : // Rosa fuerte
               i % 8 === 6 ? '#32CD32' : // Verde lima
               '#FF8C00', // Naranja
        size: particleType === 'spark' ? Math.random() * 8 + 4 :
              particleType === 'star' ? Math.random() * 12 + 8 :
              particleType === 'trail' ? Math.random() * 6 + 3 :
              Math.random() * 10 + 6,
        type: particleType,
      };

      particles.push(particle);

      // Crear explosión más realista con diferentes patrones
      const baseAngle = (i % 8) * (Math.PI / 4);
      const angleVariation = (Math.random() - 0.5) * 1.2; // Más variación
      const angle = baseAngle + angleVariation;
      
      // Diferentes velocidades y distancias según el tipo
      let distance;
      let duration;
      
      switch (particleType) {
        case 'spark':
          distance = 120 + Math.random() * 100; // Chispas van más lejos
          duration = 800 + Math.random() * 400;
          break;
        case 'star':
          distance = 80 + Math.random() * 80; // Estrellas velocidad media
          duration = 1000 + Math.random() * 200;
          break;
        case 'trail':
          distance = 60 + Math.random() * 60; // Rastros van más lento
          duration = 1200 + Math.random() * 300;
          break;
        default:
          distance = 90 + Math.random() * 90;
          duration = 900 + Math.random() * 300;
      }
      
      const finalX = Math.cos(angle) * distance;
      const finalY = Math.sin(angle) * distance;

      // Animación específica por tipo de partícula
      const animation = Animated.parallel([
        // Movimiento con física diferente por tipo
        Animated.sequence([
          Animated.timing(particle.x, {
            toValue: finalX * 0.4,
            duration: duration * 0.2,
            useNativeDriver: true,
          }),
          Animated.timing(particle.x, {
            toValue: finalX,
            duration: duration * 0.8,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particle.y, {
            toValue: finalY * 0.3,
            duration: duration * 0.3,
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: finalY + (particleType === 'spark' ? 80 : 40), // Gravedad diferente
            duration: duration * 0.7,
            useNativeDriver: true,
          }),
        ]),
        // Escala específica por tipo
        Animated.sequence([
          Animated.timing(particle.scale, {
            toValue: particleType === 'star' ? 4 : 
                    particleType === 'spark' ? 2.5 : 
                    particleType === 'trail' ? 1.5 : 3,
            duration: duration * 0.15,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: particleType === 'trail' ? 0.8 : 1.2,
            duration: duration * 0.25,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: duration * 0.6,
            useNativeDriver: true,
          }),
        ]),
        // Rotación para algunos tipos
        particleType === 'star' || particleType === 'diamond' ? 
          Animated.timing(particle.rotation, {
            toValue: 2 * Math.PI * (Math.random() > 0.5 ? 1 : -1),
            duration: duration,
            useNativeDriver: true,
          }) : 
          Animated.timing(particle.rotation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        // Opacidad con efectos especiales
        Animated.sequence([
          Animated.timing(particle.opacity, {
            toValue: 1,
            duration: duration * 0.1,
            useNativeDriver: true,
          }),
          // Parpadeo para chispas
          ...(particleType === 'spark' ? [
            Animated.timing(particle.opacity, {
              toValue: 0.6,
              duration: duration * 0.1,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 1,
              duration: duration * 0.1,
              useNativeDriver: true,
            }),
          ] : []),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: duration * 0.7,
            useNativeDriver: true,
          }),
        ]),
      ]);

      animations.push(animation);
    }

    particlesRef.current = particles;
    animationsRef.current = animations;

    // Iniciar todas las animaciones
    Animated.parallel(animations).start(() => {
      onComplete();
    });

    // Cleanup
    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [x, y, color, onComplete]);

  // Función para renderizar diferentes tipos de partículas
  const renderParticle = (particle: Particle, index: number) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: 150 - particle.size / 2,
      top: 150 - particle.size / 2,
      width: particle.size,
      height: particle.size,
      transform: [
        { translateX: particle.x },
        { translateY: particle.y },
        { scale: particle.scale },
        { rotate: particle.rotation.interpolate({
          inputRange: [0, 2 * Math.PI],
          outputRange: ['0deg', '360deg'],
        })},
      ],
      opacity: particle.opacity,
      shadowColor: particle.color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 6,
      elevation: 8,
    };

    switch (particle.type) {
      case 'spark':
        return (
          <Animated.View
            key={`spark-${particle.id}`}
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              borderRadius: 0,
              width: particle.size * 0.3,
              height: particle.size * 2,
            }}
          />
        );

      case 'star':
        return (
          <Animated.View
            key={`star-${particle.id}`}
            style={{
              ...baseStyle,
              backgroundColor: 'transparent',
            }}
          >
            {/* Forma de estrella usando múltiples líneas */}
            <Animated.View style={{
              position: 'absolute',
              left: particle.size / 2 - 1,
              top: 0,
              width: 2,
              height: particle.size,
              backgroundColor: particle.color,
            }} />
            <Animated.View style={{
              position: 'absolute',
              left: 0,
              top: particle.size / 2 - 1,
              width: particle.size,
              height: 2,
              backgroundColor: particle.color,
            }} />
            <Animated.View style={{
              position: 'absolute',
              left: particle.size * 0.15,
              top: particle.size * 0.15,
              width: particle.size * 0.7,
              height: 2,
              backgroundColor: particle.color,
              transform: [{ rotate: '45deg' }],
            }} />
            <Animated.View style={{
              position: 'absolute',
              left: particle.size * 0.15,
              top: particle.size * 0.15,
              width: particle.size * 0.7,
              height: 2,
              backgroundColor: particle.color,
              transform: [{ rotate: '-45deg' }],
            }} />
          </Animated.View>
        );

      case 'diamond':
        return (
          <Animated.View
            key={`diamond-${particle.id}`}
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              transform: [
                ...baseStyle.transform,
                { rotate: '45deg' },
              ],
            }}
          />
        );

      case 'trail':
        return (
          <React.Fragment key={`trail-${particle.id}`}>
            {/* Partícula principal */}
            <Animated.View
              style={{
                ...baseStyle,
                backgroundColor: particle.color,
                borderRadius: particle.size / 2,
              }}
            />
            {/* Rastro */}
            <Animated.View
              style={{
                position: 'absolute',
                left: 150 - (particle.size * 0.8) / 2,
                top: 150 - (particle.size * 0.8) / 2,
                width: particle.size * 0.8,
                height: particle.size * 0.8,
                backgroundColor: particle.color,
                borderRadius: (particle.size * 0.8) / 2,
                transform: [
                  { translateX: particle.x.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, -20],
                  })},
                  { translateY: particle.y.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, -20],
                  })},
                  { scale: particle.scale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.6],
                  })},
                ],
                opacity: particle.opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              }}
            />
          </React.Fragment>
        );

      default: // circle
        return (
          <Animated.View
            key={`circle-${particle.id}`}
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              borderRadius: particle.size / 2,
            }}
          />
        );
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: x - 150,
        top: y - 150,
        width: 300,
        height: 300,
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      {particlesRef.current.map((particle, index) => (
        <React.Fragment key={particle.id}>
          {renderParticle(particle, index)}
          
          {/* Halo de brillo para todas las partículas */}
          <Animated.View
            style={{
              position: 'absolute',
              left: 150 - (particle.size * 1.8) / 2,
              top: 150 - (particle.size * 1.8) / 2,
              width: particle.size * 1.8,
              height: particle.size * 1.8,
              backgroundColor: particle.color,
              borderRadius: (particle.size * 1.8) / 2,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2],
              }),
              zIndex: -1,
            }}
          />
        </React.Fragment>
      ))}
    </View>
  );
};