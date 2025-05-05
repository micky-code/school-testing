import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Verify token is still valid here if needed
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    if (!userData.token) {
      throw new Error('No authentication token provided');
    }
    // Set the token in localStorage and axios headers
    localStorage.setItem('token', userData.token);
    if (window.axios) {
      window.axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (window.axios) {
      delete window.axios.defaults.headers.common['Authorization'];
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user,
      login, 
      logout,
      isAuthenticated: !!user?.isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
