from fastapi import APIRouter, Depends, HTTPException
from .database import db
from .schemas import MessageCreate

chat_router = APIRouter()

@chat_router.post("/send")
async def send_message(msg: MessageCreate):
    # Aquí se guardaría un mensaje en la DB
    message_doc = {
        "chat_id": msg.chat_id,
        "sender_id": "demo_sender_id",
        "content": msg.content
        # ...timestamp y otros campos
    }
    await db["messages"].insert_one(message_doc)
    return {"status": "Message sent!"}

@chat_router.get("/history/{chat_id}")
async def get_chat_history(chat_id: str):
    # Recuperamos mensajes de un chat
    cursor = db["messages"].find({"chat_id": chat_id})
    messages = await cursor.to_list(None)
    return {"chat_id": chat_id, "messages": messages}
