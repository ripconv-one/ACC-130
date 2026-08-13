from datetime import datetime, timezone

from app.database import (
    complete_task,
    fail_task,
    get_task,
    insert_event,
    update_task,
)
from app.llm.router import generate


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


async def run_task(task_id: str) -> None:
    try:
        # Load the complete task from SQLite.
        task = get_task(task_id)

        if task is None:
            raise ValueError(
                f"Task {task_id} does not exist."
            )

        # Planning
        update_task(
            task_id,
            "planning",
            10,
        )

        insert_event(
            task_id,
            "planning",
            "Agent is preparing the task.",
            now(),
        )

        # Start model execution.
        update_task(
            task_id,
            "running",
            30,
        )

        insert_event(
            task_id,
            "model_call",
            f"Sending task to {task.model}.",
            now(),
        )

        # This is the real LLM call.
        result = await generate(
            model_id=task.model,
            system_prompt=(
                "You are a personal assistant to a team of researchers."
                "Complete the user's assigned task carefully. "
                "Provide a useful, clear final result. "
                "Do not claim to have used tools or accessed "
                "information that was not actually provided to you. Let the user know if this is the case."
            ),
            prompt=task.goal,
        )

        update_task(
            task_id,
            "running",
            90,
        )

        insert_event(
            task_id,
            "model_response",
            f"{task.model} returned a response.",
            now(),
        )

        # Persist Qwen's actual response.
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