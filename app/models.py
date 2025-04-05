# (Opcional si luego usas modelos Pydantic en schemas)
# Aquí puedes definir la lógica de creación de índices, validaciones DB, etc.

# Ejemplo de referencia de estructuras (no son obligatorias)
"""
Usuarios (colección 'users'):
{
    _id: ObjectId,
    username: str,
    hashed_password: str
}

Chats (colección 'chats'):
{
    _id: ObjectId,
    members: [user_id1, user_id2...]
}

Mensajes (colección 'messages'):
{
    _id: ObjectId,
    chat_id: ObjectId,
    sender_id: ObjectId,
    content: str,
    timestamp: datetime
}
"""
