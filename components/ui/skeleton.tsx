import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-3 sm:p-4">
        <Skeleton className="h-3 w-1/3 mb-2" />
        <Skeleton className="h-5 w-5/6 mb-2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="p-3 sm:p-4 pt-0 flex items-center justify-between">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] overflow-hidden rounded-lg bg-gray-100">
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-0 flex flex-col justify-center px-6">
        <Skeleton className="h-10 w-3/4 mb-4 max-w-md" />
        <Skeleton className="h-4 w-2/3 mb-2 max-w-sm" />
        <Skeleton className="h-4 w-1/2 mb-6 max-w-xs" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  );
} 