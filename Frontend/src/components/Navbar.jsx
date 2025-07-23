import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaHome, FaTachometerAlt, FaClipboardList, FaCrown } from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-lg">
              MCQ
            </div>
            <span className="text-xl font-semibold text-gray-800">
              System
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaHome />
              <span>Home</span>
            </Link>

            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FaTachometerAlt />
                  <span>Dashboard</span>
                </Link>

                <Link 
                  to="/results" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FaClipboardList />
                  <span>My Results</span>
                </Link>

                {/* Admin Link */}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <FaCrown />
                    <span>Admin</span>
                  </Link>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-4 border-l pl-6 ml-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      <FaUser className={`text-sm ${
                        user.role === 'admin' ? 'text-purple-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-800 font-medium">{user.name}</div>
                      <div className={`text-xs ${
                        user.role === 'admin' ? 'text-purple-600' : 'text-gray-500'
                      }`}>
                        {user.role === 'admin' ? '👑 Admin' : 'Student'}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;