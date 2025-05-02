import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Students from './components/Students/Students';
import Teachers from './components/Teachers/Teachers';
import Courses from './components/Courses/Courses';
import Assignments from './components/Assignments/Assignments';
import Chat from './components/Chat/Chat';
import Attendance from './components/Attendance/Attendance';
import Exam from './components/Exam/Exam';
import Account from './components/Account/Account';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

const Settings = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Settings Page</h2>
      <p>This is a placeholder for the settings page.</p>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on initial load and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(user !== null);
    };
    
    // Check immediately
    checkAuth();
    
    // Listen for storage events (like when logging out from another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public route - login page */}
          <Route path="/login" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />
          
          {/* Protected routes */}
          <Route path="*" element={
            isAuthenticated ? (
              <>
                <Sidebar isCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
                <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                  <Header />
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/teachers" element={<Teachers />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/assignments" element={<Assignments />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/exam" element={<Exam />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </div>
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;