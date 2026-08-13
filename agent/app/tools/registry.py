from typing import Any

from app.tools.calculator import calculate


TOOLS = {
    "calculator": {
        "description": (
            "Evaluate a mathematical expression."
        ),
        "function": calculate,
    },
}


def get_tool_definitions() -> list[dict[str, Any]]:
    return [
        {
            "type": "function",
            "function": {
                "name": "calculator",
                "description": (
                    "Evaluate a mathematical expression. "
                    "Use this instead of calculating "
                    "arithmetic yourself."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "expression": {
                            "type": "string",
                            "description": (
                                "The mathematical expression "
                                "to evaluate."
                            ),
                        },
                    },
                    "required": [
                        "expression",
                    ],
                },
            },
        }
    ]


def execute_tool(
    name: str,
    arguments: dict[str, Any],
) -> str:
    tool = TOOLS.get(name)

    if tool is None:
        raise ValueError(
            f"Unknown tool: {name}"
        )

    if name == "calculator":
        return tool["function"](
            arguments["expression"]
        )

    raise ValueError(
        f"Tool has no executor: {name}"
    )