import React from 'react';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

export const ErrorMessage = ({ message, onRetry, type = 'error' }) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-600 text-2xl" />;
      case 'info':
        return <FaInfoCircle className="text-blue-600 text-2xl" />;
      default:
        return <FaExclamationTriangle className="text-red-600 text-2xl" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100';
      case 'info':
        return 'bg-blue-100';
      default:
        return 'bg-red-100';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className={`${getBgColor()} p-4 rounded-full mb-4`}>
        {getIcon()}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {type === 'warning' ? 'Warning' : type === 'info' ? 'Information' : 'Error'}
      </h3>
      <p className="text-gray-600 mb-4 max-w-md">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="btn btn-primary"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;