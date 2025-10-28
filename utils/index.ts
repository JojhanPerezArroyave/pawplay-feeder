/**
 * Utilidades comunes para la aplicación Pawplay Feeder
 */

// Utilidades de tiempo
export const timeUtils = {
  formatTime: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },
  
  formatTimeShort: (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },
  
  msToSeconds: (ms: number): number => Math.floor(ms / 1000),
  
  secondsToMs: (seconds: number): number => seconds * 1000,
};

// Utilidades de matemáticas y física
export const mathUtils = {
  // Generar número aleatorio entre min y max
  random: (min: number, max: number): number => 
    Math.random() * (max - min) + min,
  
  // Clamp un valor entre min y max
  clamp: (value: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, value)),
  
  // Interpolación lineal
  lerp: (start: number, end: number, factor: number): number =>
    start + (end - start) * factor,
  
  // Distancia entre dos puntos
  distance: (x1: number, y1: number, x2: number, y2: number): number =>
    Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
  
  // Normalizar un valor de un rango a otro
  normalize: (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number => {
    const normalized = (value - fromMin) / (fromMax - fromMin);
    return toMin + normalized * (toMax - toMin);
  },
  
  // Redondear a n decimales
  roundTo: (value: number, decimals: number): number =>
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals),
};

// Utilidades de animación
export const animationUtils = {
  // Configuraciones de easing comunes
  easing: {
    easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeIn: (t: number): number => t * t,
    easeOut: (t: number): number => t * (2 - t),
    elastic: (t: number): number => Math.sin(-13 * (t + 1) * Math.PI / 2) * Math.pow(2, -10 * t) + 1,
    bounce: (t: number): number => {
      if (t < 1 / 2.75) return 7.5625 * t * t;
      if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    },
  },
  
  // Calcular duración basada en distancia
  calculateDuration: (distance: number, speed: number = 200): number =>
    Math.max(300, (distance / speed) * 1000),
  
  // Generar secuencia de animación con delays
  createSequence: (steps: number, totalDuration: number): number[] => {
    const stepDuration = totalDuration / steps;
    return Array.from({ length: steps }, (_, i) => i * stepDuration);
  },
};

// Utilidades de validación
export const validationUtils = {
  // Validar que un valor esté en un rango
  isInRange: (value: number, min: number, max: number): boolean =>
    value >= min && value <= max,
  
  // Validar coordenadas dentro de un área
  isInBounds: (x: number, y: number, width: number, height: number): boolean =>
    x >= 0 && x <= width && y >= 0 && y <= height,
  
  // Validar que un string no esté vacío
  isNotEmpty: (str: string): boolean =>
    typeof str === 'string' && str.trim().length > 0,
  
  // Validar formato de IP
  isValidIP: (ip: string): boolean => {
    const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  },
  
  // Validar que un número sea positivo
  isPositive: (num: number): boolean => typeof num === 'number' && num > 0,
};

// Utilidades de almacenamiento
export const storageUtils = {
  // Claves para AsyncStorage
  keys: {
    gameStats: '@pawplay_feeder:game_stats',
    userPreferences: '@pawplay_feeder:user_preferences',
    difficulty: '@pawplay_feeder:difficulty',
    hardwareConfig: '@pawplay_feeder:hardware_config',
  },
  
  // Crear clave única con timestamp
  createTimestampKey: (prefix: string): string => 
    `${prefix}:${Date.now()}`,
  
  // Verificar si una clave es válida
  isValidKey: (key: string): boolean =>
    typeof key === 'string' && key.startsWith('@pawplay_feeder:'),
};

// Utilidades de color
export const colorUtils = {
  // Convertir hex a rgba
  hexToRgba: (hex: string, alpha: number = 1): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  
  // Oscurecer un color hex
  darken: (hex: string, factor: number = 0.1): string => {
    const r = Math.floor(parseInt(hex.slice(1, 3), 16) * (1 - factor));
    const g = Math.floor(parseInt(hex.slice(3, 5), 16) * (1 - factor));
    const b = Math.floor(parseInt(hex.slice(5, 7), 16) * (1 - factor));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
  
  // Aclarar un color hex
  lighten: (hex: string, factor: number = 0.1): string => {
    const r = Math.min(255, Math.floor(parseInt(hex.slice(1, 3), 16) * (1 + factor)));
    const g = Math.min(255, Math.floor(parseInt(hex.slice(3, 5), 16) * (1 + factor)));
    const b = Math.min(255, Math.floor(parseInt(hex.slice(5, 7), 16) * (1 + factor)));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
};

// Utilidades de dispositivo
export const deviceUtils = {
  // Detectar si es tablet
  isTablet: (width: number, height: number): boolean => {
    const minDimension = Math.min(width, height);
    const maxDimension = Math.max(width, height);
    return minDimension >= 600 && maxDimension >= 800;
  },
  
  // Calcular factor de escala
  getScaleFactor: (width: number, height: number): number => {
    const baseWidth = 375; // iPhone X width
    const baseHeight = 812; // iPhone X height
    const scaleX = width / baseWidth;
    const scaleY = height / baseHeight;
    return Math.min(scaleX, scaleY);
  },
  
  // Obtener orientación como string
  getOrientationString: (width: number, height: number): 'portrait' | 'landscape' =>
    width > height ? 'landscape' : 'portrait',
};

// Utilidades de debug
export const debugUtils = {
  // Log condicional basado en modo debug
  log: (message: string, data?: any): void => {
    if (__DEV__) {
      console.log(`[Pawplay Feeder] ${message}`, data || '');
    }
  },
  
  // Warn condicional
  warn: (message: string, data?: any): void => {
    if (__DEV__) {
      console.warn(`[Pawplay Feeder] ${message}`, data || '');
    }
  },
  
  // Error siempre se muestra
  error: (message: string, error?: Error): void => {
    console.error(`[Pawplay Feeder] ${message}`, error || '');
  },
  
  // Medir tiempo de ejecución
  timeStart: (label: string): void => {
    if (__DEV__) {
      console.time(`[Pawplay Feeder] ${label}`);
    }
  },
  
  timeEnd: (label: string): void => {
    if (__DEV__) {
      console.timeEnd(`[Pawplay Feeder] ${label}`);
    }
  },
};