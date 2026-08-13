from dataclasses import dataclass


@dataclass(frozen=True)
class ModelConfig:
    provider: str
    model: str
    display_name: str


MODELS: dict[str, ModelConfig] = {
    "qwen": ModelConfig(
        provider="ollama",
        model="qwen3:latest",
        display_name="Qwen 3",
    ),
}


def get_model(model_id: str) -> ModelConfig:
    try:
        return MODELS[model_id]
    except KeyError:
        raise ValueError(
            f"Unknown model: {model_id}"
        ) from None


def list_models() -> list[ModelConfig]:
    return list(MODELS.values())