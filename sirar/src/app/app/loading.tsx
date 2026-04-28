export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-surface rounded-lg" />
          <div className="h-4 w-72 bg-surface/60 rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-surface rounded-xl" />
      </div>

      {/* Cards row skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 border border-border space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-surface rounded" />
              <div className="h-10 w-10 bg-surface rounded-xl" />
            </div>
            <div className="h-7 w-24 bg-surface rounded-lg" />
            <div className="h-3 w-16 bg-surface/60 rounded" />
          </div>
        ))}
      </div>

      {/* Chart row skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-border h-64 space-y-3"
          >
            <div className="h-4 w-32 bg-surface rounded" />
            <div className="h-44 bg-surface/40 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
