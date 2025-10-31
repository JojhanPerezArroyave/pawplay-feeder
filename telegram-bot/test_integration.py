"""
Script de prueba para verificar la integración del bot
Simula el comportamiento de la app React Native
"""

import json
import time
from pathlib import Path


def read_game_data():
    """Leer datos actuales del juego"""
    try:
        with open('game_data.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ Archivo game_data.json no encontrado")
        print("🔧 Asegúrate de que el bot esté ejecutándose")
        return None

def simulate_game_session():
    """Simular una sesión de juego"""
    print("🎮 Simulador de sesión PawPlay")
    print("=" * 40)
    
    while True:
        data = read_game_data()
        if not data:
            break
            
        print(f"\n📊 Estado actual:")
        print(f"🎯 Dificultad: {data.get('difficulty', 'N/A')}")
        print(f"🎮 Juego activo: {'✅' if data.get('game_active', False) else '❌'}")
        print(f"👤 Jugador: {data.get('current_player', 'N/A')}")
        
        session = data.get('session_stats', {})
        print(f"🎯 Aciertos: {session.get('catches', 0)}")
        print(f"❌ Fallos: {session.get('misses', 0)}")
        
        if data.get('game_active', False):
            print("\n🕹️ Simulando toques...")
            print("(En la app real, aquí se registrarían los toques del usuario)")
            
        print("\n⏱️ Esperando 5 segundos...")
        time.sleep(5)

if __name__ == "__main__":
    try:
        simulate_game_session()
    except KeyboardInterrupt:
        print("\n👋 Simulación terminada")