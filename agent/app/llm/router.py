from typing import Any

import httpx

from app.llm.registry import ModelConfig, get_model


OLLAMA_URL = "http://127.0.0.1:11434"


async def chat(
    model_id: str,
    messages: list[dict[str, Any]],
    tools: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    config = get_model(model_id)

    if config.provider == "ollama":
        return await chat_ollama(
            config=config,
            messages=messages,
            tools=tools,
        )

    raise ValueError(
        f"Unsupported provider: {config.provider}"
    )


async def chat_ollama(
    config: ModelConfig,
    messages: list[dict[str, Any]],
    tools: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "model": config.model,
        "messages": messages,
        "stream": False,
    }

    if tools:
        payload["tools"] = tools

    async with httpx.AsyncClient(
        timeout=300.0,
    ) as client:
        response = await client.post(
            f"{OLLAMA_URL}/api/chat",
            json=payload,
        )

        response.raise_for_status()

        data = response.json()

    return data["message"]