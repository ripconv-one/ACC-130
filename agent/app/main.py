from contextlib import asynccontextmanager
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import BackgroundTasks, FastAPI, HTTPException

from app.database import (
    get_events,
    get_task,
    initialize_database,
    insert_task,
)
from app.models import Task, TaskCreate
from app.runner import run_task


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield


app = FastAPI(
    title="Agent Command Center API",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/")
def root():
    return {
        "service": "Agent Command Center",
        "status": "online",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


@app.post(
    "/tasks",
    response_model=Task,
    status_code=201,
)
def create_task(
    task_data: TaskCreate,
    background_tasks: BackgroundTasks,
):
    task = Task(
        id=f"ACC-{uuid4().hex[:8].upper()}",
        name=task_data.name,
        goal=task_data.goal,
        agent=task_data.agent,
        status="queued",
        progress=0,
        created_at=datetime.now(timezone.utc),
    )

    insert_task(task)

    background_tasks.add_task(
        run_task,
        task.id,
    )

    return task


@app.get(
    "/tasks/{task_id}",
    response_model=Task,
)
def read_task(task_id: str):
    task = get_task(task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found.",
        )

    return task


@app.get("/tasks/{task_id}/events")
def read_task_events(task_id: str):
    task = get_task(task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found.",
        )

    return get_events(task_id)