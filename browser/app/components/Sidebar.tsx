import Link from "next/link";

const navigation = [
  { name: "Overview", symbol: "◉", href: "/" },
  { name: "Tasks", symbol: "▷", href: "/tasks" },
  { name: "Agents", symbol: "◇", href: "/agents" },
  { name: "Workflows", symbol: "⟳", href: "/workflows" },
  { name: "Files", symbol: "□", href: "/files" },
  { name: "Knowledge", symbol: "◫", href: "/knowledge" },
  { name: "Activity", symbol: "◷", href: "/activity" },
];

export default function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="flex h-16 items-center border-b border-zinc-800 px-6">
        <Link href="/" className="text-lg font-semibold tracking-wider">
          ACC
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
          >
            <span className="w-5 text-center text-zinc-500">
              {item.symbol}
            </span>

            {item.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-zinc-800 p-3">
        <Link
          href="/settings"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
        >
          <span className="w-5 text-center text-zinc-500">⚙</span>
          Settings
        </Link>
      </div>
    </aside>
  );
}