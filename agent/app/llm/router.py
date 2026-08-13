import httpx

from app.llm.registry import ModelConfig, get_model


OLLAMA_URL = "http://127.0.0.1:11434"


async def generate(
    model_id: str,
    prompt: str,
    system_prompt: str | None = None,
) -> str:
    config = get_model(model_id)

    if config.provider == "ollama":
        return await generate_ollama(
            config=config,
            prompt=prompt,
            system_prompt=system_prompt,
        )

    raise ValueError(
        f"Unsupported provider: {config.provider}"
    )


async def generate_ollama(
    config: ModelConfig,
    prompt: str,
    system_prompt: str | None = None,
) -> str:
    messages = []

    if system_prompt:
        messages.append(
            {
                "role": "system",
                "content": system_prompt,
            }
        )

    messages.append(
        {
            "role": "user",
            "content": prompt,
        }
    )

    async with httpx.AsyncClient(
        timeout=300.0,
    ) as client:
        response = await client.post(
            f"{OLLAMA_URL}/api/chat",
            json={
                "model": config.model,
                "messages": messages,
                "stream": False,
            },
        )

        response.raise_for_status()

        data = response.json()

    return data["message"]["content"]