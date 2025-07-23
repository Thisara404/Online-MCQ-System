import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examAPI, resultAPI } from '../services/api';
import ExamCard from '../components/ExamCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  FaPlay, 
  FaTrophy, 
  FaClock, 
  FaChartLine,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaEye
} from 'react-icons/fa';

const Dashboard = ({ user }) => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('exams');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsResponse, resultsResponse] = await Promise.all([
        examAPI.getAllExams(),
        resultAPI.getMyResults()
      ]);

      if (examsResponse.data.success) {
        setExams(examsResponse.data.data.exams);
      }

      if (resultsResponse.data.success) {
        setResults(resultsResponse.data.data.results);
      }
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const totalExams = exams.length;
    const attemptedExams = results.length;
    const passedExams = results.filter(result => result.passed).length;
    const averageScore = results.length > 0 
      ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
      : 0;

    return {
      totalExams,
      attemptedExams,
      passedExams,
      averageScore
    };
  };

  const stats = getStats();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-blue-100">
              Ready to challenge yourself with a new exam?
            </p>
          </div>
          <div className="hidden md:block">
            <FaGraduationCap className="text-6xl text-blue-300" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <FaPlay className="text-3xl text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalExams}</div>
          <div className="text-sm text-gray-500">Available Exams</div>
        </div>
        
        <div className="card text-center">
          <FaClock className="text-3xl text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.attemptedExams}</div>
          <div className="text-sm text-gray-500">Attempts</div>
        </div>
        
        <div className="card text-center">
          <FaTrophy className="text-3xl text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.passedExams}</div>
          <div className="text-sm text-gray-500">Passed</div>
        </div>
        
        <div className="card text-center">
          <FaChartLine className="text-3xl text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.averageScore}%</div>
          <div className="text-sm text-gray-500">Avg Score</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('exams')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'exams'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Available Exams ({stats.totalExams})
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Results ({stats.attemptedExams})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'exams' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Available Exams</h2>
          </div>

          {exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map(exam => (
                <ExamCard key={exam._id} exam={exam} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Exams Available</h3>
              <p className="text-gray-600">Check back later for new assessments.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">My Results</h2>
            <Link to="/results" className="btn btn-secondary">
              View All Results
            </Link>
          </div>

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.slice(0, 5).map(result => (
                <div key={result._id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {result.examId.title}
                        </h3>
                        {result.passed ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-600" />
                        )}
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Score: {result.score}%</span>
                        <span>•</span>
                        <span>Attempted: {formatDate(result.createdAt)}</span>
                        <span>•</span>
                        <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                          {result.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          result.score >= 80 ? 'text-green-600' : 
                          result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {result.score}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.correctAnswers}/{result.totalQuestions}
                        </div>
                      </div>
                      <Link 
                        to={`/result/${result._id}`}
                        className="btn btn-secondary flex items-center space-x-1"
                      >
                        <FaEye />
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Yet</h3>
              <p className="text-gray-600 mb-4">Take your first exam to see your results here.</p>
              <button
                onClick={() => setActiveTab('exams')}
                className="btn btn-primary"
              >
                Browse Exams
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;