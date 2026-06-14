import { Skeleton } from "@/components/ui/skeleton";

const RouteLoadingFallback = () => (
  <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in">
    <Skeleton className="h-8 w-48 mb-6" />
    <Skeleton className="h-5 w-full max-w-md mb-10" />
    <div className="space-y-4">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
    </div>
  </div>
);

export default RouteLoadingFallback;
