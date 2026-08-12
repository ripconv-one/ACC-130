import asyncio
from datetime import datetime, timezone

from app.database import (
    complete_task,
    fail_task,
    insert_event,
    update_task,
)


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


async def run_task(task_id: str) -> None:
    try:
        update_task(
            task_id,
            "planning",
            10,
        )

        insert_event(
            task_id,
            "planning",
            "Agent is creating an execution plan.",
            now(),
        )

        await asyncio.sleep(2)

        update_task(
            task_id,
            "running",
            30,
        )

        insert_event(
            task_id,
            "thinking",
            "Agent is analyzing the task goal.",
            now(),
        )

        await asyncio.sleep(2)

        update_task(
            task_id,
            "running",
            60,
        )

        insert_event(
            task_id,
            "tool_call",
            "Agent is preparing to use available tools.",
            now(),
        )

        await asyncio.sleep(2)

        update_task(
            task_id,
            "running",
            85,
        )

        insert_event(
            task_id,
            "thinking",
            "Agent is preparing the final result.",
            now(),
        )

        await asyncio.sleep(2)

        result = (
            "Simulation complete. "
            "The agent successfully processed the task."
        )

        complete_task(
            task_id,
            result,
        )

        insert_event(
            task_id,
            "completed",
            "Task completed successfully.",
            now(),
        )

    except Exception as exc:
        error_message = str(exc)

        fail_task(
            task_id,
            error_message,
        )

        insert_event(
            task_id,
            "failed",
            error_message,
            now(),
        )