import React from "react";
import {
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { theme } from "../../constants/theme";
import { FireworkExplosion } from "./animations/FireworkExplosion";
import { FlashEffect } from "./animations/FlashEffect";
import { TrailEffect } from "./animations/TrailEffect";
import { useExplosions } from "./hooks/useExplosions";
import { usePreyLogic } from "./hooks/usePreyLogic";
import { PreyProps } from "./types";

export default function Prey({
  onCatch,
  onMiss,
  difficulty = 'medium',
  isPlaying = true,
  source = require("../../assets/images/mouse.png"),
}: PreyProps) {
  // Hook para manejar explosiones
  const { explosions, flashes, createExplosion, removeExplosion, removeFlash } = useExplosions();
  
  const {
    isVisible,
    size,
    currentPosition,
    difficultyColor,
    position,
    scale,
    opacity,
    rotateZ,
    handlePress,
  } = usePreyLogic(difficulty, isPlaying, onCatch, createExplosion);
  
  // Colores basados en dificultad
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'hard': return theme.colors.accent.danger;
      case 'easy': return theme.colors.accent.success;
      default: return theme.colors.accent.primary;
    }
  };
  
  // Usar el color del hook o el calculado localmente
  const finalDifficultyColor = difficultyColor || getDifficultyColor();
  
  if (!isVisible) return null;
  
  return (
    <>
      {/* Efecto de estela */}
      <TrailEffect
        x={currentPosition.x + size / 2}
        y={currentPosition.y + size / 2}
        color={finalDifficultyColor}
        isActive={isVisible && isPlaying}
        size={size}
      />
      
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
            // Área táctil expandida
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Animated.Image
            source={source}
            style={{
              width: size,
              height: size,
            }}
            resizeMode="contain"
          />
          
          {/* Overlay de color basado en dificultad - más sutil */}
          <Animated.View
            style={{
              position: 'absolute',
              width: size,
              height: size,
              backgroundColor: finalDifficultyColor,
              opacity: 0.15, // Muy sutil para no ocultar la imagen
              borderRadius: size / 8,
              mixBlendMode: 'multiply', // Mezcla el color con la imagen
            }}
          />
          
          {/* Efecto de brillo sutil */}
          <Animated.View
            style={{
              position: 'absolute',
              width: size + 6,
              height: size + 6,
              backgroundColor: finalDifficultyColor,
              borderRadius: size / 2,
              opacity: 0.2,
              zIndex: -1,
            }}
          />
          
          {/* Borde dinámico para indicar dificultad */}
          <Animated.View
            style={{
              position: 'absolute',
              width: size + 2,
              height: size + 2,
              borderWidth: 1,
              borderColor: finalDifficultyColor,
              borderRadius: size / 6,
              opacity: 0.6,
              zIndex: 1,
            }}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      
      {/* Efectos de flash */}
      {flashes.map((flash) => (
        <FlashEffect
          key={flash.id}
          x={flash.x}
          y={flash.y}
          color={flash.color}
          onComplete={() => removeFlash(flash.id)}
        />
      ))}
      
      {/* Efectos de explosión */}
      {explosions.map((explosion) => (
        <FireworkExplosion
          key={explosion.id}
          x={explosion.x}
          y={explosion.y}
          color={explosion.color}
          onComplete={() => removeExplosion(explosion.id)}
        />
      ))}
    </>
  );
}