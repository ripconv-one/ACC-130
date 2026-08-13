import inspect
from typing import Any

from app.tools.calculator import calculate
from app.tools.web_search import web_search


TOOLS = {
    "calculator": {
        "function": calculate,
    },
    "web_search": {
        "function": web_search,
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
                    "Use this instead of calculating arithmetic yourself."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "expression": {
                            "type": "string",
                            "description": (
                                "The mathematical expression to evaluate."
                            ),
                        },
                    },
                    "required": ["expression"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "web_search",
                "description": (
                    "Search the web for current information. "
                    "Use this when the task requires recent facts, "
                    "news, research, or information not provided "
                    "by the user."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The web search query.",
                        },
                        "max_results": {
                            "type": "integer",
                            "description": (
                                "Maximum number of results to return."
                            ),
                            "minimum": 1,
                            "maximum": 10,
                            "default": 5,
                        },
                    },
                    "required": ["query"],
                },
            },
        },
    ]


async def execute_tool(
    name: str,
    arguments: dict[str, Any],
) -> str:
    tool = TOOLS.get(name)

    if tool is None:
        raise ValueError(
            f"Unknown tool: {name}"
        )

    function = tool["function"]

    result = function(**arguments)

    if inspect.isawaitable(result):
        result = await result

    return str(result)