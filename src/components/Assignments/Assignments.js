import React, { useState, useEffect } from 'react';
import './Assignments.css';
import { assignmentService } from '../../services/api';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Box,
  Divider,
  LinearProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import format from 'date-fns/format';
import differenceInDays from 'date-fns/differenceInDays';

// Department data with their respective colors
const departments = [
  { id: 'IT', name: 'Information Technology', color: '#2196F3' },
  { id: 'Agronomy', name: 'Agronomy', color: '#4CAF50' },
  { id: 'English', name: 'English', color: '#FF9800' },
  { id: 'Tourism', name: 'Tourism', color: '#9C27B0' },
  { id: 'Social Work', name: 'Social Work', color: '#E91E63' },
];

// Mock teacher data (in a real app, this would come from authentication)
const teacherData = [
  { id: 1, name: 'San Sophar', department: 'IT' },
  { id: 2, name: 'Sophal', department: 'Agronomy' },
  { id: 3, name: 'Michael Chen', department: 'English' },
  { id: 4, name: 'Laura Martinez', department: 'Tourism' },
  { id: 5, name: 'David Wilson', department: 'Social Work' },
];

const AssignmentForm = ({ open, handleClose, handleSubmit, assignment, title }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: new Date(),
    teacher_id: 1, // Default to first teacher
    department: 'IT',
    status: 'active'
  });

  useEffect(() => {
    if (assignment) {
      setFormData({
        ...assignment,
        due_date: new Date(assignment.due_date)
      });
    }
  }, [assignment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      due_date: date
    });
  };

  const onSubmit = () => {
    // Format date for API
    const formattedData = {
      ...formData,
      due_date: format(formData.due_date, 'yyyy-MM-dd')
    };
    handleSubmit(formattedData);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Assignment Title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={formData.description || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={formData.due_date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Teacher</InputLabel>
                <Select
                  name="teacher_id"
                  value={formData.teacher_id}
                  onChange={handleChange}
                  label="Teacher"
                >
                  {teacherData
                    .filter(teacher => teacher.department === formData.department)
                    .map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {assignment ? 'Update' : 'Create'} Assignment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AssignmentCard = ({ assignment, onEdit, onDelete, onChat }) => {
  const department = departments.find(d => d.id === assignment.department) || departments[0];
  const dueDate = new Date(assignment.due_date);
  const daysLeft = differenceInDays(dueDate, new Date());
  
  // Calculate progress color based on days left
  let progressColor = '#4CAF50'; // Green
  if (daysLeft < 0) {
    progressColor = '#F44336'; // Red - overdue
  } else if (daysLeft <= 2) {
    progressColor = '#FF9800'; // Orange - due soon
  }

  // Calculate progress percentage (inverse of days left)
  const maxDays = 14; // Assuming 2 weeks is the standard assignment period
  const progress = Math.max(0, Math.min(100, 100 - (daysLeft / maxDays * 100)));

  return (
    <Card className="assignment-card">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Chip 
            label={assignment.status === 'active' ? 'Active' : 'Completed'} 
            color={assignment.status === 'active' ? 'primary' : 'success'}
            size="small"
          />
          <Chip 
            label={department.id} 
            size="small"
            style={{ backgroundColor: `${department.color}30`, color: department.color }}
          />
        </Box>
        
        <Typography variant="h6" className="assignment-title">
          {assignment.title}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" className="assignment-description">
          {assignment.description}
        </Typography>
        
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="caption" color="textSecondary">
            Due: {format(dueDate, 'MMM dd, yyyy')}
            {daysLeft < 0 
              ? ' (Overdue)' 
              : daysLeft === 0 
                ? ' (Due today)' 
                : ` (${daysLeft} days left)`}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              mt: 0.5, 
              height: 5, 
              borderRadius: 5,
              '& .MuiLinearProgress-bar': {
                backgroundColor: progressColor
              }
            }} 
          />
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="textSecondary">
            Teacher: {teacherData.find(t => t.id === assignment.teacher_id)?.name || 'Unknown'}
          </Typography>
          
          <Box>
            <IconButton size="small" onClick={() => onChat(assignment)}>
              <AssignmentIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onEdit(assignment)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(assignment.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await assignmentService.getAll();
      setAssignments(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAssignment = () => {
    setSelectedAssignment(null);
    setShowForm(true);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowForm(true);
  };

  const handleDeleteAssignment = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentService.delete(id);
        loadAssignments();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedAssignment) {
        await assignmentService.update(selectedAssignment.id, formData);
      } else {
        await assignmentService.add(formData);
      }
      setShowForm(false);
      loadAssignments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChatWithAssignment = (assignment) => {
    // This will be implemented in the Chat component
    console.log('Open chat for assignment:', assignment);
    // Navigate to chat with assignment context
    window.location.href = `/chat?assignment_id=${assignment.id}`;
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filterDepartment && assignment.department !== filterDepartment) return false;
    if (filterStatus && assignment.status !== filterStatus) return false;
    return true;
  });

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading assignments...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Unable to Load Assignments</h3>
      <p>{error}</p>
      <button onClick={loadAssignments}>
        Try Loading Again
      </button>
    </div>
  );

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <div className="header-left">
          <div className="header-icon">
            <AssignmentIcon />
          </div>
          <h1>Assignments</h1>
        </div>
        <div className="header-actions">
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              label="Department"
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddAssignment}
          >
            New Assignment
          </Button>
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="no-assignments">
          <AssignmentIcon style={{ fontSize: 60, opacity: 0.3 }} />
          <Typography variant="h6" color="textSecondary">
            No assignments found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {filterDepartment || filterStatus 
              ? 'Try changing your filters or create a new assignment'
              : 'Create your first assignment to get started'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddAssignment}
            sx={{ mt: 2 }}
          >
            Create Assignment
          </Button>
        </div>
      ) : (
        <Grid container spacing={3} className="assignments-grid">
          {filteredAssignments.map((assignment) => (
            <Grid item xs={12} sm={6} md={4} key={assignment.id}>
              <AssignmentCard 
                assignment={assignment} 
                onEdit={handleEditAssignment}
                onDelete={handleDeleteAssignment}
                onChat={handleChatWithAssignment}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <AssignmentForm 
        open={showForm} 
        handleClose={() => setShowForm(false)} 
        handleSubmit={handleFormSubmit}
        assignment={selectedAssignment}
        title={selectedAssignment ? 'Edit Assignment' : 'Create New Assignment'}
      />
    </div>
  );
};

export default Assignments;
