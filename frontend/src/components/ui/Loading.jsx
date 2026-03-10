import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colors = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    neutral: 'text-neutral-600',
    white: 'text-white',
  };

  return (
    <svg
      className={`animate-spin ${sizes[size]} ${colors[color]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

const LoadingSkeleton = ({
  className = '',
  lines = 3,
  ...props
}) => {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-neutral-200 rounded animate-pulse"
          style={{
            width: index === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
};

const LoadingPage = ({
  message = 'Loading...',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[200px] ${className}`}
      {...props}
    >
      <LoadingSpinner size="lg" />
      {message && (
        <p className="mt-4 text-neutral-600 text-sm">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
export { LoadingSkeleton, LoadingPage };