import React from "react";
import {
    Animated,
    TouchableWithoutFeedback,
} from "react-native";
import { theme } from "../../constants/theme";
import { usePreyLogic } from "./hooks/usePreyLogic";
import { PreyProps } from "./types";

export default function Prey({
  onCatch,
  onMiss,
  difficulty = 'medium',
  isPlaying = true,
  source = require("../../assets/images/mouse.png"),
}: PreyProps) {
  const {
    isVisible,
    size,
    position,
    scale,
    opacity,
    rotateZ,
    handlePress,
  } = usePreyLogic(difficulty, isPlaying, onCatch);
  
  if (!isVisible) return null;
  
  return (
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
            // Comentamos temporalmente el tintColor para ver la imagen original
            // tintColor: difficulty === 'hard' ? theme.colors.accent.danger : 
            //           difficulty === 'easy' ? theme.colors.accent.success : 
            //           theme.colors.text.accent,
          }}
          resizeMode="contain"
        />
        
        {/* Efecto de brillo - comentado temporalmente para debugging */}
        {/* <Animated.View
          style={{
            position: 'absolute',
            width: size + 4,
            height: size + 4,
            backgroundColor: theme.colors.text.accent,
            borderRadius: size / 2,
            opacity: 0.2,
            zIndex: -1,
          }}
        /> */}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}