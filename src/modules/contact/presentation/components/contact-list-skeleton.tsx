export function ContactListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3 animate-pulse"
        >
          <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="flex justify-end">
            <div className="h-6 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}