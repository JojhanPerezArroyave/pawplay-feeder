@echo off
REM Script de configuración rápida para PawPlay Bot (Windows)
REM Automatiza la instalación y configuración inicial

echo 🐱 PawPlay Feeder - Configuración del Bot de Telegram
echo =====================================================

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python no encontrado. Por favor instala Python 3.6+
    echo Descárgalo desde: https://python.org/downloads/
    pause
    exit /b 1
)
echo ✅ Python encontrado

REM Verificar si pip está instalado
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pip no encontrado. Por favor instala pip
    pause
    exit /b 1
)
echo ✅ pip encontrado

REM Instalar dependencias
echo 📦 Instalando dependencias de Python...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas correctamente

REM Configurar token
echo.
echo 🔐 Configuración del Token de Telegram
echo --------------------------------------
echo Para obtener un token:
echo 1. Busca @BotFather en Telegram
echo 2. Envía /newbot
echo 3. Sigue las instrucciones
echo 4. Guarda el token que te proporcione
echo.

set /p TOKEN="🤖 Ingresa tu token de bot de Telegram: "

if "%TOKEN%"=="" (
    echo ❌ Token vacío. Puedes configurarlo manualmente en pawplay_bot.py
    goto :create_examples
)

REM Reemplazar el token en el archivo (método básico para Windows)
powershell -Command "(Get-Content pawplay_bot.py) -replace 'TU_TOKEN_AQUI', '%TOKEN%' | Set-Content pawplay_bot.py"
echo ✅ Token configurado correctamente

:create_examples
REM Crear archivo de configuración de ejemplo
echo 📄 Creando archivos de ejemplo...
(
echo {
echo   "bot_token": "TU_TOKEN_AQUI",
echo   "authorized_users": [],
echo   "debug_mode": false,
echo   "auto_save": true
echo }
) > config_example.json
echo ✅ Archivo config_example.json creado

REM Verificar configuración
echo.
echo 🧪 Verificando configuración...
if not exist "pawplay_bot.py" (
    echo ❌ Archivo pawplay_bot.py no encontrado
    goto :show_usage
)

python -c "import telepot; print('✅ telepot instalado')" 2>nul || echo ❌ telepot no instalado
echo ✅ Configuración verificada

:show_usage
echo.
echo 🚀 ¡Configuración completada!
echo =============================
echo.
echo Para iniciar el bot:
echo   python pawplay_bot.py
echo.
echo Comandos principales del bot:
echo   /start    - Inicializar bot
echo   /menu     - Mostrar menú principal
echo   /facil    - Dificultad fácil
echo   /medio    - Dificultad media
echo   /dificil  - Dificultad difícil
echo   /iniciar  - Comenzar juego
echo   /parar    - Pausar juego
echo   /estado   - Ver estado actual
echo.
echo 💡 Tip: Usa /ayuda en Telegram para ver todos los comandos
echo.
echo 🔧 Archivos importantes:
echo   - pawplay_bot.py      : Bot principal
echo   - game_data.json      : Datos del juego (generado automáticamente)
echo   - game_stats.json     : Estadísticas (generado automáticamente)
echo   - test_integration.py : Script de pruebas
echo.
echo ✨ ¡Listo para usar!
pause