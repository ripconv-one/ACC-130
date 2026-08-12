"use client";

import { useCallback, useEffect, useState } from "react";

type Task = {
  id: string;
  name: string;
  goal: string;
  agent: string;
  status:
    | "queued"
    | "planning"
    | "running"
    | "waiting_for_approval"
    | "completed"
    | "failed";
  progress: number;
  created_at: string;
  result: string | null;
  error: string | null;
};

type TaskEvent = {
  id: number;
  task_id: string;
  type: string;
  message: string;
  created_at: string;
};

type TaskExecutionProps = {
  initialTask: Task;
};

export default function TaskExecution({
  initialTask,
}: TaskExecutionProps) {
  const [task, setTask] = useState(initialTask);
  const [events, setEvents] = useState<TaskEvent[]>([]);
  const [connectionError, setConnectionError] = useState(false);

  const refreshTask = useCallback(async () => {
    try {
      const [taskResponse, eventsResponse] = await Promise.all([
        fetch(`/api/tasks/${encodeURIComponent(task.id)}`, {
          cache: "no-store",
        }),
        fetch(`/api/tasks/${encodeURIComponent(task.id)}/events`, {
          cache: "no-store",
        }),
      ]);

      if (!taskResponse.ok || !eventsResponse.ok) {
        throw new Error("Unable to retrieve task.");
      }

      const taskData: Task = await taskResponse.json();
      const eventsData: TaskEvent[] = await eventsResponse.json();

      setTask(taskData);
      setEvents(eventsData);
      setConnectionError(false);

      return taskData.status;
    } catch (error) {
      console.error("Failed to refresh task:", error);
      setConnectionError(true);

      return null;
    }
  }, [task.id]);

  useEffect(() => {
    void refreshTask();

    const interval = window.setInterval(async () => {
      const status = await refreshTask();

      if (status === "completed" || status === "failed") {
        window.clearInterval(interval);
      }
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [refreshTask]);

  return (
    <>
      {/* Main execution area */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Agent activity */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30">
            <div className="border-b border-zinc-800 px-6 py-4">
              <h2 className="font-medium">
                Agent Activity
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Live execution events from the agent.
              </p>
            </div>

            <div className="p-6">
              {connectionError && (
                <div className="mb-5 rounded-lg border border-red-900/60 bg-red-950/20 p-4 text-sm text-red-400">
                  Unable to communicate with the agent service.
                </div>
              )}

              {events.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Waiting for agent activity...
                </p>
              ) : (
                <div className="space-y-6">
                  {events.map((event) => (
                    <Activity
                      key={event.id}
                      time={event.created_at}
                      type={event.type}
                      message={event.message}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task information */}
        <div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <p className="text-sm text-zinc-500">
              Progress
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {task.progress}%
            </p>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-zinc-300 transition-all duration-500"
                style={{
                  width: `${task.progress}%`,
                }}
              />
            </div>

            <div className="mt-6 space-y-4 border-t border-zinc-800 pt-5 text-sm">
              <Info
                label="Agent"
                value={task.agent}
              />

              <Info
                label="Status"
                value={formatStatus(task.status)}
              />

              <Info
                label="Events"
                value={String(events.length)}
              />

              <Info
                label="Created"
                value={formatTime(task.created_at)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Successful task result */}
      {task.result && (
        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Result
          </p>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
            {task.result}
          </p>
        </div>
      )}

      {/* Failed task error */}
      {task.error && (
        <div className="mt-6 rounded-xl border border-red-900/60 bg-red-950/20 p-6">
          <p className="text-sm uppercase tracking-widest text-red-500">
            Execution Failed
          </p>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-red-300">
            {task.error}
          </p>
        </div>
      )}
    </>
  );
}


function Activity({
  time,
  type,
  message,
}: {
  time: string;
  type: string;
  message: string;
}) {
  return (
    <div className="flex gap-5">
      <span className="w-20 shrink-0 font-mono text-xs text-zinc-600">
        {formatTime(time)}
      </span>

      <div>
        <p className="text-sm font-medium capitalize text-zinc-300">
          {type.replaceAll("_", " ")}
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          {message}
        </p>
      </div>
    </div>
  );
}


function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-zinc-500">
        {label}
      </span>

      <span className="text-zinc-300">
        {value}
      </span>
    </div>
  );
}


function formatStatus(status: Task["status"]) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}


function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}