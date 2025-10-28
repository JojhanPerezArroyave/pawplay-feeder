import React from 'react';
import { Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { HomeStyles } from '../styles/home';
import { GameStats } from '../types';

interface Props {
  stats: GameStats;
  isLandscape: boolean;
}

export const StatsPanel: React.FC<Props> = ({ stats, isLandscape }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[
      HomeStyles.statsContainer,
      isLandscape && HomeStyles.statsContainerLandscape
    ]}>
      <Text style={[
        HomeStyles.counter,
        isLandscape && HomeStyles.counterLandscape
      ]}>
        {stats.totalHits}
      </Text>
      
      <Text style={[
        HomeStyles.score,
        isLandscape && HomeStyles.scoreLandscape
      ]}>
        Precisión: {stats.accuracy}%
      </Text>
      
      <Text style={[
        HomeStyles.level,
        isLandscape && HomeStyles.levelLandscape
      ]}>
        Racha: {stats.currentStreak}
      </Text>
      
      <Text style={[
        HomeStyles.level,
        isLandscape && HomeStyles.levelLandscape,
        { color: theme.colors.text.tertiary, fontSize: theme.typography.sizes.sm }
      ]}>
        Tiempo: {formatTime(stats.sessionTime)}
      </Text>
    </View>
  );
};