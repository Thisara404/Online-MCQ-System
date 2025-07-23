import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessMessage = ({ message, onContinue, buttonText = "Continue" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-green-100 p-4 rounded-full mb-4">
        <FaCheckCircle className="text-green-600 text-2xl" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Success!
      </h3>
      <p className="text-gray-600 mb-4">
        {message}
      </p>
      {onContinue && (
        <button 
          onClick={onContinue}
          className="btn btn-primary"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;