import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examAPI } from '../services/api';
import ExamCard from '../components/ExamCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  FaPlayCircle, 
  FaTrophy, 
  FaUsers, 
  FaChartLine,
  FaRocket,
  FaGraduationCap
} from 'react-icons/fa';

const Home = ({ user }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await examAPI.getAllExams();
      
      if (response.data.success) {
        setExams(response.data.data.exams);
      } else {
        setError('Failed to load exams');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: FaGraduationCap,
      title: 'Expert-Designed',
      description: 'Questions crafted by industry professionals',
      color: 'text-blue-600'
    },
    {
      icon: FaTrophy,
      title: 'Instant Results',
      description: 'Get detailed feedback immediately',
      color: 'text-yellow-600'
    },
    {
      icon: FaChartLine,
      title: 'Track Progress',
      description: 'Monitor your learning journey',
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl">
        <div className="max-w-4xl mx-auto px-4">
          <FaRocket className="text-6xl text-blue-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Your Skills with
            <span className="text-blue-600"> MCQ Tests</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Test your knowledge, track your progress, and excel in your learning journey 
            with our comprehensive multiple-choice question platform.
          </p>
          
          {user ? (
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link 
                to="/dashboard" 
                className="btn btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <FaPlayCircle />
                <span>Go to Dashboard</span>
              </Link>
              <Link 
                to="/results" 
                className="btn btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <FaTrophy />
                <span>View Results</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link 
                to="/login" 
                className="btn btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <FaPlayCircle />
                <span>Get Started</span>
              </Link>
              <Link 
                to="/register" 
                className="btn btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <FaUsers />
                <span>Sign Up Free</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to succeed in your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <stat.icon className={`text-2xl ${stat.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {stat.title}
              </h3>
              <p className="text-gray-600">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Available Exams Section */}
      <section className="py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Available Exams
            </h2>
            <p className="text-gray-600">
              Choose from our collection of expertly crafted assessments
            </p>
          </div>
          {user && (
            <Link 
              to="/dashboard" 
              className="btn btn-primary"
            >
              View All
            </Link>
          )}
        </div>

        {loading ? (
          <LoadingSpinner message="Loading exams..." />
        ) : error ? (
          <ErrorMessage 
            message={error}
            onRetry={fetchExams}
            type="error"
          />
        ) : exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.slice(0, 6).map(exam => (
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
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-blue-600 rounded-3xl text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Test Your Knowledge?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of learners who trust our platform to assess and improve their skills.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center space-x-2 bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaRocket />
              <span>Start Learning Today</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;