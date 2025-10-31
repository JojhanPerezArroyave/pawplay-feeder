import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  opacity: Animated.Value;
  scale: Animated.Value;
  timestamp: number;
}

interface TrailEffectProps {
  x: number;
  y: number;
  color: string;
  isActive: boolean;
  size: number;
}

export const TrailEffect: React.FC<TrailEffectProps> = ({
  x,
  y,
  color,
  isActive,
  size,
}) => {
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const lastPositionRef = useRef({ x, y });
  const trailIdRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      // Limpiar la estela cuando no está activo
      setTrailPoints([]);
      return;
    }

    // Solo agregar punto si la posición cambió significativamente
    const distance = Math.sqrt(
      Math.pow(x - lastPositionRef.current.x, 2) + 
      Math.pow(y - lastPositionRef.current.y, 2)
    );

    if (distance > 3) { // Sensibilidad mayor para estela más densa
      const newPoint: TrailPoint = {
        id: trailIdRef.current++,
        x,
        y,
        opacity: new Animated.Value(0.9), // Más opaco al inicio
        scale: new Animated.Value(1.2), // Empieza más grande
        timestamp: Date.now(),
      };

      setTrailPoints(prev => {
        const updated = [...prev, newPoint];
        
        // Mantener máximo 20 puntos en la estela (más larga)
        if (updated.length > 20) {
          return updated.slice(-20);
        }
        return updated;
      });

      // Animar desvanecimiento del nuevo punto - más lento
      Animated.parallel([
        Animated.timing(newPoint.opacity, {
          toValue: 0,
          duration: 1200, // Duración más larga
          useNativeDriver: true,
        }),
        Animated.timing(newPoint.scale, {
          toValue: 0.1, // Se encoge más
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start();

      lastPositionRef.current = { x, y };
    }

    // Limpiar puntos viejos - tiempo más largo
    const now = Date.now();
    setTrailPoints(prev => prev.filter(point => now - point.timestamp < 1300));
  }, [x, y, isActive]);

  if (!isActive) return null;

  return (
    <>
      {trailPoints.map((point, index) => {
        // Calcular opacidad basada en la edad del punto
        const ageRatio = index / trailPoints.length;
        const baseOpacity = 0.9 - (ageRatio * 0.7);
        
        return (
          <React.Fragment key={point.id}>
            {/* Punto principal de la estela */}
            <Animated.View
              style={{
                position: 'absolute',
                left: point.x,
                top: point.y,
                width: size * 0.4, // Más grande
                height: size * 0.4,
                backgroundColor: color,
                borderRadius: (size * 0.4) / 2,
                transform: [
                  { translateX: -(size * 0.4) / 2 },
                  { translateY: -(size * 0.4) / 2 },
                  { scale: point.scale },
                ],
                opacity: point.opacity,
                zIndex: -10 - index,
                // Añadir sombra para mejor visibilidad
                shadowColor: color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: baseOpacity * 0.8,
                shadowRadius: 4,
                elevation: 3,
              }}
            />
            
            {/* Halo exterior para cada punto */}
            <Animated.View
              style={{
                position: 'absolute',
                left: point.x,
                top: point.y,
                width: size * 0.6,
                height: size * 0.6,
                backgroundColor: color,
                borderRadius: (size * 0.6) / 2,
                transform: [
                  { translateX: -(size * 0.6) / 2 },
                  { translateY: -(size * 0.6) / 2 },
                  { scale: point.scale },
                ],
                opacity: point.opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, baseOpacity * 0.3],
                }),
                zIndex: -15 - index,
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};