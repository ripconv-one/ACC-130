from dataclasses import dataclass


@dataclass
class SearchResult:
    title: str
    url: str
    snippet: str


async def web_search(
    query: str,
    max_results: int = 5,
) -> str:
    raise NotImplementedError(
        "No web search provider has been configured."
    )