import { StyleSheet } from "react-native";
import { theme } from "../constants/theme";

export const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md, // Más espacio vertical
  },
  
  containerLandscape: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "stretch", 
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm, // Más espacio vertical
    height: "100%", 
  },

  // Nuevas secciones para layout reorganizado
  topSection: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    maxHeight: 120, // Más espacio para contadores + título
    minHeight: 80,
    flexShrink: 0, // No permitir compresión
  },

  topSectionLandscape: {
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
    maxHeight: 80, // Más espacio para la fila horizontal
    minHeight: 60,
    flexShrink: 0, // No permitir compresión
  },

  gameSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: theme.spacing.md,
  },

  // Nueva sección de juego expandida
  expandedGameSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    width: "100%",
    maxHeight: "60%", // Reducido para dar espacio al header
    minHeight: 250,
  },

  expandedGameSectionLandscape: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xs,
    width: "100%",
    maxHeight: "65%", // Reducido para dar espacio al header
    minHeight: 180,
  },

  // Nueva sección de controles en la parte inferior
  bottomControlsSection: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary + '50',
    borderTopWidth: 2,
    borderTopColor: theme.colors.accent.primary + '30',
    maxHeight: "20%", // Más espacio para controles
    minHeight: 60, // Mínimo garantizado
    flexShrink: 0, // No permitir compresión
  },

  bottomControlsSectionLandscape: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.sm, // Más espacio
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary + '50',
    borderTopWidth: 2,
    borderTopColor: theme.colors.accent.primary + '30',
    maxHeight: "25%", // Más espacio en horizontal
    minHeight: 50, // Mínimo garantizado
    flexShrink: 0, // No permitir compresión
  },

  leftPanelBottom: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: theme.spacing.sm, // Reducido
    maxHeight: 100, // Límite de altura
  },

  rightPanelBottom: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: theme.spacing.sm, // Reducido
    maxHeight: 100, // Límite de altura
  },

  contentLandscape: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingHorizontal: theme.spacing.sm,
  },

  bottomSection: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },

  bottomSectionLandscape: {
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
  
  // Sección izquierda en landscape
  leftPanel: {
    flex: 0.3, // Ajustado para el nuevo layout
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
  },
  
  // Sección central (área de juego)
  centerPanel: {
    flex: 0.4, // Ajustado para el nuevo layout
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm,
  },
  
  // Sección derecha en landscape
  rightPanel: {
    flex: 0.3, // Ajustado para el nuevo layout
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
  },
  
  title: {
    fontSize: theme.typography.sizes['4xl'],
    fontWeight: theme.typography.weights.extrabold,
    marginBottom: theme.spacing.xl,
    color: theme.colors.text.primary,
    textAlign: "center",
    letterSpacing: 2,
    // Gradiente simulado con sombras múltiples
    textShadowColor: theme.colors.accent.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    // Efecto neón adicional
    elevation: 8,
    // Padding para el efecto visual
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    // Fondo sutil
    backgroundColor: theme.colors.overlay.light,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.accent.primary + '30', // 30% opacity
    // Sombra del contenedor
    shadowColor: theme.colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  titleLandscape: {
    fontSize: theme.typography.sizes.xl, // Más pequeño para horizontal
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    // Mantener efectos pero más compactos
    textShadowRadius: 6,
    shadowRadius: 4,
    letterSpacing: 1,
  },
  
  stage: {
    width: "100%",
    height: "60%",
    backgroundColor: theme.colors.game.stage,
    borderWidth: 4,
    borderColor: theme.colors.game.stageBorder,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    position: "relative",
    ...theme.shadows.xl,
  },
  
  stageLandscape: {
    width: "95%", // Reducido para evitar overflow
    height: "80%", // Reducido para evitar solapamiento
    borderRadius: theme.radius.lg, // Más pequeño
    maxHeight: 400, // Límite máximo
    minHeight: 200, // Límite mínimo
  },
  
  // Decoraciones del stage
  stageGlow: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: theme.colors.game.stageBorder,
    borderRadius: theme.radius.xl,
    opacity: 0.3,
    zIndex: -1,
  },
  
  // Grid de fondo para el stage (opcional)
  stageGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  
  prey: {
    position: "absolute",
    zIndex: 10,
  },
  
  // Stats container
  statsContainer: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.accent.primary,
    ...theme.shadows.md,
    minWidth: 200,
  },
  
  statsContainerLandscape: {
    marginTop: 0,
    minWidth: 120, // Reducido
    maxWidth: 140, // Añadido límite
    padding: theme.spacing.sm, // Reducido
    width: "100%", // Ocupar todo el ancho disponible
  },
  
  counter: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.accent,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    textShadowColor: theme.colors.overlay.dark,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  counterLandscape: {
    fontSize: theme.typography.sizes.lg,
    marginBottom: theme.spacing.xs,
  },
  
  score: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  
  scoreLandscape: {
    fontSize: theme.typography.sizes.base,
  },
  
  level: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.accent.secondary,
    textAlign: "center",
  },
  
  levelLandscape: {
    fontSize: theme.typography.sizes.sm,
  },
  
  // Efectos visuales adicionales
  particleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 5,
  },
  
  // Botones de control
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  
  controlButton: {
    backgroundColor: theme.colors.accent.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    ...theme.shadows.md,
  },
  
  controlButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
  },
  
  // Indicadores de estado
  difficultyIndicator: {
    backgroundColor: theme.colors.overlay.medium,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.accent.primary,
    ...theme.shadows.md,
  },
  
  difficultyText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.bold,
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 1,
  },
});
