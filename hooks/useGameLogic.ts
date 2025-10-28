import { useCallback, useEffect, useRef, useState } from 'react';
import { GameState, GameStats } from '../types';

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

  // Actualizar tiempo de sesión cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setGameStats(prev => ({
        ...prev,
        sessionTime: Math.floor((Date.now() - sessionStartTime.current) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
  }, [calculateLevel, calculateScore, calculateAccuracy]);

  const handleMiss = useCallback(() => {
    missedAttempts.current += 1;
    setGameStats(prev => ({
      ...prev,
      currentStreak: 0,
      accuracy: calculateAccuracy(prev.totalHits, missedAttempts.current),
    }));
  }, [calculateAccuracy]);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
    setGameStats(initialStats);
    missedAttempts.current = 0;
    sessionStartTime.current = Date.now();
  }, []);

  const setDifficulty = useCallback((difficulty: GameState['difficulty']) => {
    setGameState(prev => ({ ...prev, difficulty }));
  }, []);

  return {
    gameState,
    gameStats,
    handleCatch,
    handleMiss,
    resetGame,
    setDifficulty,
  };
};