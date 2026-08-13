import json
from datetime import datetime, timezone
from typing import Any

from app.database import (
    complete_task,
    fail_task,
    get_task,
    insert_event,
    update_task,
)
from app.llm.router import chat
from app.tools.registry import (
    execute_tool,
    get_tool_definitions,
)


MAX_STEPS = 10


SYSTEM_PROMPT = """
You are a personal assistant to a team of researchers.
Your job is to complete the user's assigned task carefully and accurately.
You have access to tools.
When a tool is appropriate, use it rather than pretending to have used it.
Never claim to have accessed tools, files, websites, APIs, or external
information unless you actually received that information through a tool.
When the task is complete, provide a clear and useful final answer.
""".strip()


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


async def run_task(task_id: str) -> None:
    try:
        task = get_task(task_id)

        if task is None:
            raise ValueError(
                f"Task {task_id} does not exist."
            )

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

        messages: list[dict[str, Any]] = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": task.goal,
            },
        ]

        tools = get_tool_definitions()

        for step in range(1, MAX_STEPS + 1):
            progress = min(
                20 + (step * 7),
                90,
            )

            update_task(
                task_id,
                "running",
                progress,
            )

            insert_event(
                task_id,
                "model_call",
                f"Calling {task.model} (step {step}).",
                now(),
            )

            assistant_message = await chat(
                model_id=task.model,
                messages=messages,
                tools=tools,
            )

            messages.append(assistant_message)

            tool_calls = assistant_message.get(
                "tool_calls"
            )

            if not tool_calls:
                result = assistant_message.get(
                    "content",
                    "",
                ).strip()

                if not result:
                    raise ValueError(
                        "Model returned an empty response."
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

                return

            for tool_call in tool_calls:
                function = tool_call.get(
                    "function",
                    {}
                )

                tool_name = function.get("name")
                arguments = function.get(
                    "arguments",
                    {},
                )

                if not tool_name:
                    raise ValueError(
                        "Model requested a tool without a name."
                    )

                # Some providers may return arguments
                # as serialized JSON.
                if isinstance(arguments, str):
                    arguments = json.loads(arguments)

                insert_event(
                    task_id,
                    "tool_call",
                    (
                        f"{tool_name}("
                        f"{json.dumps(arguments, ensure_ascii=False)}"
                        f")"
                    ),
                    now(),
                )

                try:
                    tool_result = execute_tool(
                        tool_name,
                        arguments,
                    )

                except Exception as exc:
                    tool_result = (
                        f"Tool error: {exc}"
                    )

                insert_event(
                    task_id,
                    "tool_result",
                    tool_result,
                    now(),
                )

                messages.append(
                    {
                        "role": "tool",
                        "tool_name": tool_name,
                        "content": tool_result,
                    }
                )

        raise RuntimeError(
            f"Agent exceeded maximum steps ({MAX_STEPS})."
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



