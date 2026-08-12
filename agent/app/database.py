import sqlite3
from pathlib import Path

from app.models import Task


DATABASE_PATH = Path(__file__).resolve().parent.parent / "acc.db"


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                goal TEXT NOT NULL,
                agent TEXT NOT NULL,
                status TEXT NOT NULL,
                progress INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                result TEXT,
                error TEXT
            )
            """
        )

        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS task_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task_id TEXT NOT NULL,
                type TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (task_id) REFERENCES tasks(id)
            )
            """
        )

        columns = {
            row["name"]
            for row in connection.execute(
                "PRAGMA table_info(tasks)"
            ).fetchall()
        }

        if "result" not in columns:
            connection.execute(
                "ALTER TABLE tasks ADD COLUMN result TEXT"
            )

        if "error" not in columns:
            connection.execute(
                "ALTER TABLE tasks ADD COLUMN error TEXT"
            )


def insert_task(task: Task) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO tasks (
                id,
                name,
                goal,
                agent,
                status,
                progress,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                task.id,
                task.name,
                task.goal,
                task.agent,
                task.status,
                task.progress,
                task.created_at.isoformat(),
            ),
        )


def get_task(task_id: str) -> Task | None:
    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT *
            FROM tasks
            WHERE id = ?
            """,
            (task_id,),
        ).fetchone()

    if row is None:
        return None

    return Task(
        id=row["id"],
        name=row["name"],
        goal=row["goal"],
        agent=row["agent"],
        status=row["status"],
        progress=row["progress"],
        created_at=row["created_at"],
        result=row["result"],
        error=row["error"],
    )


def update_task(
    task_id: str,
    status: str,
    progress: int,
) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            UPDATE tasks
            SET status = ?, progress = ?
            WHERE id = ?
            """,
            (
                status,
                progress,
                task_id,
            ),
        )


def insert_event(
    task_id: str,
    event_type: str,
    message: str,
    created_at: str,
) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO task_events (
                task_id,
                type,
                message,
                created_at
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                task_id,
                event_type,
                message,
                created_at,
            ),
        )


def get_events(task_id: str) -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                id,
                task_id,
                type,
                message,
                created_at
            FROM task_events
            WHERE task_id = ?
            ORDER BY id ASC
            """,
            (task_id,),
        ).fetchall()

    return [dict(row) for row in rows]


def complete_task(
    task_id: str,
    result: str,
) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            UPDATE tasks
            SET
                status = 'completed',
                progress = 100,
                result = ?,
                error = NULL
            WHERE id = ?
            """,
            (
                result,
                task_id,
            ),
        )


def fail_task(
    task_id: str,
    error: str,
) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            UPDATE tasks
            SET
                status = 'failed',
                error = ?
            WHERE id = ?
            """,
            (
                error,
                task_id,
            ),
        )