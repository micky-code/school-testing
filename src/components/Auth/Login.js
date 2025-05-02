import React, { useState, useEffect } from 'react';
import { authService } from '../../services/api';
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
  Link,
  Divider,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock, School } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

const GradientCard = styled(Card)({
  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  overflow: 'hidden',
});

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976d2, #2196f3)',
  borderRadius: '8px',
  padding: '12px 0',
  fontWeight: '600',
  letterSpacing: '0.5px',
  '&:hover': {
    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
  },
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '12px 0',
  fontWeight: '600',
  letterSpacing: '0.5px',
  border: '2px solid #1976d2',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
    border: '2px solid #1565c0',
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const registrationSuccess = localStorage.getItem('registrationSuccess');
    if (registrationSuccess === 'true') {
      setLoginError('Registration successful! Please log in with your credentials.');
      localStorage.removeItem('registrationSuccess');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setIsSubmitting(true);
        setLoginError('');
        
        const response = await authService.login({
          username: formData.username,
          password: formData.password
        });
        
        if (response && response.user) {
          if (response.user.role !== formData.role) {
            setLoginError(`You don't have access as a ${formData.role}. Please select the correct role.`);
            return;
          }
          
          localStorage.setItem('user', JSON.stringify({
            ...response.user,
            isAuthenticated: true
          }));
          
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginError(error.message || 'Invalid credentials. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: 2
      }}
    >
      <GradientCard sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ p: 5 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700, 
              background: 'linear-gradient(45deg, #1976d2, #00bcd4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your Student Management System account
            </Typography>
          </Box>

          {loginError && (
            <Alert severity={loginError.includes('successful') ? 'success' : 'error'} sx={{ mb: 3 }}>
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              size="medium"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="medium"
            />

            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }} error={!!errors.role}>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
                size="medium"
              >
                <MenuItem value="">
                  <em>Select your role</em>
                </MenuItem>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="parent">Parent</MenuItem>
              </Select>
              {errors.role && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                  {errors.role}
                </Typography>
              )}
            </FormControl>

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mb: 2 }}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </StyledButton>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Link 
                href="#" 
                underline="hover" 
                variant="body2" 
                color="text.secondary"
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                Forgot Password?
              </Link>
              <Link 
                href="/signup" 
                underline="hover" 
                variant="body2" 
                color="text.secondary"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/signup');
                }}
                sx={{ '&:hover': { color: 'primary.main' } }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                or continue with
              </Typography>
            </Divider>

            <OutlinedButton
              fullWidth
              variant="outlined"
              onClick={() => navigate('/guest')}
            >
              Guest Access
            </OutlinedButton>
          </form>
        </CardContent>
      </GradientCard>
    </Box>
  );
};

export default Login;