import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const SkeletonBlock: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-zinc-200/80 ${className}`} />
);

export const PageSkeleton: React.FC<{ lines?: number }> = ({ lines = 6 }) => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
    <div className="w-full space-y-4">
      <SkeletonBlock className="h-4 w-28" />
      <SkeletonBlock className="h-10 w-2/3 max-w-xl" />
      <SkeletonBlock className="h-4 w-full max-w-2xl" />
      <SkeletonBlock className="h-4 w-4/5 max-w-xl" />
    </div>

    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="w-full rounded-2xl border border-zinc-200 bg-white p-4 space-y-4">
          <SkeletonBlock className="h-48 w-full" />
          <SkeletonBlock className="h-4 w-1/3" />
          <SkeletonBlock className="h-5 w-2/3" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  </div>
);

export const BlogArticleSkeleton: React.FC = () => (
  <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
    <SkeletonBlock className="h-4 w-32" />
    <SkeletonBlock className="h-12 w-3/4" />
    <SkeletonBlock className="h-5 w-full max-w-2xl" />
    <SkeletonBlock className="h-80 w-full rounded-2xl" />
    <div className="w-full space-y-4">
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-4/5" />
    </div>
  </div>
);
