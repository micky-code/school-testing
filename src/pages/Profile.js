import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Container,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  School,
  Badge as BadgeIcon,
  Badge,
  Edit,
  Save,
  Close,
  VerifiedUser,
  Security,
  Notifications,
  History,
  CameraAlt,
  Check,
  Assignment,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components for Profile page
const ProfileCard = styled(Paper)(({ theme }) => ({
  borderRadius: 4,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  marginBottom: theme.spacing(3)
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1976d2, #2196f3)',
  height: 120,
  position: 'relative',
  padding: theme.spacing(3),
  color: 'white'
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: '4px solid white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  fontSize: 42,
  fontWeight: 300,
  color: 'rgba(0,0,0,0.6)',
  backgroundColor: '#e0e0e0'
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 4,
  height: '100%',
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
  display: 'flex',
  flexDirection: 'column'
}));

const InfoListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 0),
  borderBottom: '1px solid #f0f0f0'
}));

const AvatarUploadButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 3,
  right: 3,
  backgroundColor: '#1976d2',
  color: 'white',
  width: 28,
  height: 28,
  padding: '4px',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  borderRadius: 8,
  overflow: 'hidden'
}));

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Mock data for testing
  const userData = {
    fullName: 'srdvp',
    username: 'srdvp',
    email: 'srdvp@example.com',
    phone: '+1 (555) 123-4567',
    role: 'admin',
    department: 'it',
    joinDate: 'April 2023',
    status: 'active',
    bio: 'Experienced educator with a passion for technology and innovation in education. Dedicated to improving student outcomes through data-driven approaches.',
    skills: ['Leadership', 'Curriculum Development', 'Data Analysis', 'Student Mentoring', 'Educational Technology']
  };
  
  const stats = [
    { id: 'students', label: 'Students', value: 125, icon: <School fontSize="small"/>, color: '#1976d2' },
    { id: 'assignments', label: 'Assignments', value: 5, icon: <Assignment fontSize="small"/>, color: '#4caf50' },
    { id: 'notifications', label: 'Notifications', value: 8, icon: <Notifications fontSize="small"/>, color: '#ff9800' },
    { id: 'rating', label: 'Rating', value: 4.8, icon: <VerifiedUser fontSize="small"/>, color: '#9c27b0' },
    { id: 'courses', label: 'Courses', value: 12, icon: <Badge fontSize="small"/>, color: '#e91e63' },
    { id: 'experience', label: 'Experience', value: '5 yrs', icon: <History fontSize="small"/>, color: '#795548' }
  ];
  
  const departments = [
    { id: 'it', name: 'IT', color: '#1976d2' },
    { id: 'cs', name: 'CS', color: '#2196f3' },
    { id: 'ec', name: 'EC', color: '#4caf50' },
    { id: 'ee', name: 'EE', color: '#ff9800' },
    { id: 'me', name: 'ME', color: '#9c27b0' }
  ];
  
  // Initialize from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // If we have user data in localStorage, use it to enhance our default data
        if (parsedUser.fullName) {
          setFormData({
            ...userData,
            fullName: parsedUser.fullName,
            username: parsedUser.username || userData.username,
            role: parsedUser.role || userData.role
          });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Simulate loading effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Event handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleEdit = () => {
    setFormData(userData);
    setEditing(true);
  };
  
  const handleCancel = () => {
    setEditing(false);
    setFormData(null);
  };
  
  const handleSave = () => {
    // In a real app, you would save this to a backend API
    setSnackbar({
      open: true,
      message: 'Profile updated successfully',
      severity: 'success'
    });
    setEditing(false);
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // In a real app, you would upload this file to a server
      setSnackbar({
        open: true,
        message: 'Profile photo updated',
        severity: 'success'
      });
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 64px)',
        p: 3
      }}>
        <Typography variant="body1" color="textPrimary" sx={{ mb: 1 }}>
          Loading profile information...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Profile Header Card */}
      <ProfileCard>
        {/* Blue Header */}
        <ProfileHeader>
          <Typography variant="body2" sx={{ position: 'absolute', bottom: 16, left: 24 }}>
            Member since {userData.joinDate}
          </Typography>
        </ProfileHeader>
        
        {/* Profile Info */}
        <Box sx={{ px: 3, pt: 8, pb: 3, position: 'relative' }}>
          {/* Avatar positioned over the header */}
          <Box sx={{ position: 'absolute', top: -50, left: 24 }}>
            <Box sx={{ position: 'relative' }}>
              <ProfileAvatar>{userData.fullName.charAt(0).toUpperCase()}</ProfileAvatar>
              <AvatarUploadButton onClick={handleAvatarClick}>
                <CameraAlt fontSize="small" />
              </AvatarUploadButton>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handleFileChange}
              />
            </Box>
          </Box>
          
          {/* User Info */}
          <Box sx={{ ml: { xs: 0, sm: 16 }, mt: { xs: 6, sm: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 500, color: '#333' }}>
                  {userData.fullName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {userData.role}
                  </Typography>
                  <Chip
                    label={userData.status}
                    color="success"
                    size="small"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                </Box>
              </Box>
              
              {!editing && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          
            {/* Stats */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              {stats.map(stat => (
                <Grid item xs={12} md={6}>
                  <StatCard>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      About Me
                    </Typography>
                    {editing ? (
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Write something about yourself"
                        variant="outlined"
                        size="small"
                        defaultValue={userData.bio}
                        sx={{ mt: 1 }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {userData.bio || 'No bio information available. Click edit to add your bio.'}
                      </Typography>
                    )}
                    
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                      Skills
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {userData.skills && userData.skills.map((skill, index) => (
                        <Chip 
                          key={index} 
                          label={skill} 
                          size="small" 
                          sx={{ 
                            bgcolor: `${stats[index % stats.length].color}15`,
                            color: stats[index % stats.length].color,
                            fontWeight: 500
                          }} 
                        />
                      ))}
                      {editing && (
                        <Chip 
                          icon={<Edit fontSize="small" />}
                          label="Add Skill" 
                          size="small" 
                          variant="outlined"
                          sx={{ cursor: 'pointer' }}
                        />
                      )}
                    </Box>
                  </StatCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </ProfileCard>
      
      {/* Tabs Section */}
      <ProfileCard>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3, borderBottom: '1px solid #e0e0e0' }}
          >
            <Tab label="Profile" icon={<Person />} iconPosition="start" />
            <Tab label="Security" icon={<Security />} iconPosition="start" />
            <Tab label="Department" icon={<BadgeIcon />} iconPosition="start" />
          </Tabs>
        </Box>
        
        {/* Tab Panels */}
        <Box sx={{ p: 3 }}>
          {/* Profile Tab */}
          {tabValue === 0 && (
            <Box>
              {editing ? (
                // Edit Form
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={formData ? formData.fullName : userData.fullName}
                      onChange={handleChange}
                      margin="normal"
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
                      value={formData ? formData.email : userData.email}
                      onChange={handleChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData ? formData.username : userData.username}
                      onChange={handleChange}
                      margin="normal"
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
                      label="Phone"
                      name="phone"
                      value={formData ? formData.phone : userData.phone}
                      onChange={handleChange}
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        startIcon={<Close />}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        startIcon={<Save />}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                // View Mode
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: '#444' }}>
                      Personal Information
                    </Typography>
                    <List disablePadding>
                      <InfoListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Person sx={{ color: '#1976d2', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2" color="text.secondary">Full Name</Typography>}
                          secondary={<Typography variant="body1" sx={{ mt: 0.5 }}>{userData.fullName}</Typography>}
                          disableTypography
                        />
                      </InfoListItem>
                      
                      <InfoListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Email sx={{ color: '#1976d2', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2" color="text.secondary">Email</Typography>}
                          secondary={<Typography variant="body1" sx={{ mt: 0.5 }}>{userData.email}</Typography>}
                          disableTypography
                        />
                      </InfoListItem>
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: '#444' }}>
                      Account Information
                    </Typography>
                    <List disablePadding>
                      <InfoListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Person sx={{ color: '#1976d2', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2" color="text.secondary">Username</Typography>}
                          secondary={<Typography variant="body1" sx={{ mt: 0.5 }}>{userData.username}</Typography>}
                          disableTypography
                        />
                      </InfoListItem>
                      
                      <InfoListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Phone sx={{ color: '#1976d2', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography variant="body2" color="text.secondary">Phone</Typography>}
                          secondary={<Typography variant="body1" sx={{ mt: 0.5 }}>{userData.phone}</Typography>}
                          disableTypography
                        />
                      </InfoListItem>
                    </List>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
          
          {/* Security Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 500 }}>
                Security Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Security color="primary" /> Change Password
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      margin="normal"
                    />
                    
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      margin="normal"
                    />
                    
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      margin="normal"
                    />
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        variant="contained" 
                        startIcon={<Save />}
                        sx={{ borderRadius: 2 }}
                      >
                        Update Password
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <History color="primary" /> Account Activity
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                      <ListItem divider>
                        <ListItemIcon>
                          <Box sx={{ 
                            width: 36, 
                            height: 36, 
                            borderRadius: '8px', 
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            color: '#1976d2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Person fontSize="small" />
                          </Box>
                        </ListItemIcon>
                        <ListItemText 
                          primary="Login Successful"
                          secondary={
                            <>
                              <Typography variant="caption" display="block" color="text.secondary">
                                {new Date().toLocaleString()}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                Chrome • 192.168.1.105
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Department Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Select Your Department
              </Typography>
              
              <Grid container spacing={2}>
                {departments.map((dept) => (
                  <Grid item xs={6} sm={4} md={3} key={dept.id}>
                    <Paper 
                      sx={{ 
                        p: 2,
                        border: dept.id === userData.department ? `1px solid ${dept.color}` : '1px solid #e0e0e0',
                        bgcolor: dept.id === userData.department ? `${dept.color}10` : 'white',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          borderColor: dept.color
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: '8px', 
                          bgcolor: `${dept.color}15`, 
                          color: dept.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem',
                          mr: 1.5
                        }}
                      >
                        {dept.id.charAt(0).toUpperCase()}
                      </Box>
                      <Typography variant="body2" fontWeight={500}>
                        {dept.name}
                      </Typography>
                      {userData.department === dept.id && (
                        <Check 
                          sx={{ 
                            ml: 'auto', 
                            color: dept.color, 
                            fontSize: 18 
                          }} 
                        />
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Department Information
                </Typography>
                <Paper sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    The {departments.find(d => d.id === userData.department)?.name || 'IT'} department is responsible for managing and maintaining the school's technology infrastructure, developing educational software, and providing technical support to staff and students.
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mr: 1 }}>Department Head:</Typography>
                    <Typography variant="body2">Dr. James Wilson</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mr: 1 }}>Contact:</Typography>
                    <Typography variant="body2">it.department@school.edu</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mr: 1 }}>Location:</Typography>
                    <Typography variant="body2">Building C, Floor 2</Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}
          

        </Box>
      </ProfileCard>
      
      {/* Photo Dialog */}
      <Dialog open={openPhotoDialog} onClose={() => setOpenPhotoDialog(false)}>
        <DialogTitle>Update Profile Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-photo-upload"
              type="file"
            />
            <label htmlFor="profile-photo-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CameraAlt />}
                sx={{ borderRadius: 2 }}
              >
                Choose Photo
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPhotoDialog(false)}>Cancel</Button>
          <Button color="primary" onClick={() => setOpenPhotoDialog(false)}>Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity || "success"} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
