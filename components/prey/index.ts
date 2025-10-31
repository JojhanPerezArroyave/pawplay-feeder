// Componente principal
export { default as Prey } from './Prey';

// Tipos
export type { MovementConfig, Position, PreyConfig, PreyProps, StageProps } from './types';

// Utilidades
export { PreyUtils } from './utils/PreyUtils';

// Animaciones
export { ExplosionEffect } from './animations/ExplosionEffect';
export { FlashEffect } from './animations/FlashEffect';
export { MovementPatterns } from './animations/MovementPatterns';
export { PreyAnimations } from './animations/PreyAnimations';
export { TrailEffect } from './animations/TrailEffect';

// Hooks
export { useExplosions } from './hooks/useExplosions';
export { usePreyLogic } from './hooks/usePreyLogic';

