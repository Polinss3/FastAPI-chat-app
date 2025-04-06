from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from .database import db
from .schemas import UserCreate, UserOut
import os

auth_router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "changeme")  # Cámbialo en producción
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_token(username: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": username, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@auth_router.post("/signup", response_model=UserOut)
async def signup(user: UserCreate):
    existing = await db["users"].find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    hashed = pwd_context.hash(user.password)
    new_user = {"username": user.username, "hashed_password": hashed}
    await db["users"].insert_one(new_user)
    return UserOut(username=user.username)

@auth_router.post("/login")
async def login(user: UserCreate):
    db_user = await db["users"].find_one({"username": user.username})
    if not db_user or not pwd_context.verify(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = create_token(user.username)
    return {"access_token": token, "token_type": "bearer"}

@auth_router.get("/users")
async def list_users():
    users_cursor = db["users"].find({}, {"username": 1, "_id": 0})
    users = await users_cursor.to_list(None)
    return {"users": users}
