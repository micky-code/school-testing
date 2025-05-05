import React, { useState } from 'react';
import { authService } from '../../services/api';
import {
  Box,
  Container,
  Paper,
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
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Email,
  Phone,
  School,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

const Container = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #4CAF50 0%, #1B5E20 100%)',
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
  backgroundColor: '#fff'
});

const LeftSection = styled(Box)({
  background: '#FFFFFF',
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  borderRadius: '20px',
  margin: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '200px',
    background: 'linear-gradient(135deg, #4CAF50 0%, #1B5E20 100%)',
    borderRadius: '20px 20px 100% 100%',
    transform: 'scaleX(1.5)',
    zIndex: 0
  }
});

const RightSection = styled(Box)({
  overflowY: 'auto',
  maxHeight: '100vh',
  '&::-webkit-scrollbar': {
    width: '8px',
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#1B5E20',
    borderRadius: '4px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#2E7D32'
  }
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

const OutlinedButton = styled(Button)({
  borderRadius: '30px',
  padding: '12px 0',
  fontWeight: '600',
  textTransform: 'none',
  fontSize: '1rem',
  color: '#1B5E20',
  border: '2px solid #1B5E20',
  '&:hover': {
    background: 'rgba(27, 94, 32, 0.04)',
    border: '2px solid #1B5E20',
    transform: 'translateY(-2px)'
  },
  '&:disabled': {
    borderColor: '#E0E0E0',
    color: '#9E9E9E'
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

const StyledFormControl = styled(FormControl)({
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
  '& .MuiSelect-select': {
    padding: '16px'
  }
});

const Signup = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    idCard: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = ['Personal Information', 'Account Details'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.idCard.trim()) {
      newErrors.idCard = 'ID Card number is required';
    }
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && validateStep1()) {
      setActiveStep(1);
    } else if (activeStep === 1 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      setSignupError('');
      // Format the data to match what the API expects
      const userData = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        idCard: formData.idCard,
        role: formData.role,
        password: formData.password
      };

      // Call the signup API
      await authService.signup(userData);
      
      // Display success message and redirect to login
      localStorage.setItem('registrationSuccess', 'true');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setSignupError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const renderStep1 = () => (
    <>
      <StyledTextField
        fullWidth
        label="First Name"
        name="firstName"
        variant="outlined"
        value={formData.firstName}
        onChange={handleChange}
        error={!!errors.firstName}
        helperText={errors.firstName}
        sx={{ mb: 2.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person sx={{ color: '#1B5E20' }} />
            </InputAdornment>
          ),
        }}
      />

      <StyledTextField
        fullWidth
        label="Last Name"
        name="lastName"
        variant="outlined"
        value={formData.lastName}
        onChange={handleChange}
        error={!!errors.lastName}
        helperText={errors.lastName}
        sx={{ mb: 2.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person sx={{ color: '#1B5E20' }} />
            </InputAdornment>
          ),
        }}
      />

      <StyledTextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        variant="outlined"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        sx={{ mb: 2.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: '#1B5E20' }} />
            </InputAdornment>
          ),
        }}
      />

      <StyledTextField
        fullWidth
        label="Phone Number"
        name="phone"
        variant="outlined"
        value={formData.phone}
        onChange={handleChange}
        error={!!errors.phone}
        helperText={errors.phone}
        sx={{ mb: 2.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone sx={{ color: '#1B5E20' }} />
            </InputAdornment>
          ),
        }}
      />

      <StyledFormControl fullWidth error={!!errors.role} sx={{ mb: 2.5 }}>
        <InputLabel>Role</InputLabel>
        <Select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <MenuItem value="">Select your role</MenuItem>
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
      </StyledFormControl>
    </>
  );

  const renderStep2 = () => (
    <>
      <StyledTextField
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
              <Person sx={{ color: '#1B5E20' }} />
            </InputAdornment>
          ),
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
        sx={{ mb: 2.5 }}
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
                sx={{ color: '#1B5E20' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <StyledTextField
        fullWidth
        label="Confirm Password"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        variant="outlined"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        sx={{ mb: 2.5 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: '#1B5E20' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleToggleConfirmPasswordVisibility}
                edge="end"
                sx={{ color: '#1B5E20' }}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );

  return (
    <AuthContainer maxWidth={false}>
      <AuthPaper elevation={0}>
        <LeftSection>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 700,
            mb: 3,
            textAlign: 'center'
          }}>
            Already a Member?
          </Typography>
          <Typography variant="h6" sx={{ 
            mb: 4,
            textAlign: 'center',
            opacity: 0.9
          }}>
            Sign in to access your Student Management System account
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
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
            Sign in
          </Button>
        </LeftSection>

        <RightSection>
          <Box sx={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <School sx={{ fontSize: 48, color: '#1B5E20', mb: 2 }} />
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 700,
                color: '#1B5E20',
                mb: 1
              }}>
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join our Student Management System
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ 
              mb: 4,
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#1B5E20'
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: '#1B5E20'
              }
            }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {signupError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {signupError}
              </Alert>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              {activeStep === 0 ? renderStep1() : renderStep2()}

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <OutlinedButton
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    fullWidth
                    disabled={isSubmitting || activeStep === 0}
                  >
                    Previous
                  </OutlinedButton>
                </Grid>
                <Grid item xs={6}>
                  <StyledButton
                    variant="contained"
                    endIcon={activeStep === steps.length - 1 ? null : <ArrowForward />}
                    onClick={handleNext}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {activeStep === steps.length - 1 ? (isSubmitting ? 'Creating Account...' : 'Create Account') : 'Continue'}
                  </StyledButton>
                </Grid>
              </Grid>
            </form>
          </Box>
        </RightSection>
      </AuthPaper>
    </AuthContainer>
  );
};

export default Signup;
