import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { resultAPI } from '../services/api';
import { 
  FaTrophy, 
  FaClock, 
  FaCheck, 
  FaTimes, 
  FaChartPie, 
  FaHome,
  FaRedo 
} from 'react-icons/fa';

const ResultView = ({ user }) => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const response = await resultAPI.getResult(id);
      
      if (response.data.success) {
        setResult(response.data.data.result);
      } else {
        setError('Failed to load result');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load result');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) return <LoadingSpinner message="Loading results..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchResult} />;
  if (!result) return <ErrorMessage message="No result data found" />;

  const isPassed = result.score >= result.examId.passingScore;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Result Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${getScoreBgColor(result.score)}`}>
            {isPassed ? (
              <FaTrophy className={`text-3xl ${getScoreColor(result.score)}`} />
            ) : (
              <FaTimes className="text-3xl text-red-600" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {result.examId.title}
          </h1>
          
          <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.score)}`}>
            {result.score}%
          </div>
          
          <div className={`text-xl font-semibold mb-4 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
            {isPassed ? '🎉 Congratulations! You Passed!' : '😔 You Did Not Pass'}
          </div>
          
          <p className="text-gray-600">
            Passing Score: {result.examId.passingScore}% | 
            Attempted on: {formatDate(result.submittedAt)}
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <FaChartPie className="text-2xl text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{result.score}%</div>
          <div className="text-sm text-gray-500">Overall Score</div>
        </div>
        
        <div className="card text-center">
          <FaCheck className="text-2xl text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{result.correctAnswers}</div>
          <div className="text-sm text-gray-500">Correct Answers</div>
        </div>
        
        <div className="card text-center">
          <FaTimes className="text-2xl text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{result.wrongAnswers}</div>
          <div className="text-sm text-gray-500">Wrong Answers</div>
        </div>
        
        <div className="card text-center">
          <FaClock className="text-2xl text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">
            {formatDuration(result.startTime, result.endTime)}
          </div>
          <div className="text-sm text-gray-500">Time Taken</div>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Breakdown</h2>
        
        <div className="bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className={`h-4 rounded-full ${result.score >= 80 ? 'bg-green-500' : result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${result.score}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Questions:</span>
            <span className="font-semibold ml-2">{result.totalQuestions}</span>
          </div>
          <div>
            <span className="text-gray-500">Correct:</span>
            <span className="font-semibold ml-2 text-green-600">{result.correctAnswers}</span>
          </div>
          <div>
            <span className="text-gray-500">Wrong:</span>
            <span className="font-semibold ml-2 text-red-600">{result.wrongAnswers}</span>
          </div>
          <div>
            <span className="text-gray-500">Accuracy:</span>
            <span className="font-semibold ml-2">{((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <span className={`font-semibold ml-2 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {isPassed ? 'PASSED' : 'FAILED'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Grade:</span>
            <span className="font-semibold ml-2">
              {result.score >= 90 ? 'A+' : 
               result.score >= 80 ? 'A' : 
               result.score >= 70 ? 'B' : 
               result.score >= 60 ? 'C' : 'F'}
            </span>
          </div>
        </div>
      </div>

      {/* Answer Review */}
      {result.answers && result.answers.length > 0 && (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Answer Review</h2>
            <button
              onClick={() => setShowReview(!showReview)}
              className="btn btn-secondary"
            >
              {showReview ? 'Hide Review' : 'Show Review'}
            </button>
          </div>
          
          {showReview && (
            <div className="space-y-6">
              {result.answers.map((answer, index) => (
                <QuestionCard
                  key={answer.questionId._id}
                  question={answer.questionId}
                  questionNumber={index + 1}
                  selectedAnswer={answer.selectedOption}
                  onAnswerSelect={() => {}} // No interaction in review mode
                  isReview={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        <Link 
          to="/dashboard" 
          className="btn btn-primary flex items-center space-x-2"
        >
          <FaHome />
          <span>Back to Dashboard</span>
        </Link>
        
        <Link 
          to={`/exam/${result.examId._id}`} 
          className="btn btn-secondary flex items-center space-x-2"
        >
          <FaRedo />
          <span>Retake Exam</span>
        </Link>
      </div>
    </div>
  );
};

export default ResultView;