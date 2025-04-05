from fastapi import FastAPI
from .auth import auth_router
from .chat import chat_router
from .websockets import router_ws

app = FastAPI()

# Incluimos los routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(router_ws, prefix="/ws", tags=["websockets"])

# Para pruebas locales: uvicorn app.main:app --reload
