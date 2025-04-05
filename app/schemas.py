from pydantic import BaseModel, Field
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    username: str

class MessageCreate(BaseModel):
    chat_id: str
    content: str

class MessageOut(BaseModel):
    sender_id: str
    content: str
    timestamp: str  # o datetime
