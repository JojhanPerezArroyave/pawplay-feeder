import React from 'react';
import { Animated } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  isLandscape: boolean;
}

export const AppTitle: React.FC<Props> = ({ isLandscape }) => {
  const pulseAnimation = React.useRef(new Animated.Value(1)).current;
  const glowAnimation = React.useRef(new Animated.Value(0)).current;
  const colorAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Animación de pulso
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.03,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    // Animación de brillo
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: false,
        }),
      ])
    );

    // Animación de colores
    const colors = Animated.loop(
      Animated.timing(colorAnimation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: false,
      })
    );

    pulse.start();
    glow.start();
    colors.start();
    
    return () => {
      pulse.stop();
      glow.stop();
      colors.stop();
    };
  }, [pulseAnimation, glowAnimation, colorAnimation]);

  // Interpolación de colores para el efecto rainbow
  const backgroundColorInterpolation = colorAnimation.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      theme.colors.accent.primary + '20',
      theme.colors.accent.secondary + '20',
      theme.colors.accent.success + '20',
      theme.colors.accent.warning + '20',
      theme.colors.accent.danger + '20',
      theme.colors.accent.primary + '20',
    ],
  });

  const borderColorInterpolation = colorAnimation.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      theme.colors.accent.primary,
      theme.colors.accent.secondary,
      theme.colors.accent.success,
      theme.colors.accent.warning,
      theme.colors.accent.danger,
      theme.colors.accent.primary,
    ],
  });

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View 
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.md, // Reducido
        paddingVertical: theme.spacing.sm, // Reducido
        marginHorizontal: theme.spacing.sm, // Reducido
        borderRadius: theme.radius.lg, // Más pequeño
        backgroundColor: backgroundColorInterpolation,
        borderWidth: 2,
        borderColor: borderColorInterpolation,
        shadowColor: theme.colors.accent.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: isLandscape ? 6 : 10, // Reducido
        elevation: 8,
        width: '100%', // Asegurar que use todo el ancho disponible
        maxWidth: isLandscape ? 300 : 280, // Límite máximo
      }}
    >
      <Animated.View style={{
        transform: [{ scale: pulseAnimation }],
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Animated.Text style={{
          fontSize: isLandscape ? theme.typography.sizes.lg : theme.typography.sizes['3xl'], // Más pequeño
          fontWeight: theme.typography.weights.extrabold,
          color: theme.colors.text.primary,
          textAlign: "center",
          letterSpacing: isLandscape ? 1 : 2, // Reducido
          textShadowColor: theme.colors.accent.primary,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: isLandscape ? 6 : 10, // Reducido
          textTransform: 'uppercase',
        }}>
          PAWPLAY FEEDER
        </Animated.Text>
      </Animated.View>

      {/* Efecto de brillo exterior */}
      <Animated.View style={{
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        backgroundColor: 'transparent',
        borderRadius: theme.radius.lg + 4,
        borderWidth: 1,
        borderColor: borderColorInterpolation,
        opacity: glowOpacity,
        zIndex: -1,
      }} />
    </Animated.View>
  );
};