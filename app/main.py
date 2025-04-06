from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .auth import auth_router
from .chat import chat_router
from .websockets import router_ws

app = FastAPI()

origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://localhost:8080",  # Original frontend
    "http://chat_frontend:3000",  # Docker service name
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Permite el origen definido
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluimos los routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(router_ws, prefix="/ws", tags=["websockets"])

# Para pruebas locales: uvicorn app.main:app --reload
