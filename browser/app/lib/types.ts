export type TaskStatus =
  | "queued"
  | "planning"
  | "running"
  | "waiting_for_approval"
  | "completed"
  | "failed";

export type Task = {
  id: string;
  name: string;
  goal: string;
  agent: string;
  status: TaskStatus;
  progress: number;
  createdAt: string;
};

export type AgentEvent = {
  id: string;
  taskId: string;
  type:
    | "task_created"
    | "planning"
    | "thinking"
    | "tool_call"
    | "tool_result"
    | "completed"
    | "failed";
  message: string;
  timestamp: string;
};