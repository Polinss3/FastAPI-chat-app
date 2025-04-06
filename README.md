# Messaging Sandbox

Proyecto de prueba FastAPI + MongoDB para mensajería en tiempo real.

## Requisitos

- Docker instalado
- MongoDB (local o remoto)
- (Opcional) Python 3.9+ si se ejecuta sin Docker

## Uso con Docker

```bash
docker build -t fastapi-chat .
docker run -d -p 8765:8765 -e MONGO_URI="mongodb://<ip_or_host>:27017" fastapi-chat
```
