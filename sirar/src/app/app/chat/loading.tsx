export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-7rem)] -m-4 lg:-m-6 gap-0 animate-pulse">
      <div className="hidden md:flex w-56 bg-white border-s border-border flex-col shrink-0 p-3">
        <div className="h-10 bg-surface rounded-xl mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 bg-surface/50 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="flex-1 bg-surface flex flex-col">
        <div className="flex-1 p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-3 items-start max-w-2xl mx-auto w-full"
            >
              <div className="w-8 h-8 rounded-full bg-white shrink-0" />
              <div className="flex-1 max-w-md space-y-2">
                <div className="bg-white rounded-2xl p-4 h-16" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-white border-t border-border">
          <div className="max-w-2xl mx-auto h-11 bg-surface rounded-xl" />
        </div>
      </div>
      <div className="hidden lg:flex w-80 bg-white border-s border-border" />
    </div>
  );
}
