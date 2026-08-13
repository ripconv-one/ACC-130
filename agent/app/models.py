from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


TaskStatus = Literal[
    "queued",
    "planning",
    "running",
    "waiting_for_approval",
    "completed",
    "failed",
]


class TaskCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    goal: str = Field(min_length=1)

    agent: str = "General Agent"

    provider: str = "ollama"
    model: str = "qwen"


class Task(BaseModel):
    id: str
    name: str
    goal: str
    agent: str

    provider: str
    model: str

    status: TaskStatus
    progress: int
    created_at: datetime

    result: str | None = None
    error: str | None = None