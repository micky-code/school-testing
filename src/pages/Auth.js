import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Grid,
  Tabs,
  Tab,
  Divider,
  Alert,
  Chip,
  Avatar
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Lock, 
  School, 
  Email, 
  Badge,
  ArrowForward,
  HowToReg
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import the same styling patterns from your Dashboard redesign
import { styled } from '@mui/material/styles';

// Use the same card styling as in your Dashboard
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  borderRadius: 16,
  transition: 'transform 0.2s ease-in-out',
  overflow: 'hidden'
}));

// Stat card styling similar to your Dashboard
const AuthCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#fff',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  }
}));

const Auth = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    role: ''
  });
  
  // Signup form state
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    username: '',
    email: '',
    idCard: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  
  // Form validation errors
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  
  // Department data that matches your filtering feature
  const departments = [
    { id: 1, name: 'IT', color: '#1976d2', icon: '💻' },
    { id: 2, name: 'Agronomy', color: '#4caf50', icon: '🌱' },
    { id: 3, name: 'English', color: '#9c27b0', icon: '📚' },
    { id: 4, name: 'Tourism', color: '#ff9800', icon: '✈️' },
    { id: 5, name: 'Social Work', color: '#f44336', icon: '🤝' }
  ];
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setAuthError('');
  };
  
  // Handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value
    });
    if (loginErrors[name]) {
      setLoginErrors({
        ...loginErrors,
        [name]: ''
      });
    }
  };
  
  // Handle signup form changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm({
      ...signupForm,
      [name]: value
    });
    if (signupErrors[name]) {
      setSignupErrors({
        ...signupErrors,
        [name]: ''
      });
    }
  };
  
  // Validate login form
  const validateLoginForm = () => {
    const errors = {};
    if (!loginForm.username.trim()) errors.username = 'Username is required';
    if (!loginForm.password) errors.password = 'Password is required';
    if (!loginForm.role) errors.role = 'Please select a role';
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate signup form
  const validateSignupForm = () => {
    const errors = {};
    if (!signupForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!signupForm.username.trim()) errors.username = 'Username is required';
    if (!signupForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(signupForm.email)) {
      errors.email = 'Invalid email address';
    }
    if (!signupForm.idCard.trim()) errors.idCard = 'ID Card is required';
    if (!signupForm.role) errors.role = 'Please select a role';
    if (!signupForm.password) {
      errors.password = 'Password is required';
    } else if (signupForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!signupForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (signupForm.password !== signupForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      // Simulate API loading
      setAuthError('');
      const loadingMessage = 'Authenticating...'; 
      setAuthError(loadingMessage);
      
      // Simulate API call with timeout
      setTimeout(() => {
        // Here you would connect with your authentication API
        console.log('Login form submitted:', loginForm);
        
        // For demo purposes, simulate a successful login
        localStorage.setItem('user', JSON.stringify({
          username: loginForm.username,
          role: loginForm.role,
          fullName: loginForm.username, // This would come from API in real implementation
          isAuthenticated: true
        }));
        
        // Trigger storage event for App.js to detect
        window.dispatchEvent(new Event('storage'));
        
        // Navigate to dashboard
        navigate('/dashboard');
      }, 1000);
    }
  };
  
  // Handle signup submission
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (validateSignupForm()) {
      // Simulate API loading
      setAuthError('');
      const loadingMessage = 'Creating account...'; 
      setAuthError(loadingMessage);
      
      // Simulate API call with timeout
      setTimeout(() => {
        // Here you would connect with your registration API
        console.log('Signup form submitted:', signupForm);
        
        // Store user data in localStorage (for demo)
        // In a real app, this would be stored in a database
        localStorage.setItem('registeredUsers', JSON.stringify([
          {
            fullName: signupForm.fullName,
            username: signupForm.username,
            email: signupForm.email,
            idCard: signupForm.idCard,
            role: signupForm.role
          }
        ]));
        
        // Switch to login tab
        setTabValue(0);
        
        // Clear signup form
        setSignupForm({
          fullName: '',
          username: '',
          email: '',
          idCard: '',
          role: '',
          password: '',
          confirmPassword: ''
        });
        
        // Pre-fill login form with the registered username
        setLoginForm({
          ...loginForm,
          username: signupForm.username,
          role: signupForm.role
        });
        
        // Show success message
        setAuthError('Account created successfully! Please sign in with your credentials.');
      }, 1000);
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', // Added for vertical centering
      alignItems: 'center', // Added for horizontal centering
      bgcolor: '#f5f7fb',
      p: { xs: 2, md: 4 } 
    }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              textAlign: 'center', 
              color: '#1976d2',
              mb: 1
            }}
          >
            Student Management System
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center', 
              color: 'text.secondary',
              mb: 4
            }}
          >
            Login or create an account to access the system
          </Typography>
          
          {/* Featured Departments - Using the same styling as your Students component filter */}
          <Box sx={{ mb: 5 }}>
            <Typography 
              variant="h6" 
              component="h2" 
              sx={{ 
                fontWeight: 600, 
                mb: 2,
                color: 'text.primary' 
              }}
            >
              Featured Departments
            </Typography>
            
            <Grid container spacing={2}>
              {departments.map((dept) => (
                <Grid item xs={6} sm={4} md={2.4} key={dept.id}>
                  <Card 
                    sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 45, 
                        height: 45, 
                        borderRadius: '12px', 
                        bgcolor: `${dept.color}15`, 
                        color: dept.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        mb: 1
                      }}
                    >
                      {dept.icon}
                    </Box>
                    <Typography variant="body2" fontWeight={600} align="center">
                      {dept.name}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* Auth Forms */}
          <StyledCard>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="auth tabs"
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    py: 2
                  }
                }}
              >
                <Tab label="Login" />
                <Tab label="Create Account" />
              </Tabs>
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              {authError && (
                <Alert 
                  severity={
                    authError.includes('successfully') ? 'success' : 
                    authError.includes('Authenticating') || authError.includes('Creating') ? 'info' : 
                    'error'
                  }
                  sx={{ mb: 3 }}
                >
                  {authError}
                </Alert>
              )}
              
              {/* Login Tab */}
              {tabValue === 0 && (
                <Box component="form" onSubmit={handleLoginSubmit} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={loginForm.username}
                    onChange={handleLoginChange}
                    error={!!loginErrors.username}
                    helperText={loginErrors.username}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    error={!!loginErrors.password}
                    helperText={loginErrors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                  
                  <FormControl fullWidth sx={{ mb: 4 }} error={!!loginErrors.role}>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                      labelId="role-select-label"
                      id="role-select"
                      name="role"
                      value={loginForm.role}
                      onChange={handleLoginChange}
                      label="Role"
                      startAdornment={
                        <InputAdornment position="start">
                          <School color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Select your role</em>
                      </MenuItem>
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="teacher">Teacher</MenuItem>
                      <MenuItem value="admin">Administrator</MenuItem>
                      <MenuItem value="parent">Parent</MenuItem>
                    </Select>
                    {loginErrors.role && (
                      <Typography variant="caption" color="error">
                        {loginErrors.role}
                      </Typography>
                    )}
                  </FormControl>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 4px 10px rgba(25, 118, 210, 0.25)',
                      position: 'relative'
                    }}
                    disabled={authError === 'Authenticating...'}
                  >
                    {authError === 'Authenticating...' ? 'Signing In...' : 'Sign In'}
                  </Button>
                  
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{' '}
                      <Button 
                        color="primary" 
                        onClick={() => setTabValue(1)}
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                      >
                        Create one
                      </Button>
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {/* Signup Tab */}
              {tabValue === 1 && (
                <Box component="form" onSubmit={handleSignupSubmit} noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="fullName"
                        label="Full Name"
                        name="fullName"
                        autoComplete="name"
                        value={signupForm.fullName}
                        onChange={handleSignupChange}
                        error={!!signupErrors.fullName}
                        helperText={signupErrors.fullName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={signupForm.username}
                        onChange={handleSignupChange}
                        error={!!signupErrors.username}
                        helperText={signupErrors.username}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={signupForm.email}
                        onChange={handleSignupChange}
                        error={!!signupErrors.email}
                        helperText={signupErrors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="idCard"
                        label="ID Card Number"
                        name="idCard"
                        value={signupForm.idCard}
                        onChange={handleSignupChange}
                        error={!!signupErrors.idCard}
                        helperText={signupErrors.idCard}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Badge color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!signupErrors.role}>
                        <InputLabel id="signup-role-label">Role</InputLabel>
                        <Select
                          labelId="signup-role-label"
                          id="signup-role"
                          name="role"
                          value={signupForm.role}
                          onChange={handleSignupChange}
                          label="Role"
                          startAdornment={
                            <InputAdornment position="start">
                              <School color="action" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="">
                            <em>Select your role</em>
                          </MenuItem>
                          <MenuItem value="student">Student</MenuItem>
                          <MenuItem value="teacher">Teacher</MenuItem>
                          <MenuItem value="admin">Administrator</MenuItem>
                          <MenuItem value="parent">Parent</MenuItem>
                        </Select>
                        {signupErrors.role && (
                          <Typography variant="caption" color="error">
                            {signupErrors.role}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        value={signupForm.password}
                        onChange={handleSignupChange}
                        error={!!signupErrors.password}
                        helperText={signupErrors.password}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={signupForm.confirmPassword}
                        onChange={handleSignupChange}
                        error={!!signupErrors.confirmPassword}
                        helperText={signupErrors.confirmPassword}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      mt: 4,
                      py: 1.5, 
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 4px 10px rgba(25, 118, 210, 0.25)'
                    }}
                    endIcon={authError === 'Creating account...' ? null : <HowToReg />}
                    disabled={authError === 'Creating account...'}
                  >
                    {authError === 'Creating account...' ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <Button 
                        color="primary" 
                        onClick={() => setTabValue(0)}
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                      >
                        Sign in
                      </Button>
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Auth;
