import React, { useState, useEffect } from 'react';
import { DateCalendar, LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Badge, Tooltip, Paper, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './Dashboard.css';

// Custom day component to show events with badges
const ServerDay = (props) => {
  const { day, events, ...other } = props;
  const hasEvent = events.some(event => 
    dayjs(event.event_date).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
  );

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={hasEvent ? '•' : undefined}
      color="primary"
    >
      <PickersDay {...other} day={day} />
    </Badge>
  );
};

const ModernCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Get events for the selected date
  const eventsOnSelectedDate = events.filter(event => 
    dayjs(event.event_date).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
  );

  // Handle event operations
  const handleAddEvent = async () => {
    if (!eventTitle.trim()) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: eventTitle,
          description: eventDescription,
          date: selectedDate.format('YYYY-MM-DD')
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newEvent = {
          id: data.id,
          title: eventTitle,
          description: eventDescription,
          event_date: selectedDate.format('YYYY-MM-DD')
        };
        setEvents([...events, newEvent]);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!currentEvent || !eventTitle.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/events/${currentEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: eventTitle,
          description: eventDescription,
          date: selectedDate.format('YYYY-MM-DD')
        }),
      });

      if (response.ok) {
        setEvents(events.map(event => 
          event.id === currentEvent.id 
            ? { ...event, title: eventTitle, description: eventDescription, event_date: selectedDate.format('YYYY-MM-DD') } 
            : event
        ));
        resetForm();
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter(event => event.id !== id));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const openAddDialog = () => {
    setCurrentEvent(null);
    setEventTitle('');
    setEventDescription('');
    setDialogOpen(true);
  };

  const openEditDialog = (event) => {
    setCurrentEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description || '');
    setDialogOpen(true);
  };

  const resetForm = () => {
    setDialogOpen(false);
    setCurrentEvent(null);
    setEventTitle('');
    setEventDescription('');
  };

  const handleSaveEvent = () => {
    if (currentEvent) {
      handleUpdateEvent();
    } else {
      handleAddEvent();
    }
  };

  return (
    <Paper elevation={6} sx={{
      maxWidth: 460,
      margin: '32px auto',
      borderRadius: 5,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f8fafc 60%, #e3f0ff 100%)',
      boxShadow: '0 8px 32px rgba(25, 118, 210, 0.08)',
      p: 0
    }}>
      <Box sx={{
        p: 4,
        bgcolor: '#1976d2',
        color: 'white',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        boxShadow: '0 6px 24px rgba(25, 118, 210, 0.12)',
        textAlign: 'center'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 1, mb: 1 }}>Calendar</Typography>
        <Typography variant="subtitle1" sx={{ fontSize: 18 }}>{selectedDate.format('dddd, MMMM D, YYYY')}</Typography>
      </Box>
      <Box sx={{ p: 3, pb: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Tooltip title="Add Event">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
            sx={{ borderRadius: 3, fontWeight: 600, boxShadow: '0 2px 8px #1976d220', background: 'linear-gradient(90deg, #1976d2 80%, #64b5f6 100%)' }}
          >
            Add Event
          </Button>
        </Tooltip>
      </Box>
      <Box sx={{ px: 3, pb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate}
            onChange={setSelectedDate}
            loading={loading}
            slots={{ day: ServerDay }}
            slotProps={{ day: { events } }}
            sx={{
              mx: 'auto',
              px: 2,
              borderRadius: 3,
              background: '#fff',
              boxShadow: '0 2px 16px #1976d210',
              '& .MuiPickersDay-root': {
                fontWeight: 600,
                borderRadius: '10px',
                fontSize: 16,
                transition: 'all .2s',
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, #1976d2 80%, #64b5f6 100%)',
                  color: '#fff',
                  boxShadow: '0 2px 8px #1976d220',
                },
                '&:hover': {
                  background: '#e3f0ff',
                },
              },
              '& .MuiPickersCalendarHeader-label': {
                fontWeight: 700,
                color: '#1976d2',
                fontSize: 18
              },
              '& .MuiPickersArrowSwitcher-root button': {
                color: '#1976d2',
              }
            }}
          />
        </LocalizationProvider>
      </Box>
      {/* Events list for selected date */}
      <Box sx={{ p: 3, pt: 2, borderTop: '1px solid #e3eaf2', background: '#f8fafc' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>Events for {selectedDate.format('MMMM D')}</Typography>
        {eventsOnSelectedDate.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No events for this date</Typography>
        ) : (
          eventsOnSelectedDate.map(event => (
            <Paper 
              key={event.id} 
              elevation={0} 
              sx={{ p: 2, mb: 2, borderRadius: 2, position: 'relative', background: '#fff', border: '1px solid #e3eaf2', boxShadow: '0 2px 8px #1976d210' }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, pr: 8, color: '#1976d2' }}>{event.title}</Typography>
              <Typography variant="body2" color="text.secondary">{event.description}</Typography>
              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => openEditDialog(event)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => handleDeleteEvent(event.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          ))
        )}
      </Box>
      {/* Add/Edit Event Dialog */}
      <Dialog open={dialogOpen} onClose={resetForm} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1976d2', pb: 0 }}>{currentEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Event Title"
              fullWidth
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={resetForm} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button 
            onClick={handleSaveEvent} 
            variant="contained" 
            disabled={!eventTitle.trim()}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            {currentEvent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ModernCalendar;
