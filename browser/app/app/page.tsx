import Link from "next/link";


import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import OperationCard from "@/components/OperationCard";

export default function Home() {
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
          <div className="mx-auto max-w-7xl">
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Overview
            </p>

            <div className="mt-2 flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-semibold">
                  Command Center
                </h1>

                <p className="mt-2 text-zinc-400">
                  Monitor, control, and deploy your AI agents.
                </p>
              </div>

              <Link
                href="/tasks/new"
                className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white"
              >
                + New Task
              </Link>
            </div>

            {/* Statistics */}

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Active Tasks"
                value={3}
                detail="2 agents currently working"
              />

              <StatCard
                label="Queued"
                value={2}
                detail="Waiting for execution"
              />

              <StatCard
                label="Completed"
                value={147}
                detail="Last 30 days"
              />

              <StatCard
                label="Agent Status"
                value="Online"
                detail="All systems operational"
              />
            </div>

            {/* Main dashboard */}

            <div className="mt-8 grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/30">
                  <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
                    <div>
                      <h2 className="font-medium">
                        Active Operations
                      </h2>

                      <p className="mt-1 text-sm text-zinc-500">
                        Tasks currently being executed.
                      </p>
                    </div>

                    <button className="text-sm text-zinc-500 hover:text-zinc-200">
                      View all
                    </button>
                  </div>

                  <div className="px-6">
                    <OperationCard
                      title="Competitor Research"
                      description="Searching websites and collecting market intelligence."
                      status="running"
                      progress={68}
                    />

                    <OperationCard
                      title="Analyze Customer Dataset"
                      description="Processing customer records and identifying patterns."
                      status="running"
                      progress={34}
                    />

                    <OperationCard
                      title="Weekly Intelligence Report"
                      description="Report generated successfully."
                      status="completed"
                    />
                  </div>
                </div>
              </div>

              {/* Quick actions */}

              <div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                  <h2 className="font-medium">
                    Quick Actions
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Launch common agent operations.
                  </p>

                  <div className="mt-5 space-y-2">
                    <button className="w-full rounded-lg border border-zinc-800 px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-900">
                      + Create new task
                    </button>

                    <button className="w-full rounded-lg border border-zinc-800 px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-900">
                      ▶ Run workflow
                    </button>

                    <button className="w-full rounded-lg border border-zinc-800 px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-900">
                      ◇ Manage agents
                    </button>

                    <button className="w-full rounded-lg border border-zinc-800 px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-900">
                      ◷ View activity
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}