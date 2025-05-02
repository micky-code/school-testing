import React from 'react';
import ModernCalendar from './ModernCalendar';
import { Box, Typography, Container } from '@mui/material';

const CalendarExample = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Calendar Integration Example
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <ModernCalendar />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            How to Use the Calendar
          </Typography>
          <Typography paragraph>
            This calendar component provides a professional UI for managing events:
          </Typography>
          <ul>
            <li>Click on any date to view events for that day</li>
            <li>Use the "Add Event" button to create new events</li>
            <li>Edit or delete existing events with the action buttons</li>
            <li>Dates with events are highlighted with a dot</li>
            <li>All events are stored in the MySQL database</li>
          </ul>
          <Typography paragraph>
            The calendar is fully integrated with your backend API at <code>http://localhost:5000/api/events</code>.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default CalendarExample;
