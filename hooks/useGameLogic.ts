import { useCallback, useEffect, useRef, useState } from 'react';
import { GameState, GameStats } from '../types';
import { getDifficultyConfig, useTelegramBot } from './useTelegramBot';

const initialGameState: GameState = {
  hits: 0,
  level: 1,
  score: 0,
  isPlaying: true,
  difficulty: 'medium',
};

const initialStats: GameStats = {
  totalHits: 0,
  sessionTime: 0,
  accuracy: 0,
  bestStreak: 0,
  currentStreak: 0,
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [gameStats, setGameStats] = useState<GameStats>(initialStats);
  const sessionStartTime = useRef<number>(Date.now());
  const missedAttempts = useRef<number>(0);

  // Integración con Telegram Bot
  const { gameData, registerCatch, registerMiss } = useTelegramBot();

  // Sincronizar configuración del bot con el estado del juego
  useEffect(() => {
    if (gameData) {
      setGameState(prev => ({
        ...prev,
        difficulty: gameData.difficulty,
        isPlaying: gameData.game_active,
      }));
    }
  }, [gameData]);

  // Actualizar tiempo de sesión cada segundo
  useEffect(() => {
    if (!gameState.isPlaying) return;

    const interval = setInterval(() => {
      setGameStats(prev => ({
        ...prev,
        sessionTime: Math.floor((Date.now() - sessionStartTime.current) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.isPlaying]);

  const calculateScore = useCallback((hits: number, level: number) => {
    return hits * 10 * level;
  }, []);

  const calculateLevel = useCallback((hits: number) => {
    return Math.floor(hits / 5) + 1; // Nivel sube cada 5 hits
  }, []);

  const calculateAccuracy = useCallback((hits: number, misses: number) => {
    const total = hits + misses;
    return total > 0 ? Math.round((hits / total) * 100) : 0;
  }, []);

  const handleCatch = useCallback(() => {
    // Solo procesar si el juego está activo
    if (!gameState.isPlaying) return;

    setGameState(prev => {
      const newHits = prev.hits + 1;
      const newLevel = calculateLevel(newHits);
      const newScore = calculateScore(newHits, newLevel);
      
      return {
        ...prev,
        hits: newHits,
        level: newLevel,
        score: newScore,
      };
    });

    setGameStats(prev => {
      const newCurrentStreak = prev.currentStreak + 1;
      const newBestStreak = Math.max(prev.bestStreak, newCurrentStreak);
      const newTotalHits = prev.totalHits + 1;
      const newAccuracy = calculateAccuracy(newTotalHits, missedAttempts.current);
      
      return {
        ...prev,
        totalHits: newTotalHits,
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
        accuracy: newAccuracy,
      };
    });

    // Registrar acierto en el bot de Telegram
    registerCatch();
  }, [gameState.isPlaying, calculateLevel, calculateScore, calculateAccuracy, registerCatch]);

  const handleMiss = useCallback(() => {
    // Solo procesar si el juego está activo
    if (!gameState.isPlaying) return;

    missedAttempts.current += 1;
    setGameStats(prev => ({
      ...prev,
      currentStreak: 0,
      accuracy: calculateAccuracy(prev.totalHits, missedAttempts.current),
    }));

    // Registrar fallo en el bot de Telegram
    registerMiss();
  }, [gameState.isPlaying, calculateAccuracy, registerMiss]);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
    setGameStats(initialStats);
    missedAttempts.current = 0;
    sessionStartTime.current = Date.now();
  }, []);

  const setDifficulty = useCallback((difficulty: GameState['difficulty']) => {
    setGameState(prev => ({ ...prev, difficulty }));
  }, []);

  // Obtener configuración de dificultad para el comportamiento del juego
  const difficultyConfig = getDifficultyConfig(gameState.difficulty);

  return {
    gameState,
    gameStats,
    handleCatch,
    handleMiss,
    resetGame,
    setDifficulty,
    difficultyConfig, // Exportar configuración para que otros componentes la usen
    telegramBot: {
      isConnected: !!gameData,
      currentPlayer: gameData?.current_player,
      telegramStats: gameData?.session_stats,
    },
  };
};