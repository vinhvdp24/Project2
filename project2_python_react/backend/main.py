from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import Base, engine, get_db
from models import Todo as DBTodo # Alias to avoid name conflict

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Cấu hình CORS (giữ nguyên)
origins = [
    "http://localhost:3000", # Cho phép React app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class TodoBase(BaseModel):
    title: str
    description: str | None = None

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    id: int
    completed: bool

    class Config:
        orm_mode = True # Enable ORM mode for SQLAlchemy models

# Original message endpoint (optional, keeping for now)
@app.get("/api/message")
def get_message():
    return {"message": "Hello from FastAPI!"}

# API to create a new todo item
@app.post("/api/todos/", response_model=Todo, status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = DBTodo(title=todo.title, description=todo.description)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

# API to get all todo items
@app.get("/api/todos/", response_model=list[Todo])
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    todos = db.query(DBTodo).offset(skip).limit(limit).all()
    return todos