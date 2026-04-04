import { cn } from '@/lib/cn';

type SkeletonProps = {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
};

const roundedMap = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-xl",
  full: "rounded-full",
};

/** Subtle pulse block for loading states (respects reduced motion via CSS). */
export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200/80",
        roundedMap[rounded],
        className
      )}
      aria-hidden
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-busy aria-live="polite">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4 w-full", i === lines - 1 && "w-4/5")} />
      ))}
    </div>
  );
}
