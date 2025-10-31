# PawPlay Feeder - Telegram Bot Control

## 🎮 Descripción
Sistema de control remoto para el juego PawPlay Feeder mediante bot de Telegram. Permite controlar la dificultad del juego, iniciar/pausar partidas y monitorear estadísticas en tiempo real.

## 🔧 Instalación

### 1. Crear un Bot de Telegram
1. Busca @BotFather en Telegram
2. Envía `/newbot`
3. Sigue las instrucciones para crear tu bot
4. Guarda el **token** que te proporcione

### 2. Instalar dependencias
```bash
cd telegram-bot
pip install -r requirements.txt
```

### 3. Configurar el bot
1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Edita el archivo `.env` y reemplaza `tu_token_de_bot_father_aqui` con tu token real:
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
HTTP_PORT=8765
```

**⚠️ IMPORTANTE: Nunca subas el archivo `.env` a GitHub. El token es información sensible.**

### 4. Ejecutar el bot
```bash
python pawplay_bot.py
```

## 📱 Comandos del Bot

### 🎯 Control del Juego
- `/iniciar` - Iniciar una nueva partida
- `/parar` - Pausar la partida actual
- `/facil` - Cambiar a dificultad fácil 🟢
- `/medio` - Cambiar a dificultad media 🟡
- `/dificil` - Cambiar a dificultad difícil 🔴

### 📊 Información
- `/menu` - Mostrar menú principal
- `/estado` - Ver estado actual del sistema
- `/puntuacion` - Ver puntuación de la sesión actual
- `/estadisticas` - Ver estadísticas generales
- `/ayuda` - Ayuda completa

## 🔄 Integración con la App

El bot maneja 3 niveles de dificultad que afectan la velocidad del juego:

### 🟢 Fácil (easy)
- Velocidad lenta del gato
- Pausas largas entre movimientos
- Ideal para principiantes

### 🟡 Medio (medium)
- Velocidad normal
- Pausas moderadas
- Configuración equilibrada

### 🔴 Difícil (hard)
- Velocidad rápida
- Pausas cortas
- Desafío máximo

## 📊 Sistema de Estadísticas

El bot registra automáticamente:
- ✅ **Aciertos**: Cuando tocas al gato correctamente
- ❌ **Fallos**: Cuando tocas fuera del gato
- 📈 **Precisión**: Porcentaje de aciertos
- 🏆 **Récords**: Mejor puntuación por dificultad
- ⏰ **Tiempo de juego**: Duración de cada sesión

## 📁 Archivos de Datos

El bot genera automáticamente:
- `game_data.json` - Estado actual del juego
- `game_stats.json` - Estadísticas históricas

## 🔌 API para Integración

Para conectar con la app React Native, el bot expone estos métodos:

```python
# Verificar si el juego está activo
bot.is_game_active()

# Obtener dificultad actual
bot.get_current_difficulty()  # Returns: 'easy', 'medium', 'hard'

# Registrar acierto
bot.register_catch()

# Registrar fallo
bot.register_miss()
```

## 🎮 Flujo de Uso

1. **Configuración inicial:**
   - Usuario configura dificultad con `/facil`, `/medio` o `/dificil`
   
2. **Inicio de partida:**
   - Usuario envía `/iniciar` en Telegram
   - Bot activa el juego y resetea contadores
   
3. **Gameplay:**
   - Usuario abre la app móvil
   - La app lee la configuración del bot
   - Los toques se registran automáticamente
   
4. **Monitoreo:**
   - Usuario puede usar `/puntuacion` para ver progreso
   - Bot actualiza estadísticas en tiempo real
   
5. **Finalización:**
   - Usuario envía `/parar` o simplemente cierra la app
   - Bot guarda las estadísticas finales

## 🏗️ Arquitectura

```
[Telegram Bot] ←→ [JSON Files] ←→ [React Native App]
     ↑                                    ↓
[Control Commands]              [Touch Events]
[Statistics View]               [Game Display]
```

## 👥 Desarrolladores
- **Santiago Escobar**
- **Jojhan Perez Arroyave**

**Universidad de Caldas**  
*Automatización y Control de Procesos*