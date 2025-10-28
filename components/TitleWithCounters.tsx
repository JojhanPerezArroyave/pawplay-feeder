import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';
import { AppTitle } from './AppTitle';
import { GameCounters } from './GameCounters';

interface Props {
  isLandscape: boolean;
  sessionTime: number;
  totalHits: number;
}

export const TitleWithCounters: React.FC<Props> = ({ isLandscape, sessionTime, totalHits }) => {
  if (isLandscape) {
    // En horizontal: tiempo - título - toques en una fila
    return (
      <View style={styles.horizontalContainer}>
        <View style={styles.leftCounter}>
          <GameCounters 
            sessionTime={sessionTime} 
            totalHits={totalHits} 
            isLandscape={false} // Usar layout vertical para cada contador individual
            showTime={true}
            showHits={false}
          />
        </View>
        <View style={styles.centerTitle}>
          <AppTitle isLandscape={true} />
        </View>
        <View style={styles.rightCounter}>
          <GameCounters 
            sessionTime={sessionTime} 
            totalHits={totalHits} 
            isLandscape={false} // Usar layout vertical para cada contador individual
            showTime={false}
            showHits={true}
          />
        </View>
      </View>
    );
  } else {
    // En vertical: contadores arriba, título abajo
    return (
      <View style={styles.verticalContainer}>
        <View style={styles.countersRow}>
          <GameCounters 
            sessionTime={sessionTime} 
            totalHits={totalHits} 
            isLandscape={true} // Usar layout horizontal para mostrar ambos
          />
        </View>
        <View style={styles.titleRow}>
          <AppTitle isLandscape={false} />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
  },
  verticalContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftCounter: {
    flex: 0.25,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerTitle: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightCounter: {
    flex: 0.25,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  countersRow: {
    width: '100%',
    marginBottom: theme.spacing.xs,
  },
  titleRow: {
    width: '100%',
    alignItems: 'center',
  },
});