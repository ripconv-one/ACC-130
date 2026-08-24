# Agent Command Center

![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141%2B-009688?logo=fastapi&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI-499848)
![uv](https://img.shields.io/badge/uv-Package%20Manager-DE5FE9)

Agent Command Center is a Python-based API for submitting and executing AI-powered tasks.

Tasks are submitted through a FastAPI REST API and processed asynchronously by an agent. The agent communicates with a configured language model, executes available tools when required, tracks its progress, and stores task results and execution events.

## Features

- Asynchronous AI task execution
- Background task processing with FastAPI
- LLM-based task planning and execution
- Configurable model and provider selection
- Tool calling and execution
- Calculator and web search tools
- Task status and progress tracking
- Task execution event history
- Persistent local database storage
- Automatic API documentation with FastAPI

## Installation

Clone the repository:

```bash
git clone https://github.com/ripconv-one/ACC-130.git
cd ACC-130/agent
```

Install the project and its dependencies:

```bash
uv sync
```

## Running the Application

Start the development server:

```bash
uv run uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Returns the service status |
| `GET` | `/health` | Health check endpoint |
| `POST` | `/tasks` | Creates and queues a new agent task |
| `GET` | `/tasks/{task_id}` | Returns the current task state and result |
| `GET` | `/tasks/{task_id}/events` | Returns the execution history for a task |

## Creating a Task

Send a `POST` request to `/tasks`:

```json
{
  "name": "Research task",
  "goal": "Research the benefits of renewable energy and summarize the findings.",
  "agent": "General Agent",
  "provider": "ollama",
  "model": "qwen"
}
```

The `agent`, `provider`, and `model` fields have defaults, so a minimal request can also be:

```json
{
  "name": "Research task",
  "goal": "Research the benefits of renewable energy and summarize the findings."
}
```

A newly created task is returned with an ID and initially has a `queued` status.

## Task Lifecycle

A task can move through the following states:

```text
queued
  |
planning
  |
running
  |
completed
```

If an error occurs during execution, the task is marked as `failed`.

The API model also supports a `waiting_for_approval` state.

Task progress is stored as a percentage and updated while the agent executes the task.

## Agent Execution

When a task is created, FastAPI queues the agent runner as a background task.

The runner:

1. Loads the task from the database.
2. Marks the task as `planning`.
3. Sends the task goal to the configured language model.
4. Checks whether the model requested any tools.
5. Executes requested tools and returns their results to the model.
6. Continues the model/tool loop until a final response is produced.
7. Stores the final result and marks the task as `completed`.

The agent is limited to a maximum of **10 execution steps** per task.

If the maximum is exceeded or another error occurs, the task is marked as `failed`.

## Tools

Tools are registered through the project's tool registry and can be called by the language model during task execution.

Current tools include:

### Calculator

Provides calculation functionality for tasks requiring mathematical operations.

### Web Search

Allows the agent to retrieve external information when a task requires web-based research.

Additional tools can be integrated through the tool registry.

## Task Events

The application records events throughout the execution process, including planning, model calls, tool calls, tool results, completion, and failures.

Execution events can be retrieved with:

```http
GET /tasks/{task_id}/events
```

This provides visibility into how the agent processed a task and which tools were used.

## Project Structure

```text
agent/
├── app/
│   ├── llm/
│   │   ├── registry.py
│   │   └── router.py
│   ├── tools/
│   │   ├── calculator.py
│   │   ├── registry.py
│   │   └── web_search.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── runner.py
├── src/
│   └── agent/
│       └── __init__.py
├── README.md
├── pyproject.toml
└── uv.lock
```

### `app/main.py`

Defines the FastAPI application, application lifecycle, and REST API endpoints.

### `app/runner.py`

Contains the agent execution loop responsible for communicating with the language model, executing tools, tracking progress, and completing tasks.

### `app/models.py`

Defines the Pydantic models used for task creation, validation, status tracking, and API responses.

### `app/database.py`

Handles persistent storage and retrieval of tasks and execution events.

### `app/llm/`

Contains the language model registry and routing system.

### `app/tools/`

Contains the tool registry and implementations available to the agent.

## Development

Run the application with automatic reload while developing:

```bash
uv run uvicorn app.main:app --reload
```

Check the installed dependency tree with:

```bash
uv tree
```

## Author

**Parthin**

GitHub: [@ripconv-one](https://github.com/ripconv-one)

## Project Status

![Status](https://img.shields.io/badge/Status-In%20Progress-yellow?style=for-the-badge)
