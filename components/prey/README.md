# Prey Component Architecture

Este documento describe la nueva arquitectura modular del componente `Prey` que fue refactorizado para seguir mejores prácticas de separación de responsabilidades.

## Estructura de archivos

```
components/prey/
├── index.ts                    # Barrel export - punto de entrada principal
├── types.ts                    # Definiciones de tipos e interfaces
├── Prey.tsx                    # Componente principal React
├── hooks/
│   └── usePreyLogic.ts        # Hook personalizado con toda la lógica
├── animations/
│   ├── MovementPatterns.ts    # Patrones de movimiento (directo, zigzag, circular)
│   └── PreyAnimations.ts      # Animaciones de efectos (rotación, captura)
└── utils/
    └── PreyUtils.ts           # Utilidades y funciones auxiliares
```

## Responsabilidades de cada módulo

### 1. `types.ts`
- Define todas las interfaces y tipos utilizados en el módulo
- `PreyProps`: Props del componente principal
- `Position`: Coordenadas x, y
- `MovementConfig`: Configuración de velocidad y tiempo
- `PreyConfig` y `StageProps`: Configuraciones adicionales

### 2. `utils/PreyUtils.ts`
- Funciones auxiliares reutilizables
- Generación de números aleatorios
- Cálculo de posiciones aleatorias
- Cálculo de límites de movimiento
- Obtención de posiciones centrales

### 3. `animations/MovementPatterns.ts`
- Patrones de movimiento de la presa
- Movimiento directo rápido
- Movimiento en zigzag
- Movimiento circular
- Selección aleatoria de patrones

### 4. `animations/PreyAnimations.ts`
- Animaciones de efectos visuales
- Animación de rotación continua
- Animación de captura (escala + opacidad)
- Reset de animaciones
- Interpolación de rotación

### 5. `hooks/usePreyLogic.ts`
- Hook personalizado que encapsula toda la lógica del componente
- Manejo de estados (visibilidad, animaciones)
- Ciclo de vida de animaciones
- Handlers de eventos
- Configuración basada en dificultad

### 6. `Prey.tsx`
- Componente React puro enfocado solo en renderizado
- Usa el hook `usePreyLogic` para obtener toda la funcionalidad
- Mínima lógica, máxima claridad

### 7. `index.ts`
- Barrel export que facilita las importaciones
- Exporta componente principal, tipos, utilidades y hooks
- Permite importar todo desde un solo punto

## Beneficios de esta arquitectura

### ✅ Separación de responsabilidades
- Cada archivo tiene una responsabilidad específica y bien definida
- Fácil localización de bugs y modificaciones

### ✅ Reutilización
- Utilidades y animaciones pueden reutilizarse en otros componentes
- Patrones de movimiento modulares y extensibles

### ✅ Testabilidad
- Cada módulo puede ser testeado independientemente
- Lógica separada del renderizado facilita unit tests

### ✅ Mantenibilidad
- Código más fácil de leer y entender
- Modificaciones localizadas sin afectar otras partes

### ✅ Escalabilidad
- Fácil agregar nuevos patrones de movimiento
- Fácil agregar nuevas animaciones
- Estructura preparada para crecimiento

## Cómo usar

### Importación simple
```tsx
import Prey from '../components/Prey';
// La importación funciona igual que antes
```

### Importación específica
```tsx
import { Prey, PreyUtils, MovementPatterns } from '../components/prey';
// Acceso a módulos específicos si es necesario
```

### Extensión
Para agregar un nuevo patrón de movimiento:
1. Crear la función en `MovementPatterns.ts`
2. Agregarlo al array de patrones en `getRandomPattern`

Para agregar una nueva animación:
1. Crear la función en `PreyAnimations.ts`
2. Usarla desde el hook `usePreyLogic`

## Migración

La refactorización es completamente retrocompatible:
- Los imports existentes siguen funcionando
- La API del componente no cambió
- Toda la funcionalidad se mantiene intacta

## Próximos pasos

Esta nueva arquitectura permite fácilmente:
- Agregar más patrones de movimiento complejos
- Implementar diferentes tipos de presas
- Crear efectos visuales más avanzados
- Optimizar performance por módulos específicos
- Implementar tests unitarios comprehensivos