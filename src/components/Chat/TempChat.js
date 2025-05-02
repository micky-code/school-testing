import React, { useState, useEffect, useRef } from 'react';
import { chatService, assignmentService } from '../../services/api';
import {
  Typography,
  Grid,
  Avatar,
  TextField,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Paper,
  InputAdornment,
  Chip,
  CircularProgress,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FilterListIcon from '@mui/icons-material/FilterList';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ChatIcon from '@mui/icons-material/Chat';
import { format } from 'date-fns';

// Sample data for teachers and students
const teachers = [
  { id: 1, name: 'San Sophar', department: 'IT', avatar: null },
  { id: 2, name: 'Sophal', department: 'Agronomy', avatar: null },
  { id: 3, name: 'Michael Chen', department: 'English', avatar: null },
  { id: 4, name: 'Laura Martinez', department: 'Tourism', avatar: null },
  { id: 5, name: 'David Wilson', department: 'Social Work', avatar: null },
];

const students = [
  { id: 1, name: 'SR DVP', department: 'IT', avatar: null },
  { id: 2, name: 'Chhoun Senghok', department: 'IT', avatar: null },
  { id: 3, name: 'San Soklai', department: 'IT', avatar: null },
  { id: 4, name: 'Ny Kimsri', department: 'Agronomy', avatar: null },
  { id: 5, name: 'Srey Pov', department: 'Agronomy', avatar: null },
  { id: 6, name: 'Eva White', department: 'English', avatar: null },
  { id: 7, name: 'Frank Lee', department: 'English', avatar: null },
  { id: 8, name: 'George Brown', department: 'Tourism', avatar: null },
  { id: 9, name: 'Helen Garcia', department: 'Tourism', avatar: null },
  { id: 10, name: 'Ian Clark', department: 'Social Work', avatar: null },
];

// Mock current user
const currentUser = {
  id: 1,
  name: 'San Sophar',
  type: 'teacher',
  department: 'IT'
};

// Helper function for date formatting
const formatDate = (date, formatStr) => {
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return new Date(date).toLocaleDateString();
  }
};

const Chat = () => {
  // State variables
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [attachmentMenuAnchor, setAttachmentMenuAnchor] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // References
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const wsRef = useRef(null);

  // Load initial data
  useEffect(() => {
    // Setup mock data for demo
    const mockConversations = [
      ...teachers.map(teacher => ({
        ...teacher,
        type: 'teacher',
      })),
      ...students.map(student => ({
        ...student,
        type: 'student',
      }))
    ].filter(c => c.id !== currentUser.id);
    
    setConversations(mockConversations);
    
    // Mock assignments
    const mockAssignments = [
      { id: 1, title: 'Final Project', due_date: '2025-05-15' },
      { id: 2, title: 'Midterm Exam', due_date: '2025-04-30' },
      { id: 3, title: 'Research Paper', due_date: '2025-06-10' }
    ];
    
    setAssignments(mockAssignments);
    
    // Mock online users
    setOnlineUsers(new Set([2, 3, 5, 8]));

    // Mock WebSocket connection
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Filter conversations by department and search
  const getFilteredConversations = () => {
    return conversations.filter(conv => {
      const matchesDepartment = selectedDepartment === 'all' || conv.department === selectedDepartment;
      const matchesSearch = !searchQuery || 
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesDepartment && matchesSearch;
    });
  };

  // Handle selecting a conversation
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    // Generate mock messages for demo
    const mockMessages = [];
    const messageCount = Math.floor(Math.random() * 10) + 3;
    
    for (let i = 0; i < messageCount; i++) {
      const isFromCurrentUser = i % 2 === 0;
      mockMessages.push({
        id: i + 1,
        content: isFromCurrentUser 
          ? `This is a message to ${conversation.name}` 
          : `Hello ${currentUser.name}, this is a reply from ${conversation.name}`,
        sender_id: isFromCurrentUser ? currentUser.id : conversation.id,
        sender_type: isFromCurrentUser ? currentUser.type : conversation.type,
        receiver_id: isFromCurrentUser ? conversation.id : currentUser.id,
        receiver_type: isFromCurrentUser ? conversation.type : currentUser.type,
        timestamp: new Date(Date.now() - (messageCount - i) * 3600000).toISOString(),
        status: 'read',
        type: 'text'
      });
    }
    
    setMessages(mockMessages);
  };

  // Handle department filter
  const handleDepartmentFilter = (department) => {
    setSelectedDepartment(department);
    setFilterAnchorEl(null);
  };

  // Check if a user is online
  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    // Mock file upload
    console.log('Uploading file:', file.name);
    // In a real implementation, this would call chatService.uploadFile
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    
    files.forEach(file => {
      handleFileUpload(file);
    });
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    const newMessage = {
      id: Date.now(),
      content: messageText,
      sender_id: currentUser.id,
      sender_type: currentUser.type,
      receiver_id: selectedConversation.id,
      receiver_type: selectedConversation.type,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };

  // Handle attachment menu
  const handleAttachmentClick = (event) => {
    setAttachmentMenuAnchor(event.currentTarget);
  };

  const handleAttachmentMenuClose = () => {
    setAttachmentMenuAnchor(null);
  };

  // Handle selecting an assignment
  const handleSelectAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setDrawerOpen(false);
  };

  // Render message bubbles with a professional style
  const renderMessages = () => {
    return (
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column',
          bgcolor: '#f5f7fb' 
        }}
      >
        {messages.map((message) => {
          const isFromCurrentUser = message.sender_id === currentUser.id;
          
          return (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: isFromCurrentUser ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              {!isFromCurrentUser && (
                <Avatar 
                  sx={{ 
                    mr: 1, 
                    bgcolor: message.sender_type === 'teacher' ? '#1976d2' : '#9c27b0',
                    width: 36, 
                    height: 36
                  }}
                >
                  {message.sender_type === 'teacher' ? <PersonIcon /> : <SchoolIcon />}
                </Avatar>
              )}
              
              <Box>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: isFromCurrentUser ? '#1976d2' : 'white',
                    color: isFromCurrentUser ? 'white' : 'inherit',
                    borderRadius: 2,
                    maxWidth: '70%',
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                </Paper>
                
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isFromCurrentUser ? 'flex-end' : 'flex-start',
                    mt: 0.5
                  }}
                >
                  <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                    {formatDate(message.timestamp, 'h:mm a')}
                  </Typography>
                  
                  {isFromCurrentUser && (
                    <DoneAllIcon 
                      sx={{ 
                        ml: 0.5, 
                        fontSize: 14,
                        color: message.status === 'read' ? '#4caf50' : '#bdbdbd'
                      }} 
                    />
                  )}
                </Box>
              </Box>
              
              {isFromCurrentUser && (
                <Avatar 
                  sx={{ 
                    ml: 1, 
                    bgcolor: '#1976d2',
                    width: 36, 
                    height: 36
                  }}
                >
                  <PersonIcon />
                </Avatar>
              )}
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fb', borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: '#333' }}>
            Messaging
          </Typography>
          
          <Tooltip title="Filter by Department">
            <IconButton
              color="primary"
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Select Assignment">
            <IconButton color="primary" onClick={() => setDrawerOpen(true)}>
              <AssignmentIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
      >
        <MenuItem onClick={() => handleDepartmentFilter('all')}>
          All Departments
        </MenuItem>
        {Array.from(new Set(teachers.map(t => t.department))).map(dept => (
          <MenuItem key={dept} onClick={() => handleDepartmentFilter(dept)}>
            {dept}
          </MenuItem>
        ))}
      </Menu>

      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Grid container spacing={0} sx={{ height: '100%' }}>
          {/* Conversations List */}
          <Grid item xs={12} md={4} sx={{ borderRight: 1, borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: '#f5f7fb' }
                }}
              />
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              overflowX: 'auto',
              p: 1.5, 
              borderBottom: '1px solid #f0f0f0',
              '&::-webkit-scrollbar': { height: 6 },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#e0e0e0', borderRadius: 10 }
            }}>
              {['IT', 'Agronomy', 'English', 'Tourism', 'Social Work'].map(dept => (
                <Chip
                  key={dept}
                  label={dept}
                  clickable
                  onClick={() => handleDepartmentFilter(dept)}
                  sx={{
                    mr: 1,
                    bgcolor: selectedDepartment === dept ? '#e3f2fd' : '#f5f7fb',
                    color: selectedDepartment === dept ? '#1976d2' : '#616161',
                    borderColor: selectedDepartment === dept ? '#bbdefb' : 'transparent',
                    border: '1px solid',
                    '&:hover': {
                      bgcolor: selectedDepartment === dept ? '#e3f2fd' : '#f0f0f0'
                    }
                  }}
                />
              ))}
            </Box>
            
            <List sx={{ flexGrow: 1, overflow: 'auto', py: 0 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : getFilteredConversations().length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  p: 4,
                  color: '#9e9e9e'
                }}>
                  <ChatIcon sx={{ fontSize: 40, color: '#bdbdbd', mb: 2 }} />
                  <Typography variant="body2" color="textSecondary" align="center">
                    {searchQuery
                      ? "No conversations match your search"
                      : selectedDepartment !== 'all'
                        ? `No conversations in ${selectedDepartment} department`
                        : "No conversations yet"}
                  </Typography>
                  {(searchQuery || selectedDepartment !== 'all') && (
                    <Button 
                      size="small" 
                      sx={{ mt: 2 }}
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDepartment('all');
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </Box>
              ) : (
                getFilteredConversations().map(conversation => {
                  const isSelected = selectedConversation?.id === conversation.id;
                  const isOnline = isUserOnline(conversation.id);

                  return (
                    <ListItem 
                      button 
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      selected={isSelected}
                      sx={{
                        py: 1.5,
                        borderLeft: isSelected ? '3px solid #1976d2' : '3px solid transparent',
                        bgcolor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                        '&:hover': {
                          bgcolor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            isOnline && (
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: '#4caf50',
                                  border: '2px solid white'
                                }}
                              />
                            )
                          }
                        >
                          <Avatar sx={{ bgcolor: conversation.type === 'teacher' ? '#1976d2' : '#9c27b0' }}>
                            {conversation.type === 'teacher' ? <PersonIcon /> : <SchoolIcon />}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography 
                            component="span" 
                            variant="body1" 
                            sx={{ fontWeight: 500, color: '#212121' }}
                          >
                            {conversation.name}
                          </Typography>
                        }
                        secondary={
                          <Typography 
                            variant="body2" 
                            color="textSecondary"
                            noWrap
                          >
                            {conversation.department} • {conversation.type === 'teacher' ? 'Teacher' : 'Student'}
                          </Typography>
                        }
                      />
                    </ListItem>
                  );
                })
              )}
            </List>
          </Grid>
          
          {/* Chat Content */}
          <Grid item xs={12} md={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                <Box sx={{ 
                  p: 2, 
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'white'
                }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: selectedConversation.type === 'teacher' ? '#1976d2' : '#9c27b0',
                      width: 40,
                      height: 40
                    }}
                  >
                    {selectedConversation.type === 'teacher' ? <PersonIcon /> : <SchoolIcon />}
                  </Avatar>
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {selectedConversation.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {isUserOnline(selectedConversation.id) ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FiberManualRecordIcon sx={{ fontSize: 10, color: '#4caf50', mr: 0.5 }} />
                          Online
                        </Box>
                      ) : (
                        'Offline'
                      )}
                    </Typography>
                  </Box>
                  {selectedAssignment && (
                    <Chip
                      icon={<AssignmentIcon fontSize="small" />}
                      label={selectedAssignment.title}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 2 }}
                    />
                  )}
                </Box>
                
                {/* Messages */}
                {renderMessages()}
                
                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: 'white' }}>
                  <Box sx={{ display: 'flex' }}>
                    <TextField
                      fullWidth
                      placeholder="Type a message..."
                      variant="outlined"
                      size="small"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={handleAttachmentClick}
                            >
                              <AttachFileIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 }
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<SendIcon />}
                      sx={{ ml: 1, borderRadius: 2 }}
                      onClick={handleSendMessage}
                    >
                      Send
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  bgcolor: '#f5f7fb'
                }}
              >
                <ChatIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 3 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center" sx={{ maxWidth: 400 }}>
                  Choose a teacher or student from the list to start messaging
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
      
      {/* Assignments Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Select Assignment
              </Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Divider />
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {assignments.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  No assignments available
                </Typography>
              </Box>
            ) : (
              assignments.map((assignment) => (
                <ListItem
                  button
                  key={assignment.id}
                  onClick={() => handleSelectAssignment(assignment)}
                  selected={selectedAssignment?.id === assignment.id}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <AssignmentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={assignment.title}
                    secondary={`Due: ${formatDate(
                      new Date(assignment.due_date),
                      'MMM d, yyyy'
                    )}`}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </Drawer>
      
      {/* Attachment Menu */}
      <Menu
        anchorEl={attachmentMenuAnchor}
        open={Boolean(attachmentMenuAnchor)}
        onClose={handleAttachmentMenuClose}
      >
        <MenuItem onClick={() => {
          if (fileInputRef.current) fileInputRef.current.click();
          handleAttachmentMenuClose();
        }}>
          Upload file
        </MenuItem>
      </Menu>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        multiple
      />
    </Box>
  );
};

export default Chat;
