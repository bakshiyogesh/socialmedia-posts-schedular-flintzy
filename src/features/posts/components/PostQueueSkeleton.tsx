import React from 'react';

export function PostQueueSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading scheduled posts queue">
      {[1, 2].map((section) => (
        <div key={section} className="space-y-3">
          <div className="h-6 w-32 bg-zinc-800/80 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="h-28 rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-40 bg-zinc-800 rounded" />
                  <div className="h-4 w-20 bg-zinc-800 rounded-full" />
                </div>
                <div className="h-3 w-3/4 bg-zinc-800/60 rounded" />
                <div className="h-3 w-1/2 bg-zinc-800/40 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
