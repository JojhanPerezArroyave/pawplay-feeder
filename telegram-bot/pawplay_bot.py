# -*- coding: utf-8 -*-
"""
PawPlay Feeder Telegram Bot
Sistema de control remoto para el juego del gato
Basado en el proyecto de conservación documental hospitalaria

Autores: Santiago Escobar y Jojhan Perez Arroyave
Universidad de Caldas - Automatización y Control de Procesos
"""

import json
import threading
import time
from datetime import datetime
from pathlib import Path

import telepot

# =================== CONFIGURACIÓN ===================
TELEGRAM_TOKEN = "8422272472:AAHunX1mQP2wDscL8o3Hskz6hbebIchu_eU"  # <-- Reemplaza con tu token de BotFather
GAME_DATA_FILE = "game_data.json"
STATS_FILE = "game_stats.json"

# Servidor HTTP simple para la app
import http.server
import json
import socketserver
from urllib.parse import parse_qs, urlparse


# =================== CLASE PRINCIPAL ===================
class PawPlayBot:
    def __init__(self):
        self.bot = telepot.Bot(TELEGRAM_TOKEN)
        self.game_data = self.load_game_data()
        self.stats = self.load_stats()
        self.authorized_users = set()  # Para futuras mejoras de seguridad
        
    def load_game_data(self):
        """Cargar datos del juego desde archivo"""
        try:
            if Path(GAME_DATA_FILE).exists():
                with open(GAME_DATA_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error cargando datos: {e}")
        
        # Datos por defecto
        return {
            "difficulty": "medium",
            "game_active": False,
            "current_player": None,
            "session_stats": {
                "catches": 0,
                "misses": 0,
                "start_time": None
            }
        }
    
    def save_game_data(self):
        """Guardar datos del juego"""
        try:
            with open(GAME_DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.game_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error guardando datos: {e}")
    
    def load_stats(self):
        """Cargar estadísticas generales"""
        try:
            if Path(STATS_FILE).exists():
                with open(STATS_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error cargando estadísticas: {e}")
        
        return {
            "total_games": 0,
            "total_catches": 0,
            "total_misses": 0,
            "best_scores": {
                "easy": 0,
                "medium": 0,
                "hard": 0
            },
            "last_played": None
        }
    
    def save_stats(self):
        """Guardar estadísticas"""
        try:
            with open(STATS_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.stats, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error guardando estadísticas: {e}")

    def handle_message(self, msg):
        """Manejar mensajes del bot"""
        content_type, chat_type, chat_id = telepot.glance(msg)
        
        if content_type != 'text':
            self.bot.sendMessage(chat_id, "🐱 Solo acepto comandos de texto")
            return
            
        command = msg['text'].strip().lower()
        user_name = msg.get('from', {}).get('first_name', 'Usuario')
        
        # Registrar usuario
        self.authorized_users.add(chat_id)
        
        # Procesar comandos
        if command == '/start':
            self.cmd_start(chat_id, user_name)
        elif command == '/menu':
            self.cmd_menu(chat_id)
        elif command in ['/facil', '/easy']:
            self.cmd_set_difficulty(chat_id, 'easy')
        elif command in ['/medio', '/medium']:
            self.cmd_set_difficulty(chat_id, 'medium')
        elif command in ['/dificil', '/hard']:
            self.cmd_set_difficulty(chat_id, 'hard')
        elif command in ['/iniciar', '/start_game']:
            self.cmd_start_game(chat_id, user_name)
        elif command in ['/parar', '/stop_game']:
            self.cmd_stop_game(chat_id)
        elif command in ['/estado', '/status']:
            self.cmd_status(chat_id)
        elif command in ['/estadisticas', '/stats']:
            self.cmd_statistics(chat_id)
        elif command in ['/puntuacion', '/score']:
            self.cmd_current_score(chat_id)
        elif command in ['/reset']:
            self.cmd_reset_stats(chat_id)
        elif command in ['/ayuda', '/help']:
            self.cmd_help(chat_id)
        else:
            self.cmd_unknown(chat_id)

    def cmd_start(self, chat_id, user_name):
        """Comando /start"""
        welcome_msg = f"""
🐱 ¡Bienvenido a PawPlay Feeder, {user_name}! 🎮

🎯 **Sistema de Control Remoto**
Controla el juego del gato desde Telegram

📱 **Funciones principales:**
• Seleccionar dificultad
• Iniciar/parar juegos
• Ver estadísticas en tiempo real
• Monitorear puntuaciones

🚀 Usa /menu para ver todos los comandos
"""
        self.bot.sendMessage(chat_id, welcome_msg)
        self.cmd_menu(chat_id)

    def cmd_menu(self, chat_id):
        """Mostrar menú principal"""
        difficulty = self.game_data.get('difficulty', 'medium')
        status = "🟢 ACTIVO" if self.game_data.get('game_active', False) else "🔴 PAUSADO"
        
        menu_msg = f"""
🎮 **PAWPLAY CONTROL PANEL**

📊 **Estado actual:**
• Dificultad: {self.get_difficulty_emoji(difficulty)} {difficulty.upper()}
• Juego: {status}

🎯 **Comandos de juego:**
/facil - Dificultad fácil 🟢
/medio - Dificultad media 🟡  
/dificil - Dificultad difícil 🔴

▶️ /iniciar - Comenzar juego
⏸️ /parar - Pausar juego

📈 **Información:**
/estado - Estado del sistema
/puntuacion - Puntuación actual
/estadisticas - Estadísticas generales

❓ /ayuda - Ayuda completa
"""
        self.bot.sendMessage(chat_id, menu_msg)

    def cmd_set_difficulty(self, chat_id, difficulty):
        """Cambiar dificultad"""
        old_difficulty = self.game_data.get('difficulty', 'medium')
        self.game_data['difficulty'] = difficulty
        self.save_game_data()
        
        emoji = self.get_difficulty_emoji(difficulty)
        msg = f"""
🎯 **Dificultad cambiada**

{self.get_difficulty_emoji(old_difficulty)} {old_difficulty.upper()} → {emoji} {difficulty.upper()}

⚙️ **Configuración:**
{self.get_difficulty_description(difficulty)}

🎮 Usa /iniciar para comenzar con la nueva dificultad
"""
        self.bot.sendMessage(chat_id, msg)

    def cmd_start_game(self, chat_id, user_name):
        """Iniciar juego"""
        self.game_data['game_active'] = True
        self.game_data['current_player'] = user_name
        self.game_data['session_stats'] = {
            "catches": 0,
            "misses": 0,
            "start_time": datetime.now().isoformat()
        }
        self.save_game_data()
        
        difficulty = self.game_data.get('difficulty', 'medium')
        emoji = self.get_difficulty_emoji(difficulty)
        
        msg = f"""
🎮 **¡JUEGO INICIADO!**

👤 Jugador: {user_name}
{emoji} Dificultad: {difficulty.upper()}
⏰ Hora de inicio: {datetime.now().strftime('%H:%M:%S')}

🐱 ¡El gato está listo para jugar!
📱 Abre la app para comenzar a jugar

📊 Usa /puntuacion para ver tu progreso
⏸️ Usa /parar para pausar el juego
"""
        self.bot.sendMessage(chat_id, msg)

    def cmd_stop_game(self, chat_id):
        """Parar juego"""
        if not self.game_data.get('game_active', False):
            self.bot.sendMessage(chat_id, "⚠️ No hay ningún juego activo")
            return
            
        # Guardar estadísticas de la sesión
        session = self.game_data.get('session_stats', {})
        catches = session.get('catches', 0)
        misses = session.get('misses', 0)
        
        self.game_data['game_active'] = False
        self.save_game_data()
        
        # Actualizar estadísticas generales
        self.stats['total_games'] += 1
        self.stats['total_catches'] += catches
        self.stats['total_misses'] += misses
        self.stats['last_played'] = datetime.now().isoformat()
        
        difficulty = self.game_data.get('difficulty', 'medium')
        if catches > self.stats['best_scores'].get(difficulty, 0):
            self.stats['best_scores'][difficulty] = catches
            
        self.save_stats()
        
        msg = f"""
⏸️ **JUEGO PAUSADO**

📊 **Resumen de la sesión:**
🎯 Aciertos: {catches}
❌ Fallos: {misses}
📈 Precisión: {self.calculate_accuracy(catches, misses)}%

💾 Estadísticas guardadas
🎮 Usa /iniciar para jugar de nuevo
"""
        self.bot.sendMessage(chat_id, msg)

    def cmd_status(self, chat_id):
        """Estado del sistema"""
        difficulty = self.game_data.get('difficulty', 'medium')
        active = self.game_data.get('game_active', False)
        player = self.game_data.get('current_player', 'Ninguno')
        
        status_emoji = "🟢" if active else "🔴"
        status_text = "ACTIVO" if active else "PAUSADO"
        
        session = self.game_data.get('session_stats', {})
        start_time = session.get('start_time')
        
        msg = f"""
📊 **ESTADO DEL SISTEMA**

🎮 **Juego:** {status_emoji} {status_text}
👤 **Jugador actual:** {player}
🎯 **Dificultad:** {self.get_difficulty_emoji(difficulty)} {difficulty.upper()}

📈 **Sesión actual:**
🎯 Aciertos: {session.get('catches', 0)}
❌ Fallos: {session.get('misses', 0)}
⏰ Inicio: {self.format_time(start_time) if start_time else 'N/A'}

🔧 **Sistema:** Operativo
📡 **Conexión:** Estable
"""
        self.bot.sendMessage(chat_id, msg)

    def cmd_current_score(self, chat_id):
        """Puntuación actual"""
        if not self.game_data.get('game_active', False):
            self.bot.sendMessage(chat_id, "⚠️ No hay juego activo. Usa /iniciar para comenzar")
            return
            
        session = self.game_data.get('session_stats', {})
        catches = session.get('catches', 0)
        misses = session.get('misses', 0)
        start_time = session.get('start_time')
        
        # Calcular tiempo de juego
        duration = "N/A"
        if start_time:
            try:
                start = datetime.fromisoformat(start_time)
                duration = str(datetime.now() - start).split('.')[0]
            except:
                pass
        
        msg = f"""
📈 **PUNTUACIÓN ACTUAL**

🎯 **Aciertos:** {catches}
❌ **Fallos:** {misses}
📊 **Total toques:** {catches + misses}
🎪 **Precisión:** {self.calculate_accuracy(catches, misses)}%

⏱️ **Tiempo de juego:** {duration}
👤 **Jugador:** {self.game_data.get('current_player', 'N/A')}

🏆 Récord en {self.game_data.get('difficulty', 'medium')}: {self.stats.get('best_scores', {}).get(self.game_data.get('difficulty', 'medium'), 0)}
"""
        self.bot.sendMessage(chat_id, msg)

    def cmd_statistics(self, chat_id):
        """Estadísticas generales"""
        total_catches = self.stats.get('total_catches', 0)
        total_misses = self.stats.get('total_misses', 0)
        total_games = self.stats.get('total_games', 0)
        best_scores = self.stats.get('best_scores', {})
        
        msg = f"""
📊 **ESTADÍSTICAS GENERALES**

🎮 **Totales:**
🕹️ Partidas jugadas: {total_games}
🎯 Total aciertos: {total_catches}
❌ Total fallos: {total_misses}
📈 Precisión global: {self.calculate_accuracy(total_catches, total_misses)}%

🏆 **Récords por dificultad:**
🟢 Fácil: {best_scores.get('easy', 0)} aciertos
🟡 Medio: {best_scores.get('medium', 0)} aciertos  
🔴 Difícil: {best_scores.get('hard', 0)} aciertos

⏰ **Última partida:** {self.format_time(self.stats.get('last_played'))}
"""
        self.bot.sendMessage(chat_id, msg)

    def cmd_reset_stats(self, chat_id):
        """Resetear estadísticas (solo para emergencias)"""
        self.stats = {
            "total_games": 0,
            "total_catches": 0,
            "total_misses": 0,
            "best_scores": {"easy": 0, "medium": 0, "hard": 0},
            "last_played": None
        }
        self.save_stats()
        self.bot.sendMessage(chat_id, "🔄 Estadísticas reiniciadas")

    def cmd_help(self, chat_id):
        """Ayuda completa"""
        help_msg = """
❓ **AYUDA COMPLETA - PAWPLAY BOT**

🎮 **Comandos de control:**
/iniciar - Iniciar una nueva partida
/parar - Pausar la partida actual
/facil, /medio, /dificil - Cambiar dificultad

📊 **Comandos de información:**
/estado - Ver estado actual del sistema
/puntuacion - Ver puntuación de la sesión
/estadisticas - Ver estadísticas generales
/menu - Mostrar menú principal

🔧 **Cómo funciona:**
1. Selecciona dificultad con /facil, /medio o /dificil
2. Inicia el juego con /iniciar
3. Abre la app móvil para jugar
4. El bot registra automáticamente tus toques
5. Usa /puntuacion para ver tu progreso
6. Usa /parar cuando termines

💡 **Consejos:**
• La app solo muestra el juego, el control es por Telegram
• Las estadísticas se guardan automáticamente
• Puedes cambiar dificultad en cualquier momento

🤖 **Desarrollado por:** Santiago Escobar y Jojhan Perez
🏫 **Universidad de Caldas** - Automatización y Control
"""
        self.bot.sendMessage(chat_id, help_msg)

    def cmd_unknown(self, chat_id):
        """Comando no reconocido"""
        self.bot.sendMessage(chat_id, "❓ Comando no reconocido. Usa /menu para ver opciones disponibles")

    # =================== UTILIDADES ===================
    def get_difficulty_emoji(self, difficulty):
        """Obtener emoji para dificultad"""
        emojis = {"easy": "🟢", "medium": "🟡", "hard": "🔴"}
        return emojis.get(difficulty, "🟡")

    def get_difficulty_description(self, difficulty):
        """Obtener descripción de dificultad"""
        descriptions = {
            "easy": "🐌 Velocidad lenta, pausas largas",
            "medium": "🚶 Velocidad normal, pausas moderadas",  
            "hard": "🏃 Velocidad rápida, pausas cortas"
        }
        return descriptions.get(difficulty, "Configuración estándar")

    def calculate_accuracy(self, catches, misses):
        """Calcular precisión"""
        total = catches + misses
        if total == 0:
            return 0
        return round((catches / total) * 100, 1)

    def format_time(self, time_str):
        """Formatear tiempo"""
        if not time_str:
            return "N/A"
        try:
            dt = datetime.fromisoformat(time_str)
            return dt.strftime('%d/%m/%Y %H:%M')
        except:
            return "N/A"

    # =================== API PARA LA APP ===================
    def register_catch(self):
        """Registrar acierto (llamado desde la app)"""
        if self.game_data.get('game_active', False):
            self.game_data['session_stats']['catches'] += 1
            self.save_game_data()
            return True
        return False

    def register_miss(self):
        """Registrar fallo (llamado desde la app)"""
        if self.game_data.get('game_active', False):
            self.game_data['session_stats']['misses'] += 1
            self.save_game_data()
            return True
        return False

    def get_current_difficulty(self):
        """Obtener dificultad actual"""
        return self.game_data.get('difficulty', 'medium')

    def is_game_active(self):
        """Verificar si el juego está activo"""
        return self.game_data.get('game_active', False)

    # =================== SERVIDOR HTTP PARA LA APP ===================
    def start_http_server(self):
        """Iniciar servidor HTTP para comunicación con la app"""
        game_bot = self  # Referencia al bot
        
        class GameDataHandler(http.server.BaseHTTPRequestHandler):            
            def do_GET(self):
                """Manejar requests GET"""
                parsed_path = urlparse(self.path)
                
                if parsed_path.path == '/game-data':
                    # Devolver datos del juego
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    response = json.dumps(game_bot.game_data)
                    self.wfile.write(response.encode())
                    
                elif parsed_path.path == '/register-catch':
                    # Registrar acierto
                    game_bot.register_catch()
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(b'{"status": "success"}')
                    
                elif parsed_path.path == '/register-miss':
                    # Registrar fallo
                    game_bot.register_miss()
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(b'{"status": "success"}')
                    
                else:
                    self.send_response(404)
                    self.end_headers()
            
            def log_message(self, format, *args):
                # Silenciar logs del servidor HTTP
                pass
        
        try:
            httpd = socketserver.TCPServer(("0.0.0.0", 8765), GameDataHandler)
            print("🌐 Servidor HTTP iniciado en puerto 8765 (todas las interfaces)")
            thread = threading.Thread(target=httpd.serve_forever, daemon=True)
            thread.start()
            return httpd
        except Exception as e:
            print(f"❌ Error iniciando servidor HTTP: {e}")
            return None

    # =================== EJECUCIÓN ===================
    def run(self):
        """Ejecutar el bot"""
        print("🤖 PawPlay Bot iniciado...")
        print(f"📁 Archivos de datos: {GAME_DATA_FILE}, {STATS_FILE}")
        
        # Iniciar servidor HTTP
        self.start_http_server()
        
        try:
            self.bot.message_loop(self.handle_message)
            print("🟢 Bot escuchando mensajes...")
            
            while True:
                time.sleep(10)
                
        except KeyboardInterrupt:
            print("\n⏹️ Bot detenido por el usuario")
        except Exception as e:
            print(f"❌ Error en el bot: {e}")

# =================== EJECUCIÓN PRINCIPAL ===================
if __name__ == "__main__":
    bot = PawPlayBot()
    bot.run()