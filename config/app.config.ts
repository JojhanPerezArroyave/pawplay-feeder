/**
 * Configuración global de la aplicación Pawplay Feeder
 */

export const APP_CONFIG = {
  // Información de la app
  name: "Pawplay Feeder",
  version: "1.0.0",
  description: "Sistema Gamificado de Dispensación de Recompensas Para Estimular la Actividad Felina",
  
  // Configuraciones de juego
  game: {
    // Tiempo máximo de sesión (en segundos)
    maxSessionTime: 300, // 5 minutos
    
    // Puntuación
    scoring: {
      basePoints: 10,
      streakMultiplier: 1.5,
      difficultyMultiplier: {
        easy: 1,
        medium: 1.5,
        hard: 2,
      },
    },
    
    // Configuraciones por dificultad
    difficulty: {
      easy: {
        preySize: 140,
        movementSpeed: { min: 1000, max: 2000 },
        pauseTime: { min: 500, max: 1000 },
        description: "Ideal para gatos mayores o menos activos",
      },
      medium: {
        preySize: 120,
        movementSpeed: { min: 700, max: 1400 },
        pauseTime: { min: 200, max: 600 },
        description: "Equilibrio perfecto para la mayoría de gatos",
      },
      hard: {
        preySize: 100,
        movementSpeed: { min: 400, max: 1000 },
        pauseTime: { min: 100, max: 400 },
        description: "Desafío para gatos muy activos y jóvenes",
      },
    },
  },
  
  // Configuraciones de hardware (futuro)
  hardware: {
    // API del microcontrolador
    apiEndpoint: "http://192.168.1.100", // IP del ESP32/Arduino
    endpoints: {
      feed: "/feed",
      status: "/status",
      config: "/config",
    },
    
    // Configuración del dispensador
    feeder: {
      defaultPortion: 5, // gramos
      maxDailyPortions: 10,
      cooldownTime: 30, // segundos entre dispensaciones
    },
  },
  
  // Configuraciones de UI
  ui: {
    // Animaciones
    animations: {
      enabled: true,
      duration: {
        short: 200,
        medium: 500,
        long: 1000,
      },
    },
    
    // Sonidos (futuro)
    sounds: {
      enabled: true,
      catchSound: true,
      backgroundMusic: false,
      volume: 0.7,
    },
    
    // Accesibilidad
    accessibility: {
      highContrast: false,
      largeText: false,
      reduceMotion: false,
    },
  },
  
  // Configuraciones de datos
  data: {
    // Almacenamiento local
    storage: {
      saveStats: true,
      saveDifficulty: true,
      saveProgress: true,
    },
    
    // Sincronización (futuro)
    sync: {
      enabled: false,
      cloudBackup: false,
      shareStats: false,
    },
  },
  
  // Configuraciones de desarrollo
  development: {
    debugMode: __DEV__,
    showFPS: false,
    logLevel: __DEV__ ? 'debug' : 'error',
    mockHardware: true, // Simular hardware cuando no está conectado
  },
};

// Configuraciones específicas por plataforma
export const PLATFORM_CONFIG = {
  ios: {
    hapticFeedback: true,
    backgroundApp: true,
  },
  android: {
    hapticFeedback: true,
    immersiveMode: true,
    keepScreenOn: true,
  },
  web: {
    fullscreenAPI: true,
    keyboardControls: true,
  },
};

// Configuraciones de red
export const NETWORK_CONFIG = {
  timeout: 5000, // 5 segundos
  retryAttempts: 3,
  retryDelay: 1000, // 1 segundo
  
  // Headers por defecto
  defaultHeaders: {
    'Content-Type': 'application/json',
    'User-Agent': `${APP_CONFIG.name}/${APP_CONFIG.version}`,
  },
};

// Configuraciones de seguridad
export const SECURITY_CONFIG = {
  // Validación de entrada
  input: {
    maxNameLength: 50,
    allowedCharacters: /^[a-zA-Z0-9\s\-_\.]+$/,
  },
  
  // Rate limiting
  rateLimiting: {
    maxRequestsPerMinute: 60,
    maxFeedRequestsPerHour: 10,
  },
  
  // Validación de hardware
  hardware: {
    validateSSL: false, // Para desarrollo local
    allowSelfSigned: true,
    requiredFirmwareVersion: "1.0.0",
  },
};