import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI, examAPI, resultAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CreateExamModal from '../components/admin/CreateExamModal';
import EditExamModal from '../components/admin/EditExamModal';
import { 
  FaUsers, 
  FaClipboardList, 
  FaTrophy, 
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaChartBar,
  FaCrown,
  FaGraduationCap,
  FaEyeSlash,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [exams, setExams] = useState([]);
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examFilter, setExamFilter] = useState('all'); // 'all', 'active', 'inactive'

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [examsResponse, usersResponse, resultsResponse] = await Promise.all([
        examAPI.getAllExamsAdmin(), // New admin endpoint that gets all exams
        authAPI.getAllUsers(),
        resultAPI.getAllResults()
      ]);

      if (examsResponse.data.success) {
        setExams(examsResponse.data.data.exams);
      }

      if (usersResponse.data.success) {
        setUsers(usersResponse.data.data.users);
      }

      if (resultsResponse.data.success) {
        setResults(resultsResponse.data.data.results);
      }
    } catch (error) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      try {
        const response = await examAPI.deleteExam(examId);
        if (response.data.success) {
          setExams(exams.filter(exam => exam._id !== examId));
          alert('Exam deleted successfully!');
        }
      } catch (error) {
        alert('Failed to delete exam');
      }
    }
  };

  const handleToggleExamStatus = async (examId, currentStatus) => {
    try {
      const response = await examAPI.updateExam(examId, { isActive: !currentStatus });
      if (response.data.success) {
        setExams(exams.map(exam => 
          exam._id === examId 
            ? { ...exam, isActive: !currentStatus }
            : exam
        ));
        alert(`Exam ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      }
    } catch (error) {
      alert('Failed to update exam status');
    }
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setShowEditModal(true);
  };

  const getStats = () => {
    const totalUsers = users.length;
    const totalStudents = users.filter(user => user.role === 'student').length;
    const totalExams = exams.length;
    const activeExams = exams.filter(exam => exam.isActive).length;
    const inactiveExams = totalExams - activeExams;
    const totalResults = results.length;
    const averageScore = results.length > 0 
      ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
      : 0;

    return {
      totalUsers,
      totalStudents,
      totalExams,
      activeExams,
      inactiveExams,
      totalResults,
      averageScore
    };
  };

  const getFilteredExams = () => {
    switch (examFilter) {
      case 'active':
        return exams.filter(exam => exam.isActive);
      case 'inactive':
        return exams.filter(exam => !exam.isActive);
      default:
        return exams;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAdminData} />;

  const stats = getStats();
  const filteredExams = getFilteredExams();

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FaCrown className="text-yellow-300" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-purple-100">
              Manage exams, users, and monitor system performance
            </p>
          </div>
          <div className="hidden md:block">
            <FaGraduationCap className="text-6xl text-purple-300" />
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="card text-center">
          <FaUsers className="text-3xl text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalUsers}</div>
          <div className="text-sm text-gray-500">Total Users</div>
        </div>
        
        <div className="card text-center">
          <FaGraduationCap className="text-3xl text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalStudents}</div>
          <div className="text-sm text-gray-500">Students</div>
        </div>
        
        <div className="card text-center">
          <FaClipboardList className="text-3xl text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.totalExams}</div>
          <div className="text-sm text-gray-500">Total Exams</div>
        </div>

        <div className="card text-center">
          <FaEye className="text-3xl text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.activeExams}</div>
          <div className="text-sm text-gray-500">Active Exams</div>
        </div>

        <div className="card text-center">
          <FaEyeSlash className="text-3xl text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.inactiveExams}</div>
          <div className="text-sm text-gray-500">Inactive Exams</div>
        </div>
        
        <div className="card text-center">
          <FaChartBar className="text-3xl text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{stats.averageScore}%</div>
          <div className="text-sm text-gray-500">Avg Score</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'exams', label: 'Manage Exams' },
            { key: 'users', label: 'Users' },
            { key: 'results', label: 'Results' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
          
          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Exams</h3>
              <div className="space-y-3">
                {exams.slice(0, 5).map(exam => (
                  <div key={exam._id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="font-medium">{exam.title}</div>
                        <div className="text-sm text-gray-500">{exam.totalQuestions} questions</div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        exam.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(exam.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Results</h3>
              <div className="space-y-3">
                {results.slice(0, 5).map(result => (
                  <div key={result._id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{result.userId.name}</div>
                      <div className="text-sm text-gray-500">{result.examId.title}</div>
                    </div>
                    <div className={`text-sm font-medium ${
                      result.score >= 80 ? 'text-green-600' : 
                      result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {result.score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Manage Exams</h2>
            <div className="flex items-center space-x-4">
              {/* Exam Filter */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'all', label: 'All', count: stats.totalExams },
                  { key: 'active', label: 'Active', count: stats.activeExams },
                  { key: 'inactive', label: 'Inactive', count: stats.inactiveExams }
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setExamFilter(filter.key)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      examFilter === filter.key
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <FaPlus />
                <span>Create New Exam</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map(exam => (
              <div key={exam._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{exam.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      exam.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {exam.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleToggleExamStatus(exam._id, exam.isActive)}
                      className={`text-lg ${
                        exam.isActive ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'
                      }`}
                      title={exam.isActive ? 'Deactivate exam' : 'Activate exam'}
                    >
                      {exam.isActive ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{exam.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div>Duration: {exam.duration} minutes</div>
                  <div>Questions: {exam.totalQuestions}</div>
                  <div>Passing Score: {exam.passingScore}%</div>
                  <div>Created: {formatDate(exam.createdAt)}</div>
                  <div className="flex items-center space-x-1">
                    <span>Status:</span>
                    <span className={`font-medium ${
                      exam.isActive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {exam.isActive ? 'Published' : 'Unpublished'}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditExam(exam)}
                    className="btn btn-secondary flex-1 flex items-center justify-center space-x-1"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam._id)}
                    className="btn bg-red-600 text-white hover:bg-red-700 flex-1 flex items-center justify-center space-x-1"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredExams.length === 0 && (
            <div className="text-center py-12">
              <FaClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {examFilter === 'active' ? 'No Active Exams' : 
                 examFilter === 'inactive' ? 'No Inactive Exams' : 'No Exams Found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {examFilter === 'active' ? 'All exams are currently inactive.' : 
                 examFilter === 'inactive' ? 'All exams are currently active.' : 'Create your first exam to get started.'}
              </p>
              {examFilter === 'all' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary"
                >
                  Create First Exam
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attempts
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => {
                    const userResults = results.filter(result => result.userId._id === user._id);
                    return (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {userResults.length} attempts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">All Results</h2>
          
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map(result => (
                    <tr key={result._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{result.userId.name}</div>
                        <div className="text-sm text-gray-500">{result.userId.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{result.examId.title}</div>
                        <div className="text-sm text-gray-500">
                          {result.correctAnswers}/{result.totalQuestions} correct
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-lg font-bold ${
                          result.score >= 80 ? 'text-green-600' : 
                          result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {result.score}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          result.passed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(result.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/result/${result._id}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <FaEye />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateExamModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchAdminData();
          }}
        />
      )}

      {showEditModal && selectedExam && (
        <EditExamModal
          exam={selectedExam}
          onClose={() => {
            setShowEditModal(false);
            setSelectedExam(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedExam(null);
            fetchAdminData();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;