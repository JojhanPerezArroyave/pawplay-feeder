import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  sessionTime: number;
  totalHits: number;
  isLandscape: boolean;
  showTime?: boolean;
  showHits?: boolean;
}

export const GameCounters: React.FC<Props> = ({ 
  sessionTime, 
  totalHits, 
  isLandscape, 
  showTime = true, 
  showHits = true 
}) => {
  // Formatear tiempo en mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: isLandscape ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: isLandscape ? 'space-between' : 'center',
      width: '100%',
      paddingHorizontal: isLandscape ? theme.spacing.lg : 0,
      marginBottom: isLandscape ? 0 : theme.spacing.sm,
    },
    counter: {
      alignItems: 'center',
      minWidth: isLandscape ? 80 : undefined,
    },
    spacer: {
      flex: 1,
    },
    label: {
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    value: {
      fontSize: isLandscape ? theme.typography.sizes.lg : theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text.accent,
      textShadowColor: theme.colors.accent.primary,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: isLandscape ? 4 : 6,
    },
  });

  return (
    <View style={styles.container}>
      {/* Contador de tiempo - solo mostrar si showTime es true */}
      {showTime && (
        <View style={styles.counter}>
          <Text style={styles.label}>Tiempo</Text>
          <Text style={styles.value}>{formatTime(sessionTime)}</Text>
        </View>
      )}

      {/* Espacio para el título en horizontal - solo si ambos contadores están presentes */}
      {isLandscape && showTime && showHits && <View style={styles.spacer} />}

      {/* Contador de toques - solo mostrar si showHits es true */}
      {showHits && (
        <View style={styles.counter}>
          <Text style={styles.label}>Toques</Text>
          <Text style={styles.value}>{totalHits}</Text>
        </View>
      )}
    </View>
  );
};