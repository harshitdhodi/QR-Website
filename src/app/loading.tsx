import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-[50vh] w-full animate-fade-in px-4 py-12 md:py-16">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-8">
        <Skeleton className="h-9 w-56 rounded-lg" rounded="lg" />
        <Skeleton className="h-[min(40vh,22rem)] w-full max-w-3xl" rounded="lg" />
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 w-full" rounded="lg" />
          <Skeleton className="h-40 w-full" rounded="lg" />
          <Skeleton className="h-40 w-full sm:col-span-2 lg:col-span-1" rounded="lg" />
        </div>
      </div>
    </div>
  );
}
