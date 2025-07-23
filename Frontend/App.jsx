import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './src/components/Navbar';
import Footer from './src/components/Footer';
import Home from './src/pages/Home';
import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboard';
import TakeExam from './src/pages/TakeExam';
import Results from './src/pages/Results';
import Result from './src/pages/Result';
import LoadingSpinner from './src/components/LoadingSpinner';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Simple token validation - you can improve this
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({ 
            token, 
            id: payload.id,
            name: payload.name || 'User',
            role: payload.role || 'student'
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return <LoadingSpinner message="Initializing application..." />;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar user={user} onLogout={logout} />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/exam/:id" 
              element={user ? <TakeExam user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/results" 
              element={user ? <Results user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/result/:id" 
              element={user ? <Result user={user} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;