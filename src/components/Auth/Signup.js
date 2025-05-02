import React, { useState } from 'react';
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
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  School,
  Badge,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
      <TextField
        fullWidth
        label="Full Name"
        name="fullName"
        variant="outlined"
        value={formData.fullName}
        onChange={handleChange}
        error={!!errors.fullName}
        helperText={errors.fullName}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        variant="outlined"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="ID Card Number"
        name="idCard"
        variant="outlined"
        value={formData.idCard}
        onChange={handleChange}
        error={!!errors.idCard}
        helperText={errors.idCard}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Badge color="action" />
            </InputAdornment>
          ),
        }}
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
        {errors.role && (
          <Typography variant="caption" color="error">
            {errors.role}
          </Typography>
        )}
      </FormControl>
    </>
  );

  const renderStep2 = () => (
    <>
      <TextField
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
              <Person color="action" />
            </InputAdornment>
          ),
        }}
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
        sx={{ mb: 3 }}
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
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        variant="outlined"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleToggleConfirmPasswordVisibility}
                edge="end"
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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f7fb',
        padding: 2
      }}
    >
      <Card sx={{ maxWidth: 550, width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
              Create an Account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please fill in the details to sign up for the Student Management System
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
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

          <form>
            {activeStep === 0 ? renderStep1() : renderStep2()}

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={activeStep === 0 ? () => navigate('/login') : handleBack}
                  fullWidth
                  sx={{ 
                    borderRadius: 2,
                    py: 1.2,
                    textTransform: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  {activeStep === 0 ? 'Back to Login' : 'Previous'}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={activeStep === steps.length - 1 ? null : <ArrowForward />}
                  onClick={handleNext}
                  fullWidth
                  sx={{ 
                    borderRadius: 2,
                    py: 1.2,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                  }}
                >
                  {activeStep === steps.length - 1 ? 'Sign Up' : 'Continue'}
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  color="primary"
                  underline="hover"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
