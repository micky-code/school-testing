import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Container,
  Paper
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  School
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

const Container = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    opacity: 0.1,
    zIndex: 0
  }
});

const AuthPaper = styled(Paper)({
  display: 'flex',
  width: '90%',
  maxWidth: '900px',
  minHeight: '600px',
  maxHeight: '80vh',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  margin: '20px',
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center'
});

const LeftSection = styled(Box)({
  flex: '1',
  background: '#FFFFFF',
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '200px',
    background: 'linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)',
    borderRadius: '20px 20px 100% 100%',
    transform: 'scaleX(1.5)'
  }
});

const RightSection = styled(Box)({
  flex: '1',
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#FFFFFF',
  textAlign: 'center',
  position: 'relative',
  zIndex: 1
});

const StyledButton = styled(Button)({
  padding: '12px 40px',
  borderRadius: '30px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #1B5E20 30%, #4CAF50 90%)',
  boxShadow: '0 3px 15px rgba(76, 175, 80, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 20px rgba(76, 175, 80, 0.4)',
  }
});

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  width: '100%',
  maxWidth: '400px',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F5F5F5',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover': {
      backgroundColor: '#EEEEEE',
      '& fieldset': {
        borderColor: '#1B5E20',
      }
    },
    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',
      '& fieldset': {
        borderColor: '#1B5E20',
      }
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    '&.Mui-focused': {
      color: '#1B5E20'
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: '16px'
  }
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
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
      setError('Registration successful! Please log in with your credentials.');
      localStorage.removeItem('registrationSuccess');
    }
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // API call logic would go here
      // For now, simulating successful login
      const userData = {
        username: formData.username,
        // Add other user data as needed
      };
      login(userData); // Store user data in context
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthContainer maxWidth={false}>
      <AuthPaper elevation={0}>
        <LeftSection>
          <Box sx={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <School sx={{ fontSize: 48, color: '#1B5E20', mb: 2 }} />
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 700,
                color: '#1B5E20',
                mb: 1
              }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to your Student Management System account
              </Typography>
            </Box>

            {loginError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {loginError}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <StyledTextField
                fullWidth
                label="Username"
                name="username"
                variant="outlined"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#1B5E20' }} />
                    </InputAdornment>
                  )
                }}
              />

              <StyledTextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#1B5E20' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <StyledButton
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </StyledButton>
            </form>
          </Box>
        </LeftSection>

        <RightSection>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 700,
            mb: 3,
            textAlign: 'center'
          }}>
            New Here?
          </Typography>
          <Typography variant="h6" sx={{ 
            mb: 4,
            textAlign: 'center',
            opacity: 0.9
          }}>
            Sign up and discover a great amount of new opportunities!
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{
              color: '#FFFFFF',
              borderColor: '#FFFFFF',
              borderRadius: '30px',
              padding: '12px 40px',
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#FFFFFF',
                background: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Sign up
          </Button>
        </RightSection>
      </AuthPaper>
    </AuthContainer>
  );
};

export default Login;