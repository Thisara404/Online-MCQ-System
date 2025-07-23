import React from 'react';

const LoadingSpinner = ({ size = 'default', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="border-4 border-blue-200 border-t-blue-600 rounded-full w-full h-full"></div>
      </div>
      {message && (
        <p className="mt-3 text-gray-600 text-sm">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;