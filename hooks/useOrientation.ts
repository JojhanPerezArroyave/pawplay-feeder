import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { Orientation, StageProps } from '../types';

export const useOrientation = (): Orientation => {
  const { width, height } = useWindowDimensions();
  
  return useMemo(() => ({
    isLandscape: width > height,
    width,
    height,
  }), [width, height]);
};

export const useStageCalculations = (): StageProps => {
  const { width, height, isLandscape } = useOrientation();
  
  return useMemo(() => {
    const padding = 16;
    
    if (isLandscape) {
      // En horizontal: usar toda el área disponible del GameStage
      const availableWidth = width * 0.85; // 85% del ancho total para dar margen
      const availableHeight = height * 0.75; // 75% del alto disponible
      
      return {
        width: availableWidth - (padding * 2),
        height: Math.min(availableHeight, 350), // Máximo 350px de altura
        padding,
      };
    } else {
      // En vertical: layout tradicional
      return {
        width: width - (padding * 2),
        height: height * 0.5,
        padding,
      };
    }
  }, [width, height, isLandscape]);
};