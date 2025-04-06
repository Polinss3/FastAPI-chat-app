from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict

router_ws = APIRouter()
connections: Dict[str, List[WebSocket]] = {}

@router_ws.websocket("/chat/{chat_id}")
async def websocket_endpoint(ws: WebSocket, chat_id: str):
    await ws.accept()
    if chat_id not in connections:
        connections[chat_id] = []
    connections[chat_id].append(ws)
    try:
        while True:
            data = await ws.receive_text()
            for conn in connections[chat_id]:
                await conn.send_text(data)
    except WebSocketDisconnect:
        connections[chat_id].remove(ws)
