# Integración Telegram Bot - PawPlay Feeder

## 📋 Resumen del Sistema

Se ha implementado un sistema completo de control remoto para el juego PawPlay Feeder mediante un bot de Telegram. El sistema permite:

### 🎮 Control del Juego
- **Selección de Dificultad**: Easy 🟢, Medium 🟡, Hard 🔴
- **Control de Sesiones**: Iniciar/pausar juegos remotamente
- **Monitoreo en Tiempo Real**: Estadísticas y puntuaciones

### 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────────┐
│   Telegram Bot  │◄──►│   JSON Storage   │◄──►│   React Native App │
│                 │    │                  │    │                    │
│ • Comandos      │    │ • game_data.json │    │ • Visualización    │
│ • Estadísticas  │    │ • game_stats.json│    │ • Interacción      │
│ • Configuración │    │                  │    │ • Efectos          │
└─────────────────┘    └──────────────────┘    └────────────────────┘
```

## 📁 Estructura de Archivos

### Bot de Telegram (`telegram-bot/`)
```
telegram-bot/
├── pawplay_bot.py          # Bot principal
├── requirements.txt        # Dependencias Python
├── test_integration.py     # Script de pruebas
├── setup.sh               # Configuración automática (Linux/Mac)
├── setup.bat              # Configuración automática (Windows)
├── README.md              # Documentación del bot
└── config_example.json    # Configuración de ejemplo
```

### App React Native
```
hooks/
├── useTelegramBot.ts      # Hook de integración
└── useGameLogic.ts        # Lógica del juego actualizada

components/
├── TelegramStatus.tsx     # Indicador de estado
└── GameControls.tsx       # Controles actualizados
```

## 🔧 Configuración e Instalación

### 1. Crear Bot de Telegram
```bash
# 1. Buscar @BotFather en Telegram
# 2. Enviar /newbot
# 3. Seguir instrucciones
# 4. Guardar token
```

### 2. Configurar Bot (Automático)
```bash
cd telegram-bot
./setup.sh      # Linux/Mac
setup.bat       # Windows
```

### 3. Configurar Bot (Manual)
```bash
cd telegram-bot
pip install -r requirements.txt
# Editar pawplay_bot.py y reemplazar "TU_TOKEN_AQUI"
```

### 4. Ejecutar Bot
```bash
python pawplay_bot.py
```

## 🎮 Comandos del Bot

### Control del Juego
- `/iniciar` - Iniciar nueva partida
- `/parar` - Pausar partida actual
- `/facil` - Cambiar a dificultad fácil
- `/medio` - Cambiar a dificultad media
- `/dificil` - Cambiar a dificultad difícil

### Información
- `/start` - Inicializar bot
- `/menu` - Mostrar menú principal
- `/estado` - Ver estado del sistema
- `/puntuacion` - Puntuación actual
- `/estadisticas` - Estadísticas generales
- `/ayuda` - Ayuda completa

## 🔄 Flujo de Integración

### 1. Configuración de Dificultad
```
Usuario (Telegram) → Bot → JSON Storage → App (React Native)
```

### 2. Control de Sesiones
```
/iniciar → Bot activa juego → App lee estado → Juego comienza
```

### 3. Registro de Eventos
```
Usuario toca gato → App registra → JSON Storage → Bot actualiza estadísticas
```

### 4. Monitoreo
```
/puntuacion → Bot lee JSON → Muestra estadísticas en tiempo real
```

## 📊 Configuraciones de Dificultad

### 🟢 Fácil (Easy)
- **Velocidad**: 0.5x (lenta)
- **Pausas**: 3000ms (largas)
- **Frecuencia**: 0.7x (menos frecuente)

### 🟡 Medio (Medium)
- **Velocidad**: 1.0x (normal)
- **Pausas**: 2000ms (normales)
- **Frecuencia**: 1.0x (normal)

### 🔴 Difícil (Hard)
- **Velocidad**: 1.5x (rápida)
- **Pausas**: 1000ms (cortas)
- **Frecuencia**: 1.3x (más frecuente)

## 💾 Almacenamiento de Datos

### game_data.json
```json
{
  "difficulty": "medium",
  "game_active": false,
  "current_player": null,
  "session_stats": {
    "catches": 0,
    "misses": 0,
    "start_time": null
  }
}
```

### game_stats.json
```json
{
  "total_games": 0,
  "total_catches": 0,
  "total_misses": 0,
  "best_scores": {
    "easy": 0,
    "medium": 0,
    "hard": 0
  },
  "last_played": null
}
```

## 🎯 Funcionalidades del Hook useTelegramBot

### Conexión y Sincronización
```typescript
const { gameData, isLoading, error } = useTelegramBot();
```

### Registro de Eventos
```typescript
await registerCatch();  // Acierto
await registerMiss();   // Fallo
```

### Configuración Dinámica
```typescript
const config = getDifficultyConfig(difficulty);
// Returns: { speed, pauseTime, spawnRate }
```

## 🎨 Componente TelegramStatus

### Estados Visuales
- **🟢 Conectado y Activo**: Juego en progreso
- **🔴 Conectado pero Pausado**: Bot conectado, juego pausado
- **📱 Desconectado**: Bot no inicializado
- **❌ Error**: Problemas de conexión

### Información Mostrada
- Estado de conexión
- Dificultad actual
- Jugador activo
- Estadísticas de sesión

## 🔧 API del Bot para Integración

### Métodos Públicos
```python
# Verificar estado
bot.is_game_active()
bot.get_current_difficulty()

# Registrar eventos (llamados desde la app)
bot.register_catch()
bot.register_miss()
```

## 🚀 Flujo de Uso Completo

### Setup Inicial
1. Usuario configura bot con BotFather
2. Ejecuta script de configuración
3. Inicia bot de Python
4. Abre app React Native

### Gameplay
1. Usuario configura dificultad en Telegram (`/medio`)
2. Usuario inicia partida (`/iniciar`)
3. App detecta configuración automáticamente
4. Juego comienza con configuración del bot
5. Toques se registran en tiempo real
6. Usuario monitorea progreso (`/puntuacion`)
7. Usuario pausa cuando termina (`/parar`)

### Beneficios
- **Control Remoto**: No necesidad de tocar controles en la app
- **Monitoreo**: Estadísticas en tiempo real vía Telegram
- **Flexibilidad**: Cambiar configuración sin interrumpir el juego
- **Registro**: Historial completo de partidas y estadísticas

## 👥 Desarrolladores
- **Santiago Escobar**
- **Jojhan Perez Arroyave**

**Universidad de Caldas**  
*Automatización y Control de Procesos*