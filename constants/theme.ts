/**
 * Pawplay Feeder Theme System
 * Comprehensive design system for the cat gaming app
 */

import { Platform } from 'react-native';

// Colores principales
const colors = {
  // Fondos
  background: {
    primary: '#0f172a',      // Azul muy oscuro
    secondary: '#1e293b',    // Azul oscuro
    tertiary: '#334155',     // Azul medio
    surface: '#475569',      // Azul gris
  },
  
  // Textos
  text: {
    primary: '#f8fafc',      // Blanco casi puro
    secondary: '#e2e8f0',    // Gris muy claro
    tertiary: '#94a3b8',     // Gris medio
    accent: '#fbbf24',       // Amarillo dorado
  },
  
  // Acentos y estados
  accent: {
    primary: '#3b82f6',      // Azul vibrante
    secondary: '#8b5cf6',    // Púrpura
    success: '#10b981',      // Verde
    warning: '#f59e0b',      // Naranja
    danger: '#ef4444',       // Rojo
  },
  
  // Juego específico
  game: {
    stage: '#1e293b',        // Fondo del área de juego
    stageBorder: '#3b82f6',  // Borde del área de juego
    prey: '#fbbf24',         // Color de la presa
    hit: '#10b981',          // Color cuando se acierta
    miss: '#ef4444',         // Color cuando se falla
  },
  
  // Transparencias
  overlay: {
    light: 'rgba(248, 250, 252, 0.1)',
    medium: 'rgba(248, 250, 252, 0.2)',
    dark: 'rgba(15, 23, 42, 0.8)',
  },
};

// Espaciado consistente
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Radios de borde
const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999,
};

// Tipografía
const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

// Sombras
const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Configuraciones de juego
const gameConfig = {
  prey: {
    sizes: {
      easy: 140,
      medium: 120,
      hard: 100,
    },
    speeds: {
      easy: { min: 1000, max: 2000 },
      medium: { min: 700, max: 1400 },
      hard: { min: 400, max: 1000 },
    },
    pauseTime: {
      easy: { min: 500, max: 1000 },
      medium: { min: 200, max: 600 },
      hard: { min: 100, max: 400 },
    },
  },
  animations: {
    catch: {
      duration: 200,
      scale: 0.8,
    },
    hop: {
      tension: 100,
      friction: 8,
    },
  },
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  gameConfig,
};

// Legacy exports for compatibility
export const Colors = {
  light: {
    text: colors.text.primary,
    background: colors.background.primary,
    tint: colors.accent.primary,
    icon: colors.text.tertiary,
    tabIconDefault: colors.text.tertiary,
    tabIconSelected: colors.accent.primary,
  },
  dark: {
    text: colors.text.primary,
    background: colors.background.primary,
    tint: colors.accent.primary,
    icon: colors.text.tertiary,
    tabIconDefault: colors.text.tertiary,
    tabIconSelected: colors.accent.primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
