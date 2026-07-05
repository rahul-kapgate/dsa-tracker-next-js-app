export function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr key={index} className="border-b border-white/10 last:border-b-0">
          <td className="px-5 py-4">
            <div className="h-4 w-8 animate-pulse rounded bg-white/10" />
          </td>

          <td className="px-5 py-4">
            <div className="h-4 w-56 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-3 w-32 animate-pulse rounded bg-white/5" />
          </td>

          <td className="px-5 py-4">
            <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
          </td>

          <td className="px-5 py-4">
            <div className="h-6 w-20 animate-pulse rounded-full bg-white/10" />
          </td>

          <td className="px-5 py-4">
            <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
          </td>

          <td className="px-5 py-4">
            <div className="ml-auto flex justify-end gap-2">
              <div className="h-9 w-9 animate-pulse rounded-lg bg-white/10" />
              <div className="h-9 w-9 animate-pulse rounded-lg bg-white/10" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}