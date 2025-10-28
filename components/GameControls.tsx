import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../constants/theme';
import { HomeStyles } from '../styles/home';
import { GameState } from '../types';

interface Props {
  gameState: GameState;
  onDifficultyChange: (difficulty: GameState['difficulty']) => void;
  onReset: () => void;
  isLandscape: boolean;
}

export const GameControls: React.FC<Props> = ({ 
  gameState, 
  onDifficultyChange, 
  onReset, 
  isLandscape 
}) => {
  const difficulties: GameState['difficulty'][] = ['easy', 'medium', 'hard'];
  
  const getDifficultyColor = (difficulty: GameState['difficulty']) => {
    switch (difficulty) {
      case 'easy': return theme.colors.accent.success;
      case 'medium': return theme.colors.accent.warning;
      case 'hard': return theme.colors.accent.danger;
      default: return theme.colors.accent.primary;
    }
  };
  
  const getDifficultyLabel = (difficulty: GameState['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Medio';
      case 'hard': return 'Difícil';
      default: return 'Medio';
    }
  };

  if (isLandscape) {
    return (
      <View style={{ alignItems: 'center', width: '100%' }}>
        {/* Controles horizontales */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center',
          gap: theme.spacing.sm,
          width: '100%'
        }}>
          {difficulties.map((diff) => (
            <TouchableOpacity
              key={diff}
              style={[
                {
                  backgroundColor: gameState.difficulty === diff 
                    ? getDifficultyColor(diff) 
                    : theme.colors.background.tertiary,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.radius.md,
                  flex: 1,
                  maxWidth: 80,
                }
              ]}
              onPress={() => onDifficultyChange(diff)}
            >
              <Text style={[
                {
                  color: gameState.difficulty === diff 
                    ? theme.colors.text.primary 
                    : theme.colors.text.tertiary,
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.medium,
                  textAlign: 'center',
                }
              ]}>
                {getDifficultyLabel(diff)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      {/* Selector de dificultad centrado */}
      <Text style={{
        color: theme.colors.text.secondary,
        fontSize: theme.typography.sizes.sm,
        marginBottom: theme.spacing.sm,
        fontWeight: theme.typography.weights.medium,
      }}>
        Dificultad
      </Text>
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        {difficulties.map((diff) => (
          <TouchableOpacity
            key={diff}
            style={[
              HomeStyles.controlButton,
              {
                backgroundColor: gameState.difficulty === diff 
                  ? getDifficultyColor(diff) 
                  : theme.colors.background.tertiary,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
              }
            ]}
            onPress={() => onDifficultyChange(diff)}
          >
            <Text style={[
              HomeStyles.controlButtonText,
              {
                color: gameState.difficulty === diff 
                  ? theme.colors.text.primary 
                  : theme.colors.text.tertiary,
                fontSize: theme.typography.sizes.sm,
              }
            ]}>
              {getDifficultyLabel(diff)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};