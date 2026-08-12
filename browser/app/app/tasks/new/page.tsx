"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function NewTaskPage() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>
    ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const taskData = {
        name: formData.get("name"),
        goal: formData.get("goal"),
        agent: formData.get("agent"),
    };

    try {
        const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
        });

        if (!response.ok) {
        throw new Error("Unable to create task.");
        }

        const task = await response.json();

        router.push(`/tasks/${task.id}`);
    } catch {
        setError("Something went wrong while creating the task.");
    } finally {
        setLoading(false);
    }
}

return (
    <main className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-8">
          <div className="text-sm text-zinc-500">
            Agent Command Center
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Agent Online
          </div>
        </header>

        <section className="flex-1 p-8">
          <div className="mx-auto max-w-3xl">

            <Link
              href="/"
              className="text-sm text-zinc-500 transition hover:text-zinc-200"
            >
              ← Back to Command Center
            </Link>

            <div className="mt-6">
              <p className="text-sm uppercase tracking-widest text-zinc-500">
                Tasks
              </p>

              <h1 className="mt-2 text-3xl font-semibold">
                Create Task
              </h1>

              <p className="mt-2 text-zinc-400">
                Give your agent a goal and configure how it should execute it.
              </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
            >

              {/* Task name */}

              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-zinc-300"
                >
                  Task name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Competitor research"
                  className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
                />
              </div>

              {/* Goal */}

              <div>
                <label
                  htmlFor="goal"
                  className="text-sm font-medium text-zinc-300"
                >
                  Goal
                </label>

                <textarea
                  id="goal"
                  name="goal"
                  required
                  rows={6}
                  placeholder="Research our five largest competitors and identify major product, pricing, and market changes..."
                  className="mt-2 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
                />

                <p className="mt-2 text-xs text-zinc-600">
                  Describe the outcome you want the agent to accomplish.
                </p>
              </div>

              {/* Agent */}

              <div>
                <label
                  htmlFor="agent"
                  className="text-sm font-medium text-zinc-300"
                >
                  Agent
                </label>

                <select
                  id="agent"
                  name="agent"
                  className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600"
                >
                  <option>General Agent</option>
                </select>
              </div>

              {/* Execution */}

              <div>
                <p className="text-sm font-medium text-zinc-300">
                  Execution
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                    <input
                      type="radio"
                      name="execution"
                      value="now"
                      defaultChecked
                      className="mr-3"
                    />

                    <span className="text-sm">
                      Run now
                    </span>

                    <p className="ml-6 mt-1 text-xs text-zinc-500">
                      Start execution immediately.
                    </p>
                  </label>

                  <label className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                    <input
                      type="radio"
                      name="execution"
                      value="queue"
                      className="mr-3"
                    />

                    <span className="text-sm">
                      Add to queue
                    </span>

                    <p className="ml-6 mt-1 text-xs text-zinc-500">
                      Wait until the agent is available.
                    </p>
                  </label>
                </div>
              </div>

              {/* Actions */}
              {error && (
                <p className="text-sm text-red-400">
                    {error}
                </p>
                )}


              <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-6">
                <Link
                  href="/"
                  className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition hover:text-zinc-100"
                >
                  Cancel
                </Link>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                {loading ? "Creating..." : "Run Task"}
                </button>
              </div>

            </form>
          </div>
        </section>
      </div>
    </main>
  );
}