import os
from motor.motor_asyncio import AsyncIOMotorClient

# Usamos variable de entorno; si no, localhost.
MONGO_URI = os.getenv("MONGO_URI")
print(f"Conectando a MongoDB en {MONGO_URI}")
client = AsyncIOMotorClient(MONGO_URI)
db = client["chat_db"]
