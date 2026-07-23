import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
      {/* Hero Current Weather Skeleton */}
      <div className="h-96 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="w-32 h-4 bg-white/10 rounded" />
            <div className="w-56 h-8 bg-white/10 rounded" />
          </div>
          <div className="w-24 h-8 bg-white/10 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-3xl" />
            <div className="space-y-3">
              <div className="w-36 h-12 bg-white/10 rounded" />
              <div className="w-28 h-4 bg-white/10 rounded" />
            </div>
          </div>
          <div className="h-28 bg-white/5 rounded-2xl" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-white/10 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Recommendations Skeleton */}
      <div className="h-44 bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-6 space-y-4">
        <div className="w-48 h-6 bg-white/10 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Forecast Grid Skeleton */}
      <div className="h-64 bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-6 space-y-4">
        <div className="w-40 h-6 bg-white/10 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-36 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
