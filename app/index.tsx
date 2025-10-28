import React, { useCallback } from "react";
import { Alert, SafeAreaView, View } from "react-native";
import { AppTitle } from "../components/AppTitle";
import { GameControls } from "../components/GameControls";
import { GameStage } from "../components/GameStage";
import Prey from "../components/Prey";
import { theme } from "../constants/theme";
import { useGameLogic } from "../hooks/useGameLogic";
import { useOrientation } from "../hooks/useOrientation";
import { HomeStyles } from "../styles/home";

export default function HomeScreen() {
  const { isLandscape } = useOrientation();
  const { 
    gameState, 
    gameStats, 
    handleCatch, 
    handleMiss, 
    resetGame, 
    setDifficulty 
  } = useGameLogic();

  const onCatch = useCallback(() => {
    handleCatch();
    console.log("🐭 ¡Presa cazada!");
    
    // Diferentes mensajes según la racha
    let message = "¡El gato cazó la presa! 🐾";
    if (gameStats.currentStreak >= 10) {
      message = "¡INCREÍBLE! ¡Racha de " + gameStats.currentStreak + "! 🔥🐱";
    } else if (gameStats.currentStreak >= 5) {
      message = "¡Excelente racha de " + gameStats.currentStreak + "! ✨🐾";
    }
    
    Alert.alert("¡Presa cazada!", message);
    // TODO: aquí luego llamaremos al microcontrolador (fetch a /feed)
  }, [handleCatch, gameStats.currentStreak]);

  const onMiss = useCallback(() => {
    handleMiss();
    console.log("❌ Presa escapó");
  }, [handleMiss]);

  const renderPortraitLayout = () => (
    <>
      {/* Título en la parte superior */}
      <View style={HomeStyles.topSection}>
        <AppTitle isLandscape={false} />
      </View>

      {/* Área de juego expandida */}
      <View style={HomeStyles.expandedGameSection}>
        <GameStage isLandscape={false}>
          <Prey 
            onCatch={onCatch}
            onMiss={onMiss}
            difficulty={gameState.difficulty}
            isPlaying={gameState.isPlaying}
          />
        </GameStage>
      </View>

      {/* Panel de controles y estadísticas en la parte inferior */}
      <View style={HomeStyles.bottomControlsSection}>
        <GameControls
          gameState={gameState}
          onDifficultyChange={setDifficulty}
          onReset={resetGame}
          isLandscape={false}
        />
      </View>
    </>
  );

  const renderLandscapeLayout = () => (
    <>
      {/* Título en la parte superior */}
      <View style={HomeStyles.topSectionLandscape}>
        <AppTitle isLandscape={true} />
      </View>

      {/* Área de juego expandida */}
      <View style={HomeStyles.expandedGameSectionLandscape}>
        <GameStage isLandscape={true}>
          <Prey 
            onCatch={onCatch}
            onMiss={onMiss}
            difficulty={gameState.difficulty}
            isPlaying={gameState.isPlaying}
          />
        </GameStage>
      </View>

      {/* Panel de controles en la parte inferior */}
      <View style={HomeStyles.bottomControlsSectionLandscape}>
        <GameControls
          gameState={gameState}
          onDifficultyChange={setDifficulty}
          onReset={resetGame}
          isLandscape={true}
        />
      </View>
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <View style={[
        HomeStyles.container,
        isLandscape && HomeStyles.containerLandscape
      ]}>
        {isLandscape ? renderLandscapeLayout() : renderPortraitLayout()}
      </View>
    </SafeAreaView>
  );
}
