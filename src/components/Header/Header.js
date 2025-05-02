import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import userAvatar from '../../assets/images/user-avatar.png';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: 'Guest',
    fullName: 'Guest User',
    role: 'Student',
    email: '',
    profileImage: null
  });

  // Get user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          username: parsedUser.username || 'Guest',
          fullName: parsedUser.fullName || 'Guest User',
          role: parsedUser.role || 'Student',
          email: parsedUser.email || '',
          profileImage: parsedUser.profileImage || null
        });
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);
  
  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('user');
    console.log('Logging out...');
    // Close dropdown
    setShowDropdown(false);
    // Redirect to login page
    navigate('/login');
  };
  
  const handleQuickProfileEdit = (e) => {
    e.preventDefault();
    const name = e.target.elements.fullName.value;
    const email = e.target.elements.email.value;
    
    // Update user in localStorage
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...storedUser,
        fullName: name,
        email: email
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUserData({
        ...userData,
        fullName: name,
        email: email
      });
      
      // Close modal
      setShowProfileModal(false);
    } catch (e) {
      console.error('Error updating profile:', e);
    }
  };
  
  const handleDropdownItemClick = () => {
    // Close dropdown after clicking
    setShowDropdown(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="welcome-text">Welcome to SPI</h2>
      </div>
      
      <div className="search-bar">
        <input type="text" placeholder="Search" />
        <button className="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
      </div>
      
      <div className="header-right">
        <div className="notification-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
          </svg>
          <span className="notification-badge">2</span>
        </div>
        
        <div className="user-profile">
          <div className="profile-wrapper" onClick={() => setShowDropdown(!showDropdown)}>
            <img 
              src={userData.profileImage || "/pf.png"} 
              alt="User Avatar" 
              className="user-avatar" 
            />
            <span className="user-name">{userData.fullName || "User"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </div>
          {showDropdown && (
            <div className="profile-dropdown" style={{ width: '280px' }}>
              <div className="dropdown-item" style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <img 
                    src={userData.profileImage || "/pf.png"} 
                    alt="User Avatar" 
                    style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '12px' }} 
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{userData.fullName}</div>
                    <div style={{ color: '#718096', fontSize: '12px' }}>{userData.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#4a5568' }}>
                  {userData.email || userData.username}
                </div>
                <button 
                  style={{ 
                    marginTop: '8px', 
                    background: '#1976d2', 
                    color: 'white', 
                    border: 'none', 
                    padding: '5px 12px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowDropdown(false);
                  }}
                >
                  Edit Profile
                </button>
              </div>

              <Link to="/profile" className="dropdown-item" onClick={handleDropdownItemClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
                <span>View Profile</span>
              </Link>
              <Link to="/settings" className="dropdown-item" onClick={handleDropdownItemClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492a3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
                </svg>
                <span>Settings</span>
              </Link>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item logout" onClick={() => handleLogout()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Profile Edit Modal */}
      {showProfileModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Edit Profile</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleQuickProfileEdit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Full Name
                </label>
                <input 
                  name="fullName"
                  defaultValue={userData.fullName}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                  Email
                </label>
                <input 
                  name="email"
                  type="email"
                  defaultValue={userData.email}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  style={{
                    background: 'none',
                    border: '1px solid #ddd',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    background: '#1976d2',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
