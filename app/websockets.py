from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router_ws = APIRouter()

active_connections: List[WebSocket] = []

@router_ws.websocket("/chat")
async def websocket_endpoint(ws: WebSocket):
    # Aceptamos la conexión
    await ws.accept()
    active_connections.append(ws)
    try:
        while True:
            data = await ws.receive_text()
            # Retransmitimos a todos los conectados
            for conn in active_connections:
                if conn is not ws:
                    await conn.send_text(f"Mensaje: {data}")
    except WebSocketDisconnect:
        active_connections.remove(ws)
