import os
from motor.motor_asyncio import AsyncIOMotorClient

# Usamos variable de entorno; si no, localhost.
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["chat_db"]
