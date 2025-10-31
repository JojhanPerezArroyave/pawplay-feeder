#!/bin/bash

# Script de configuración rápida para PawPlay Bot
# Automatiza la instalación y configuración inicial

echo "🐱 PawPlay Feeder - Configuración del Bot de Telegram"
echo "====================================================="

# Función para verificar si Python está instalado
check_python() {
    if command -v python3 &> /dev/null; then
        echo "✅ Python3 encontrado"
        PYTHON_CMD="python3"
    elif command -v python &> /dev/null; then
        echo "✅ Python encontrado"
        PYTHON_CMD="python"
    else
        echo "❌ Python no encontrado. Por favor instala Python 3.6+"
        exit 1
    fi
}

# Función para verificar si pip está instalado
check_pip() {
    if command -v pip3 &> /dev/null; then
        echo "✅ pip3 encontrado"
        PIP_CMD="pip3"
    elif command -v pip &> /dev/null; then
        echo "✅ pip encontrado"
        PIP_CMD="pip"
    else
        echo "❌ pip no encontrado. Por favor instala pip"
        exit 1
    fi
}

# Función para instalar dependencias
install_dependencies() {
    echo "📦 Instalando dependencias de Python..."
    $PIP_CMD install -r requirements.txt
    
    if [ $? -eq 0 ]; then
        echo "✅ Dependencias instaladas correctamente"
    else
        echo "❌ Error instalando dependencias"
        exit 1
    fi
}

# Función para solicitar token del bot
configure_token() {
    echo ""
    echo "🔐 Configuración del Token de Telegram"
    echo "--------------------------------------"
    echo "Para obtener un token:"
    echo "1. Busca @BotFather en Telegram"
    echo "2. Envía /newbot"
    echo "3. Sigue las instrucciones"
    echo "4. Guarda el token que te proporcione"
    echo ""
    
    read -p "🤖 Ingresa tu token de bot de Telegram: " TOKEN
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Token vacío. Puedes configurarlo manualmente en pawplay_bot.py"
        return
    fi
    
    # Reemplazar el token en el archivo
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/TU_TOKEN_AQUI/$TOKEN/g" pawplay_bot.py
    else
        # Linux y otros
        sed -i "s/TU_TOKEN_AQUI/$TOKEN/g" pawplay_bot.py
    fi
    
    echo "✅ Token configurado correctamente"
}

# Función para crear archivos de ejemplo
create_examples() {
    echo "📄 Creando archivos de ejemplo..."
    
    # Crear archivo de configuración de ejemplo
    cat > config_example.json << EOF
{
  "bot_token": "TU_TOKEN_AQUI",
  "authorized_users": [],
  "debug_mode": false,
  "auto_save": true
}
EOF

    echo "✅ Archivo config_example.json creado"
}

# Función para verificar la configuración
test_configuration() {
    echo ""
    echo "🧪 Verificando configuración..."
    
    # Verificar que el archivo principal existe
    if [ ! -f "pawplay_bot.py" ]; then
        echo "❌ Archivo pawplay_bot.py no encontrado"
        return 1
    fi
    
    # Verificar que las dependencias están instaladas
    $PYTHON_CMD -c "import telepot; print('✅ telepot instalado')" 2>/dev/null || echo "❌ telepot no instalado"
    
    echo "✅ Configuración verificada"
}

# Función para mostrar instrucciones de uso
show_usage() {
    echo ""
    echo "🚀 ¡Configuración completada!"
    echo "============================="
    echo ""
    echo "Para iniciar el bot:"
    echo "  $PYTHON_CMD pawplay_bot.py"
    echo ""
    echo "Comandos principales del bot:"
    echo "  /start    - Inicializar bot"
    echo "  /menu     - Mostrar menú principal"
    echo "  /facil    - Dificultad fácil"
    echo "  /medio    - Dificultad media"
    echo "  /dificil  - Dificultad difícil"
    echo "  /iniciar  - Comenzar juego"
    echo "  /parar    - Pausar juego"
    echo "  /estado   - Ver estado actual"
    echo ""
    echo "💡 Tip: Usa /ayuda en Telegram para ver todos los comandos"
    echo ""
    echo "🔧 Archivos importantes:"
    echo "  - pawplay_bot.py      : Bot principal"
    echo "  - game_data.json      : Datos del juego (generado automáticamente)"
    echo "  - game_stats.json     : Estadísticas (generado automáticamente)"
    echo "  - test_integration.py : Script de pruebas"
    echo ""
}

# Función principal
main() {
    echo "Iniciando configuración..."
    
    # Cambiar al directorio del bot
    cd "$(dirname "$0")"
    
    # Verificar requisitos
    check_python
    check_pip
    
    # Instalar dependencias
    install_dependencies
    
    # Configurar token
    configure_token
    
    # Crear archivos de ejemplo
    create_examples
    
    # Verificar configuración
    test_configuration
    
    # Mostrar instrucciones
    show_usage
    
    echo "✨ ¡Listo para usar!"
}

# Ejecutar script principal
main