import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaQuestionCircle, FaTrophy, FaPlay } from 'react-icons/fa';

const ExamCard = ({ exam }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {exam.title}
        </h3>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Active
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">
        {exam.description}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <FaClock className="text-blue-500" />
          <div className="text-sm">
            <div className="text-gray-500">Duration</div>
            <div className="font-medium">{exam.duration} min</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <FaQuestionCircle className="text-green-500" />
          <div className="text-sm">
            <div className="text-gray-500">Questions</div>
            <div className="font-medium">{exam.totalQuestions}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <FaTrophy className="text-yellow-500" />
          <div className="text-sm">
            <div className="text-gray-500">Pass Score</div>
            <div className="font-medium">{exam.passingScore}%</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-500">
          Created by: {exam.createdBy?.name || 'Admin'}
        </div>
        
        <Link 
          to={`/exam/${exam._id}`}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FaPlay />
          <span>Start Exam</span>
        </Link>
      </div>
    </div>
  );
};

export default ExamCard;