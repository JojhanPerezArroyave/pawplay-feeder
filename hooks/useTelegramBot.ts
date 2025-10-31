import { useCallback, useEffect, useMemo, useState } from 'react';

interface GameData {
  difficulty: 'easy' | 'medium' | 'hard';
  game_active: boolean;
  current_player: string | null;
  session_stats: {
    catches: number;
    misses: number;
    start_time: string | null;
  };
}

interface TelegramIntegration {
  gameData: GameData | null;
  isLoading: boolean;
  error: string | null;
  registerCatch: () => Promise<void>;
  registerMiss: () => Promise<void>;
  refreshData: () => Promise<void>;
}

// URL del servidor HTTP del bot
const BOT_SERVER_URL = 'http://192.168.20.76:8765';

export function useTelegramBot(): TelegramIntegration {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos por defecto - memoizados para evitar cambios en dependencias
  const defaultGameData: GameData = useMemo(() => ({
    difficulty: 'medium',
    game_active: false,
    current_player: null,
    session_stats: {
      catches: 0,
      misses: 0,
      start_time: null,
    },
  }), []);

  // Cargar datos desde el servidor HTTP del bot
  const loadGameData = useCallback(async (): Promise<GameData> => {
    try {
      const response = await fetch(`${BOT_SERVER_URL}/game-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data as GameData;
    } catch {
      console.log('Bot not available, using default data');
      return defaultGameData;
    }
  }, [defaultGameData]);

  // Refrescar datos desde el servidor
  const refreshData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await loadGameData();
      setGameData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [loadGameData]);

  // Registrar acierto
  const registerCatch = useCallback(async (): Promise<void> => {
    if (!gameData?.game_active) return;

    try {
      await fetch(`${BOT_SERVER_URL}/register-catch`, {
        method: 'GET',
      });
      
      // Actualizar datos locales inmediatamente
      setGameData(prev => prev ? {
        ...prev,
        session_stats: {
          ...prev.session_stats,
          catches: prev.session_stats.catches + 1,
        },
      } : null);
    } catch (err) {
      console.error('Error registering catch:', err);
    }
  }, [gameData]);

  // Registrar fallo
  const registerMiss = useCallback(async (): Promise<void> => {
    if (!gameData?.game_active) return;

    try {
      await fetch(`${BOT_SERVER_URL}/register-miss`, {
        method: 'GET',
      });
      
      // Actualizar datos locales inmediatamente
      setGameData(prev => prev ? {
        ...prev,
        session_stats: {
          ...prev.session_stats,
          misses: prev.session_stats.misses + 1,
        },
      } : null);
    } catch (err) {
      console.error('Error registering miss:', err);
    }
  }, [gameData]);

  // Cargar datos iniciales
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Polling para mantener datos actualizados (cada 3 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 3000);

    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    gameData,
    isLoading,
    error,
    registerCatch,
    registerMiss,
    refreshData,
  };
}

// Hook simplificado para obtener solo la configuración de dificultad
export function useDifficulty() {
  const { gameData } = useTelegramBot();
  
  return {
    difficulty: gameData?.difficulty || 'medium',
    isGameActive: gameData?.game_active || false,
  };
}

// Utilidades para mapear dificultad a configuraciones del juego
export const getDifficultyConfig = (difficulty: 'easy' | 'medium' | 'hard') => {
  const configs = {
    easy: {
      speed: 0.5,        // Velocidad lenta
      pauseTime: 3000,   // Pausas largas (3 segundos)
      spawnRate: 0.7,    // Menos frecuente
    },
    medium: {
      speed: 1.0,        // Velocidad normal
      pauseTime: 2000,   // Pausas normales (2 segundos)
      spawnRate: 1.0,    // Frecuencia normal
    },
    hard: {
      speed: 1.5,        // Velocidad rápida
      pauseTime: 1000,   // Pausas cortas (1 segundo)
      spawnRate: 1.3,    // Más frecuente
    },
  };

  return configs[difficulty] || configs.medium;
};