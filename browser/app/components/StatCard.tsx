type StatCardProps = {
  label: string;
  value: string | number;
  detail?: string;
};

export default function StatCard({
  label,
  value,
  detail,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <p className="text-sm text-zinc-500">{label}</p>

      <p className="mt-2 text-3xl font-semibold text-zinc-100">
        {value}
      </p>

      {detail && (
        <p className="mt-2 text-xs text-zinc-500">
          {detail}
        </p>
      )}
    </div>
  );
}