from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os

from database import Base, engine, get_db
from models import Todo as DBTodo # Alias to avoid name conflict

from sqlalchemy.exc import OperationalError
import time

def create_db_and_tables():
    # Thử kết nối trong một khoảng thời gian nhất định (ví dụ: 30 giây)
    for _ in range(10): # Thử 10 lần
        try:
            Base.metadata.create_all(bind=engine)
            print("Database connection successful, tables created.")
            return
        except OperationalError:
            print("Database connection failed, retrying in 3 seconds...")
            time.sleep(3)
    print("Could not connect to the database after multiple attempts.")


app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Cấu hình CORS
# Lấy URL của Netlify từ biến môi trường để bảo mật hơn
NETLIFY_URL = os.getenv("NETLIFY_URL", "http://localhost:3000")

origins = [
    "http://localhost:3000",
    NETLIFY_URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models cho request/response
class TodoBase(BaseModel):
    title: str
    description: str | None = None

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    id: int
    completed: bool

    class Config:
        orm_mode = True

# API endpoints
@app.get("/api/message")
def get_message():
    return {"message": "Hello from FastAPI!"}

@app.post("/api/todos/", response_model=Todo, status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = DBTodo(title=todo.title, description=todo.description)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.get("/api/todos/", response_model=list[Todo])
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    todos = db.query(DBTodo).offset(skip).limit(limit).all()
    return todos
