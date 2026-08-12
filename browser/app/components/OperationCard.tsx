type OperationCardProps = {
  title: string;
  description: string;
  status: "running" | "completed" | "queued";
  progress?: number;
};

export default function OperationCard({
  title,
  description,
  status,
  progress,
}: OperationCardProps) {
  return (
    <div className="border-b border-zinc-800 py-5 last:border-0">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`h-2 w-2 rounded-full ${
                status === "running"
                  ? "bg-green-500"
                  : status === "completed"
                    ? "bg-blue-500"
                    : "bg-zinc-600"
              }`}
            />

            <h3 className="font-medium text-zinc-200">
              {title}
            </h3>
          </div>

          <p className="ml-5 mt-1 text-sm text-zinc-500">
            {description}
          </p>
        </div>

        <span className="text-xs uppercase tracking-wider text-zinc-500">
          {progress !== undefined ? `${progress}%` : status}
        </span>
      </div>

      {progress !== undefined && (
        <div className="ml-5 mt-4 h-1 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-zinc-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}