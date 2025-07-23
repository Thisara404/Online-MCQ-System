import React from 'react';

const QuestionCard = ({ 
  question, 
  questionNumber, 
  selectedAnswer, 
  onAnswerSelect, 
  isReview = false 
}) => {
  const handleOptionSelect = (optionValue) => {
    if (!isReview) {
      onAnswerSelect(question._id, optionValue);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Question {questionNumber}
        </h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {question.marks || 1} {question.marks === 1 ? 'mark' : 'marks'}
        </span>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 text-lg leading-relaxed">
          {question.questionText}
        </p>
      </div>

      <div className="space-y-3">
        {question.options?.map((option, index) => {
          const isSelected = selectedAnswer === option.value;
          const isCorrect = isReview && option.value === question.correctOption;
          const isWrong = isReview && isSelected && option.value !== question.correctOption;
          
          let buttonClasses = "w-full text-left p-4 border-2 rounded-lg transition-all duration-200 ";
          
          if (isReview) {
            if (isCorrect) {
              buttonClasses += "border-green-500 bg-green-50 text-green-800";
            } else if (isWrong) {
              buttonClasses += "border-red-500 bg-red-50 text-red-800";
            } else if (isSelected) {
              buttonClasses += "border-gray-300 bg-gray-50";
            } else {
              buttonClasses += "border-gray-300 bg-white";
            }
          } else {
            if (isSelected) {
              buttonClasses += "border-blue-500 bg-blue-50 text-blue-800";
            } else {
              buttonClasses += "border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50";
            }
          }

          return (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              disabled={isReview}
              className={buttonClasses}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium
                  ${isSelected ? 'border-current bg-current text-white' : 'border-gray-400'}
                `}>
                  {option.value}
                </div>
                <span className="flex-1">{option.text}</span>
                {isReview && isCorrect && (
                  <span className="text-green-600 font-medium">✓ Correct</span>
                )}
                {isReview && isWrong && (
                  <span className="text-red-600 font-medium">✗ Wrong</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;