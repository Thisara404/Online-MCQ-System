import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { examAPI, resultAPI } from '../services/api';
import { FaClock, FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const MCQTest = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startTime] = useState(new Date().toISOString());

  useEffect(() => {
    fetchExamData();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && exam) {
      handleSubmitExam();
    }
  }, [timeLeft, exam]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      const [examResponse, questionsResponse] = await Promise.all([
        examAPI.getExam(id),
        examAPI.getExamQuestions(id)
      ]);

      if (examResponse.data.success && questionsResponse.data.success) {
        const examData = examResponse.data.data.exam;
        const questionsData = questionsResponse.data.data.questions;
        
        setExam(examData);
        setQuestions(questionsData);
        setTimeLeft(examData.duration * 60); // Convert minutes to seconds
      } else {
        setError('Failed to load exam data');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleSubmitExam = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        examId: id,
        answers: questions.map(q => ({
          questionId: q._id,
          selectedOption: answers[q._id] || '',
          timeSpent: Math.floor(Math.random() * 30) + 10 // Random time for demo
        })),
        startTime,
        endTime: new Date().toISOString()
      };

      const response = await resultAPI.submitExam(submissionData);
      
      if (response.data.success) {
        navigate(`/result/${response.data.data.result._id}`);
      } else {
        setError('Failed to submit exam');
        setIsSubmitting(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit exam');
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).filter(key => answers[key]).length;
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) return <LoadingSpinner message="Loading exam..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchExamData} />;
  if (!exam || !questions.length) return <ErrorMessage message="No exam data found" />;

  const currentQ = questions[currentQuestion];
  const timeWarning = timeLeft < 300; // Less than 5 minutes

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
            <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-500">Answered</div>
              <div className="text-lg font-semibold">
                {getAnsweredCount()}/{questions.length}
              </div>
            </div>
            
            <div className={`text-center p-3 rounded-lg ${timeWarning ? 'bg-red-100' : 'bg-blue-100'}`}>
              <FaClock className={`mx-auto mb-1 ${timeWarning ? 'text-red-600' : 'text-blue-600'}`} />
              <div className={`text-lg font-mono font-bold ${timeWarning ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <QuestionCard
            question={currentQ}
            questionNumber={currentQuestion + 1}
            selectedAnswer={answers[currentQ._id]}
            onAnswerSelect={handleAnswerSelect}
          />

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaArrowLeft />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className="btn btn-primary flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  <FaCheck />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Exam'}</span>
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <span>Next</span>
                  <FaArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h3 className="font-semibold text-gray-800 mb-4">Question Navigator</h3>
            
            <div className="grid grid-cols-5 gap-2 mb-4">
              {questions.map((_, index) => {
                const isAnswered = answers[questions[index]._id];
                const isCurrent = index === currentQuestion;
                
                return (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`
                      w-8 h-8 rounded text-sm font-medium transition-colors
                      ${isCurrent 
                        ? 'bg-blue-600 text-white' 
                        : isAnswered 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Current</span>
              </div>
            </div>

            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className="w-full mt-4 btn btn-primary bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQTest;