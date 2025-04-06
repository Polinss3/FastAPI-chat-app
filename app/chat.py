from fastapi import APIRouter
from .database import db
from .schemas import MessageCreate
from pydantic import BaseModel
from typing import List

chat_router = APIRouter()

# Modelo para crear un chat
class ChatCreate(BaseModel):
    members: List[str]

@chat_router.post("/send")
async def send_message(msg: MessageCreate):
    message_doc = {
        "chat_id": msg.chat_id,
        "sender_id": "demo_sender_id",  # En producción usar el ID o username real
        "content": msg.content
    }
    await db["messages"].insert_one(message_doc)
    return {"status": "Message sent!"}

@chat_router.get("/history/{chat_id}")
async def get_chat_history(chat_id: str):
    cursor = db["messages"].find({"chat_id": chat_id})
    messages = await cursor.to_list(None)
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    return {"chat_id": chat_id, "messages": messages}

@chat_router.post("/create")
async def create_chat(chat: ChatCreate):
    chat_doc = {"members": chat.members}
    result = await db["chats"].insert_one(chat_doc)
    chat_doc["_id"] = str(result.inserted_id)
    return {"chat": chat_doc}

@chat_router.get("/my_chats/{username}")
async def get_my_chats(username: str):
    chats_cursor = db["chats"].find({"members": username})
    chats = await chats_cursor.to_list(None)
    for chat in chats:
        chat["_id"] = str(chat["_id"])
    return {"chats": chats}
