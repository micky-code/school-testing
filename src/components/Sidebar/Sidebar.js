import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import SPILogo from '../../assets/SPI_Logo2.png';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo-container">
        <div className="logo">
          <img src={SPILogo} alt="SPI Logo" className="logo-img" />
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="nav-menu">
        <ul>
          <li className={currentPath === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard">
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </Link>
          </li>
          <li className={currentPath === '/students' ? 'active' : ''}>
            <Link to="/students">
              <span className="nav-icon">👨‍🎓</span>
              <span className="nav-text">Students</span>
            </Link>
          </li>
          <li className={currentPath === '/teachers' ? 'active' : ''}>
            <Link to="/teachers">
              <span className="nav-icon">👨‍🏫</span>
              <span className="nav-text">Teachers</span>
            </Link>
          </li>
          <li className={currentPath === '/courses' ? 'active' : ''}>
            <Link to="/courses">
              <span className="nav-icon">📚</span>
              <span className="nav-text">Courses</span>
            </Link>
          </li>
          
          <li className={currentPath === '/assignments' ? 'active' : ''}>
            <Link to="/assignments">
              <span className="nav-icon">📝</span>
              <span className="nav-text">Assignments</span>
            </Link>
          </li>
          <li className={currentPath === '/chat' ? 'active' : ''}>
            <Link to="/chat">
              <span className="nav-icon">💬</span>
              <span className="nav-text">Chat</span>
            </Link>
          </li>
          {/* <li className={currentPath === '/library' ? 'active' : ''}>
            <Link to="/library">
              <span className="nav-icon">📚</span>
              <span className="nav-text">Library</span>
            </Link>
          </li> */}
          <li className={currentPath === '/attendance' ? 'active' : ''}>
            <Link to="/attendance">
              <span className="nav-icon">📋</span>
              <span className="nav-text">Attendance</span>
            </Link>
          </li>
          <li className={currentPath === '/exam' ? 'active' : ''}>
            <Link to="/exam">
              <span className="nav-icon">📝</span>
              <span className="nav-text">Exam</span>
            </Link>
          </li>
          {/* <li className={currentPath === '/hostel' ? 'active' : ''}>
            <Link to="/hostel">
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Hostel</span>
            </Link>
          </li> */}
          <li className={currentPath === '/account' ? 'active' : ''}>
            <Link to="/account">
              <span className="nav-icon">💰</span>
              <span className="nav-text">Account</span>
            </Link>
          </li>
          {/* <li className={currentPath === '/settings' ? 'active' : ''}>
            <Link to="/settings">
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Settings</span>
            </Link>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
