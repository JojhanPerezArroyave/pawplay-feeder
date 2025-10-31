// Componente principal
export { default as Prey } from './Prey';

// Tipos
export type { MovementConfig, Position, PreyConfig, PreyProps, StageProps } from './types';

// Utilidades
export { PreyUtils } from './utils/PreyUtils';

// Animaciones
export { MovementPatterns } from './animations/MovementPatterns';
export { PreyAnimations } from './animations/PreyAnimations';

// Hooks
export { usePreyLogic } from './hooks/usePreyLogic';
