import React from 'react';
import { Animated } from 'react-native';
import { theme } from '../constants/theme';
import { CollisionEffect, RippleEffect } from './CollisionEffects';

interface Props {
  children: React.ReactNode;
  isLandscape: boolean;
  style?: any;
  onCatch?: (x: number, y: number) => void;
}

export const GameStage: React.FC<Props> = ({ children, isLandscape, style, onCatch }) => {
  const colorAnimation = React.useRef(new Animated.Value(0)).current;
  const pulseAnimation = React.useRef(new Animated.Value(1)).current;
  
  // Estados para efectos de colisión
  const [effects, setEffects] = React.useState<{
    id: number;
    x: number;
    y: number;
    type: 'collision' | 'ripple';
  }[]>([]);

  // Función para crear efectos de colisión
  const createCollisionEffect = React.useCallback((x: number, y: number) => {
    const newEffects = [
      { id: Date.now(), x, y, type: 'collision' as const },
      { id: Date.now() + 1, x, y, type: 'ripple' as const },
    ];
    setEffects(prev => [...prev, ...newEffects]);
  }, []);

  // Función para remover efectos completados
  const removeEffect = React.useCallback((id: number) => {
    setEffects(prev => prev.filter(effect => effect.id !== id));
  }, []);

  // Exponer la función de efectos a través de ref
  React.useImperativeHandle(onCatch as any, () => createCollisionEffect, [createCollisionEffect]);

  React.useEffect(() => {
    // Animación de colores del fondo
    const colorCycle = Animated.loop(
      Animated.timing(colorAnimation, {
        toValue: 1,
        duration: 12000, // Ciclo más lento para ser sutil
        useNativeDriver: false,
      })
    );

    // Animación de pulso sutil
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.02,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    colorCycle.start();
    pulse.start();

    return () => {
      colorCycle.stop();
      pulse.stop();
    };
  }, [colorAnimation, pulseAnimation]);

  // Interpolación de colores para el fondo
  const backgroundColorInterpolation = colorAnimation.interpolate({
    inputRange: [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1],
    outputRange: [
      theme.colors.game.stage, // Color base
      theme.colors.accent.primary + '10', // Azul muy sutil
      theme.colors.accent.secondary + '08', // Púrpura muy sutil
      theme.colors.accent.success + '06', // Verde muy sutil
      theme.colors.accent.warning + '08', // Amarillo muy sutil
      theme.colors.accent.danger + '06', // Rojo muy sutil
      theme.colors.game.stage, // Vuelve al color base
    ],
  });

  // Interpolación para el borde
  const borderColorInterpolation = colorAnimation.interpolate({
    inputRange: [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1],
    outputRange: [
      theme.colors.game.stageBorder,
      theme.colors.accent.primary + '40',
      theme.colors.accent.secondary + '40',
      theme.colors.accent.success + '40',
      theme.colors.accent.warning + '40',
      theme.colors.accent.danger + '40',
      theme.colors.game.stageBorder,
    ],
  });

  // Interpolación para el brillo del borde
  const glowOpacity = colorAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  return (
    <Animated.View
      style={[
        {
          width: "100%",
          height: isLandscape ? "85%" : "90%", // Más conservador
          maxHeight: isLandscape ? 300 : 400, // Límites más estrictos
          minHeight: isLandscape ? 200 : 250, // Mínimos ajustados
          backgroundColor: backgroundColorInterpolation,
          borderWidth: 4,
          borderColor: borderColorInterpolation,
          borderRadius: theme.radius.xl,
          overflow: "hidden",
          position: "relative",
          // Sombra dinámica (sin animación para evitar conflictos)
          shadowColor: theme.colors.game.stageBorder,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: isLandscape ? 8 : 15,
          elevation: 8,
        },
        style,
      ]}
    >
      <Animated.View style={{
        width: "100%",
        height: "100%",
        transform: [{ scale: pulseAnimation }],
      }}>
        {children}
      </Animated.View>
      
      {/* Efecto de brillo exterior */}
      <Animated.View 
        style={{
          position: 'absolute',
          top: -6,
          left: -6,
          right: -6,
          bottom: -6,
          backgroundColor: 'transparent',
          borderRadius: theme.radius.xl + 6,
          borderWidth: 2,
          borderColor: borderColorInterpolation,
          opacity: glowOpacity,
          zIndex: -1,
        }} 
      />
      
      {/* Efecto de ondas internas */}
      <Animated.View
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          right: '10%',
          bottom: '10%',
          backgroundColor: 'transparent',
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: borderColorInterpolation,
          opacity: 0.3,
        }}
      />
      
      {/* Efectos de colisión */}
      {effects.map(effect => (
        effect.type === 'collision' ? (
          <CollisionEffect
            key={effect.id}
            x={effect.x}
            y={effect.y}
            onComplete={() => removeEffect(effect.id)}
          />
        ) : (
          <RippleEffect
            key={effect.id}
            x={effect.x}
            y={effect.y}
            onComplete={() => removeEffect(effect.id)}
          />
        )
      ))}
    </Animated.View>
  );
};