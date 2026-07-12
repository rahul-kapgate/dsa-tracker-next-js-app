export function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, index) => (
        <tr key={index} className="border-b border-border last:border-b-0">
          <td className="px-5 py-4">
            <div className="h-4 w-8 animate-pulse rounded bg-muted" />
          </td>

          <td className="px-5 py-4">
            <div className="h-4 w-56 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted/60" />
          </td>

          <td className="px-5 py-4">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </td>

          <td className="px-5 py-4">
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          </td>

          <td className="px-5 py-4">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          </td>

          <td className="px-5 py-4">
            <div className="ml-auto flex justify-end gap-2">
              <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
              <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}