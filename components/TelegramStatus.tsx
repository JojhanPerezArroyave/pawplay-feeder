import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTelegramBot } from '../hooks/useTelegramBot';

interface TelegramStatusProps {
  position?: 'top' | 'bottom';
}

export function TelegramStatus({ position = 'top' }: TelegramStatusProps) {
  const { gameData, isLoading, error } = useTelegramBot();

  if (isLoading) {
    return (
      <View style={[styles.container, styles[position]]}>
        <Text style={styles.statusText}>🔄 Conectando con Telegram...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles[position], styles.error]}>
        <Text style={styles.statusText}>❌ Error: {error}</Text>
      </View>
    );
  }

  if (!gameData) {
    return (
      <View style={[styles.container, styles[position], styles.disconnected]}>
        <Text style={styles.statusText}>📱 Inicia el bot de Telegram</Text>
      </View>
    );
  }

  const isActive = gameData.game_active;
  const difficulty = gameData.difficulty;
  const player = gameData.current_player;
  const stats = gameData.session_stats;

  const getDifficultyEmoji = (diff: string) => {
    const emojis = { easy: '🟢', medium: '🟡', hard: '🔴' };
    return emojis[diff as keyof typeof emojis] || '🟡';
  };

  return (
    <View style={[styles.container, styles[position], isActive ? styles.active : styles.inactive]}>
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>
          🤖 Telegram: {isActive ? '🟢 ACTIVO' : '🔴 PAUSADO'}
        </Text>
        <Text style={styles.difficultyText}>
          {getDifficultyEmoji(difficulty)} {difficulty.toUpperCase()}
        </Text>
      </View>
      
      {isActive && (
        <View style={styles.gameInfo}>
          {player && (
            <Text style={styles.playerText}>👤 {player}</Text>
          )}
          <Text style={styles.statsText}>
            🎯 {stats.catches} | ❌ {stats.misses}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    zIndex: 1000,
  },
  top: {
    top: 50,
  },
  bottom: {
    bottom: 50,
  },
  active: {
    backgroundColor: 'rgba(34, 197, 94, 0.9)', // green-500 with opacity
  },
  inactive: {
    backgroundColor: 'rgba(156, 163, 175, 0.9)', // gray-400 with opacity
  },
  disconnected: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)', // red-500 with opacity
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)', // red-500 with opacity
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  playerText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  statsText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
});