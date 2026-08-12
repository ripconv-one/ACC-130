import Link from "next/link";
import { notFound } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import TaskExecution from "@/components/TaskExecution";

const AGENT_API_URL =
  process.env.AGENT_API_URL ?? "http://127.0.0.1:8000";

type TaskPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TaskPage({
  params,
}: TaskPageProps) {
  const { id } = await params;

  const response = await fetch(
    `${AGENT_API_URL}/tasks/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    notFound();
  }

  const task = await response.json();

  return (
    <main className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-8">
          <span className="text-sm text-zinc-500">
            Agent Command Center
          </span>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Agent Online
          </div>
        </header>

        <section className="flex-1 p-8">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/"
              className="text-sm text-zinc-500 transition hover:text-zinc-200"
            >
              ← Command Center
            </Link>

            <div className="mt-6">
              <p className="text-sm uppercase tracking-widest text-zinc-500">
                {task.id}
              </p>

              <h1 className="mt-2 text-3xl font-semibold">
                {task.name}
              </h1>

              <p className="mt-2 max-w-3xl text-zinc-400">
                {task.goal}
              </p>
            </div>

            <TaskExecution initialTask={task} />
          </div>
        </section>
      </div>
    </main>
  );
}