# 🔐 Configuración de Seguridad - PawPlay Telegram Bot

## ⚠️ Variables de Entorno Sensibles

Este proyecto utiliza variables de entorno para proteger información sensible como el token del bot de Telegram.

### 📁 Archivos de Configuración

- **`.env`**: Contiene las variables reales (❌ **NUNCA subir a GitHub**)
- **`.env.example`**: Plantilla con valores de ejemplo (✅ **Sí se puede subir**)

### 🔑 Token del Bot

El token del bot de Telegram es información **MUY SENSIBLE**:
- ✅ Permite control total del bot
- ❌ Si se filtra, cualquiera puede usarlo
- 🔄 Si se compromete, hay que regenerarlo con @BotFather

### 🛡️ Buenas Prácticas Implementadas

1. **Variables de entorno**: Token almacenado en `.env`
2. **Gitignore actualizado**: `.env` excluido del repositorio
3. **Archivo de ejemplo**: `.env.example` para guiar configuración
4. **Validación**: El bot verifica que el token exista al iniciar

### 🔧 Configuración para Nuevos Desarrolladores

1. Copiar archivo de ejemplo:
```bash
cp .env.example .env
```

2. Crear bot en Telegram con @BotFather

3. Editar `.env` con el token real:
```env
TELEGRAM_BOT_TOKEN=tu_token_real_aqui
HTTP_PORT=8765
```

4. Ejecutar el bot:
```bash
python pawplay_bot.py
```

### 🚨 En Caso de Filtración del Token

Si el token se filtra accidentalmente:

1. **Inmediatamente:** Revocar el token en @BotFather:
   - Enviar `/revoke` en Telegram
   - Seleccionar el bot afectado

2. **Generar nuevo token:**
   - Enviar `/token` en @BotFather
   - Obtener el nuevo token

3. **Actualizar configuración:**
   - Modificar el archivo `.env`
   - Reiniciar el bot

### 🔍 Verificación de Seguridad

Para verificar que no hay tokens en el código:

```bash
# Buscar posibles tokens en el código
grep -r "AAH" . --exclude-dir=node_modules
grep -r "bot.*token" . --exclude-dir=node_modules --exclude=".env*"
```

### 📚 Recursos Adicionales

- [Documentación de Telegram Bot API](https://core.telegram.org/bots/api)
- [Buenas prácticas de seguridad en bots](https://core.telegram.org/bots/tutorial)
- [Gestión de tokens sensibles](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**⚠️ RECORDATORIO:** Nunca subas tokens, contraseñas o credenciales a repositorios públicos.