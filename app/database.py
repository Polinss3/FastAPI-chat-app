import os
from motor.motor_asyncio import AsyncIOMotorClient

# Usamos variable de entorno; si no, localhost.
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://pablobrasero:gHzs9MgUuImIXfGf@fastapi-chat-app.jmn6umh.mongodb.net/?retryWrites=true&w=majority&appName=FastAPI-chat-app")
client = AsyncIOMotorClient(MONGO_URI)
db = client["chat_db"]
