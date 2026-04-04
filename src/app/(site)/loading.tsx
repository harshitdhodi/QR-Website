import { Skeleton } from '@/components/ui/Skeleton';

export default function SiteLoading() {
  return (
    <main className="min-h-[50vh] w-full px-3 py-12 sm:px-6 md:px-14">
      <div className="mx-auto max-w-screen-xl space-y-8 animate-fade-in">
        <div className="flex flex-col items-center gap-4 text-center">
          <Skeleton className="h-12 w-64 max-w-full" rounded="lg" />
          <Skeleton className="h-5 w-96 max-w-full" rounded="md" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-[4/5] w-full max-h-80" rounded="lg" />
          ))}
        </div>
      </div>
    </main>
  );
}
