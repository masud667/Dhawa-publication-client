export const BookCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="aspect-[3/4] w-full bg-gray-200"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-full mt-2"></div>
      </div>
    </div>
  );
};