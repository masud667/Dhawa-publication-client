import { LoaderCircle } from 'lucide-react';

const Loader = ({
  fullScreen = false,
  text = 'লোড হচ্ছে...',
  size = 'md',
}) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-4
        ${fullScreen ? 'min-h-screen' : 'min-h-[300px]'}
      `}
    >
      {/* Loader */}
      <div className="relative flex items-center justify-center">
        <div
          className={`
            absolute rounded-full border-4
            border-emerald-100
            ${sizes[size]}
          `}
        />

        <LoaderCircle
          className={`
            animate-spin text-emerald-700
            ${sizes[size]}
          `}
          strokeWidth={2.5}
        />
      </div>

      {/* Loading text */}
      {text && (
        <p className="font-medium text-gray-500">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;