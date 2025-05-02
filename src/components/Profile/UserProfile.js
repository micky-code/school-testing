import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Divider,
  Button,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  School,
  Home,
  Badge,
  Edit,
  Save,
  Close,
  VerifiedUser,
  Security,
  Notifications,
  History,
  CameraAlt
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Custom styled components
const ProfileImage = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  margin: '0 auto 16px',
  position: 'relative'
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  borderRadius: 12,
  overflow: 'visible',
  position: 'relative'
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
  height: 120,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  position: 'relative'
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  alignItems: 'center'
}));

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [userData, setUserData] = useState({
    id: 1,
    fullName: 'San Sophar',
    username: 'sansophar',
    email: 'san.sophar@example.com',
    phone: '+855 12 345 678',
    address: 'Phnom Penh, Cambodia',
    department: 'IT',
    role: 'Teacher',
    idCard: 'T2023456789',
    joinDate: '2022-08-15',
    classAssigned: ['CS101', 'CS202', 'WEB303'],
    profileImage: null,
    status: 'Active'
  });
  
  const [formData, setFormData] = useState({...userData});
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setFormData({...userData});
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    // In a real app, this would make an API call to update the user data
    setUserData({...formData});
    setEditing(false);
    setSnackbar({
      open: true,
      message: 'Profile updated successfully',
      severity: 'success'
    });
  };

  const handleOpenPhotoDialog = () => {
    setOpenPhotoDialog(true);
  };

  const handleClosePhotoDialog = () => {
    setOpenPhotoDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({...snackbar, open: false});
  };

  const renderProfileInfo = () => (
    <Box sx={{ px: 3, pb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InfoItem>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Person color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Full Name" 
              secondary={userData.fullName} 
              primaryTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
              secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
            />
          </InfoItem>
          
          <InfoItem>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Email color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Email" 
              secondary={userData.email} 
              primaryTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
              secondaryTypographyProps={{ variant: 'body1' }}
            />
          </InfoItem>
          
          <InfoItem>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Phone color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Phone" 
              secondary={userData.phone} 
              primaryTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
              secondaryTypographyProps={{ variant: 'body1' }}
            />
          </InfoItem>
          
          <InfoItem>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Home color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Address" 
              secondary={userData.address} 
              primaryTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
              secondaryTypographyProps={{ variant: 'body1' }}
            />
          </InfoItem>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <InfoItem>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Badge color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="ID Card" 
              secondary={userData.idCard} 
              primaryTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
              secondaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
            />
          </InfoItem>
          
          <InfoItem>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <School color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Department" 
              secondary={userData.department} 
              primaryTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
              secondaryTypographyProps={{ variant: 'body1' }}
            />
          </InfoItem>
          
          <InfoItem>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <VerifiedUser color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Role" 
              secondary={userData.role} 
              primaryTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
              secondaryTypographyProps={{ variant: 'body1' }}
            />
          </InfoItem>
          
          <InfoItem>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <History color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Join Date" 
              secondary={new Date(userData.joinDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} 
              primaryTypographyProps={{ variant: 'caption', color: 'textSecondary' }}
              secondaryTypographyProps={{ variant: 'body1' }}
            />
          </InfoItem>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Classes Assigned
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {userData.classAssigned.map((className) => (
            <Chip 
              key={className} 
              label={className} 
              color="primary" 
              variant="outlined" 
              size="small" 
            />
          ))}
        </Box>
      </Box>
    </Box>
  );

  const renderEditForm = () => (
    <Box sx={{ px: 3, pb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <Person color="action" sx={{ mr: 1 }} />
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <Email color="action" sx={{ mr: 1 }} />
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <Phone color="action" sx={{ mr: 1 }} />
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <Home color="action" sx={{ mr: 1 }} />
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ID Card"
            name="idCard"
            value={formData.idCard}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <Badge color="action" sx={{ mr: 1 }} />
              ),
            }}
          />
          
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              name="department"
              value={formData.department}
              onChange={handleChange}
              label="Department"
              startAdornment={
                <School color="action" sx={{ mr: 1 }} />
              }
            >
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="Agronomy">Agronomy</MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Tourism">Tourism</MenuItem>
              <MenuItem value="Social Work">Social Work</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
              startAdornment={
                <VerifiedUser color="action" sx={{ mr: 1 }} />
              }
            >
              <MenuItem value="Teacher">Teacher</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Parent">Parent</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handleCancel}
          startIcon={<Close />}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          startIcon={<Save />}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return editing ? renderEditForm() : renderProfileInfo();
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Security Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Security />
                </ListItemIcon>
                <ListItemText primary="Change Password" secondary="Update your password" />
                <Button variant="outlined" size="small">Change</Button>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText primary="Two-Factor Authentication" secondary="Add an extra layer of security" />
                <Button variant="outlined" size="small">Enable</Button>
              </ListItem>
            </List>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email />
                </ListItemIcon>
                <ListItemText primary="Email Notifications" secondary="Receive updates via email" />
                <Chip label="Enabled" color="success" size="small" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText primary="Push Notifications" secondary="Receive alerts on your device" />
                <Chip label="Disabled" color="default" size="small" />
              </ListItem>
            </List>
          </Box>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3, px: 2, backgroundColor: '#f5f7fb', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProfileCard>
            <ProfileHeader />
            <Box sx={{ position: 'relative', top: -60, mb: -60, textAlign: 'center' }}>
              <ProfileImage src={userData.profileImage || '/placeholder-avatar.jpg'} alt={userData.fullName}>
                {!userData.profileImage && userData.fullName.charAt(0)}
              </ProfileImage>
              <IconButton 
                size="small" 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  right: '50%', 
                  transform: 'translateX(60px)',
                  backgroundColor: 'white',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onClick={handleOpenPhotoDialog}
              >
                <CameraAlt fontSize="small" />
              </IconButton>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {userData.fullName}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {userData.role} - {userData.department}
              </Typography>
              <Chip
                label={userData.status}
                color={userData.status === 'Active' ? 'success' : 'default'}
                size="small"
                sx={{ mb: 2 }}
              />
            </Box>
            
            <Divider />
            
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                  <Tab label="Profile" />
                  <Tab label="Security" />
                  <Tab label="Notifications" />
                </Tabs>
                
                {tabValue === 0 && !editing && (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
              
              <Divider />
              
              {renderTabContent()}
            </Box>
          </ProfileCard>
        </Grid>
      </Grid>
      
      {/* Photo Upload Dialog */}
      <Dialog open={openPhotoDialog} onClose={handleClosePhotoDialog}>
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
              >
                Choose Photo
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePhotoDialog}>Cancel</Button>
          <Button color="primary" onClick={handleClosePhotoDialog}>Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
