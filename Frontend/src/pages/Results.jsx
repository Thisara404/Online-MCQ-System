import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resultAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  FaTrophy, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaEye,
  FaChartLine,
  FaClock,
  FaRedo
} from 'react-icons/fa';

const Results = ({ user }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, passed, failed

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await resultAPI.getMyResults();
      
      if (response.data.success) {
        setResults(response.data.data.results);
      } else {
        setError('Failed to load results');
      }
    } catch (error) {
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResults = () => {
    switch (filter) {
      case 'passed':
        return results.filter(result => result.passed);
      case 'failed':
        return results.filter(result => !result.passed);
      default:
        return results;
    }
  };

  const getStats = () => {
    const totalAttempts = results.length;
    const passedCount = results.filter(result => result.passed).length;
    const averageScore = results.length > 0 
      ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
      : 0;
    const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;

    return {
      totalAttempts,
      passedCount,
      averageScore,
      passRate
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) return <LoadingSpinner message="Loading your results..." />;

  if (error) return <ErrorMessage message={error} onRetry={fetchResults} />;

  const stats = getStats();
  const filteredResults = getFilteredResults();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
          <p className="text-gray-600 mt-1">
            Track your performance and progress over time
          </p>
        </div>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <FaChartLine className="text-3xl text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalAttempts}</div>
          <div className="text-sm text-gray-500">Total Attempts</div>
        </div>
        
        <div className="card text-center">
          <FaCheckCircle className="text-3xl text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.passedCount}</div>
          <div className="text-sm text-gray-500">Passed</div>
        </div>
        
        <div className="card text-center">
          <FaTrophy className="text-3xl text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.averageScore}%</div>
          <div className="text-sm text-gray-500">Average Score</div>
        </div>
        
        <div className="card text-center">
          <FaRedo className="text-3xl text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.passRate}%</div>
          <div className="text-sm text-gray-500">Pass Rate</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Results', count: results.length },
            { key: 'passed', label: 'Passed', count: stats.passedCount },
            { key: 'failed', label: 'Failed', count: results.length - stats.passedCount }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Results List */}
      {filteredResults.length > 0 ? (
        <div className="space-y-4">
          {filteredResults.map(result => (
            <div key={result._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {result.examId.title}
                    </h3>
                    {result.passed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" />
                        PASSED
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FaTimesCircle className="mr-1" />
                        FAILED
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {result.examId.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FaClock />
                      <span>Attempted: {formatDate(result.createdAt)}</span>
                    </div>
                    <div>
                      Questions: {result.correctAnswers}/{result.totalQuestions}
                    </div>
                    <div>
                      Time: {result.timeTaken} min
                    </div>
                    <div>
                      Passing Score: {result.examId.passingScore}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className={`
                      text-3xl font-bold px-4 py-2 rounded-lg
                      ${getScoreColor(result.score)} ${getScoreBg(result.score)}
                    `}>
                      {result.score}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Score
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to={`/result/${result._id}`}
                      className="btn btn-primary flex items-center space-x-1"
                    >
                      <FaEye />
                      <span>View Details</span>
                    </Link>
                    <Link 
                      to={`/exam/${result.examId._id}`}
                      className="btn btn-secondary flex items-center space-x-1"
                    >
                      <FaRedo />
                      <span>Retake</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No Results Yet' : 
             filter === 'passed' ? 'No Passed Exams' : 'No Failed Exams'}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' ? 'Take your first exam to see results here.' :
             filter === 'passed' ? 'Keep practicing to pass your exams!' : 'Great job! No failed exams to show.'}
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Browse Exams
          </Link>
        </div>
      )}
    </div>
  );
};

export default Results;