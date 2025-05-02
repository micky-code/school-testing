import React, { useState, useEffect } from 'react';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import './Dashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';



// Images for top scorers
import jane from '../../assets/pf.png';
import eleanor from '../../assets/images/eleanor.png';
import devon from '../../assets/images/devon.png';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // Mock data
  const stats = [
    { 
      id: 1, 
      title: 'Schools', 
      value: 6000, 
      icon: <SchoolIcon sx={{ fontSize: 26, color: 'inherit' }} />, 
      color: '#FF6B6B', 
      bgColor: '#FFE5E5' 
    },
    { 
      id: 2, 
      title: 'Students', 
      value: 25000, 
      icon: <PeopleIcon sx={{ fontSize: 26, color: 'inherit' }} />, 
      color: '#7971EA', 
      bgColor: '#E8E6FF' 
    },
    { 
      id: 3, 
      title: 'Teachers', 
      value: 3500, 
      icon: <PersonIcon sx={{ fontSize: 26, color: 'inherit' }} />, 
      color: '#FFC75F', 
      bgColor: '#FFF2DD' 
    },
    { 
      id: 4, 
      title: 'Parents', 
      value: 11020, 
      icon: <FamilyRestroomIcon sx={{ fontSize: 26, color: 'inherit' }} />, 
      color: '#4ECDC4', 
      bgColor: '#DAFAF7' 
    }
  ];

  const schoolPerformance = {
    labels: ['Govt. School', 'Private School', 'Average School'],
    datasets: [
      {
        data: [90, 65, 75],
        backgroundColor: ['#7971EA', '#FFC75F', '#4ECDC4'],
        barThickness: 45,
        borderRadius: 5,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: false,
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  const topScorers = [
    { id: 1, name: 'SR DVP', school: 'Sain Paul Institute', image: jane, score: '99.99%', rank: '1st', color: '#4ECDC4' },
    { id: 2, name: 'San Soklai', school: 'Sain Paul Institute', image: eleanor, score: '99.76%', rank: '2nd', color: '#7971EA' },
    { id: 3, name: 'Chhoun Senghok', school: 'Sain Paul Institute', image: devon, score: '99.50%', rank: '3rd', color: '#FFC75F' }
  ];

  // Real-time date and time
  const [now, setNow] = useState(dayjs());
  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calendar state
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Calendar events with persistence
  const [calendarEvents, setCalendarEvents] = useState(() => {
    const stored = localStorage.getItem('calendarEvents');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  // For backend sync, replace the above with fetch/save to API endpoints.

  // Event dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  // Helpers
  const eventsOnDate = (date) => calendarEvents.filter(ev => dayjs(ev.date).isSame(date, 'day'));
  const hasEvent = (date) => eventsOnDate(date).length > 0;

  // CRUD handlers
  const handleAddEvent = (event) => {
    setCalendarEvents([...calendarEvents, { ...event, id: Date.now() }]);
  };
  const handleEditEvent = (event) => {
    setCalendarEvents(calendarEvents.map(ev => ev.id === event.id ? event : ev));
  };
  const handleDeleteEvent = (id) => {
    setCalendarEvents(calendarEvents.filter(ev => ev.id !== id));
  };

  // Highlighted dates - these would typically come from an API
  const highlightedDates = [9, 17, 22, 23, 24, 25]; // Dates in February 2024 to highlight

  return (
    <div className="dashboard">
      {/* Stat Cards */}
      <div className="stat-cards">
        {stats.map(stat => (
          <div key={stat.id} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h2 className="stat-value">{stat.value.toLocaleString()}</h2>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-main-content">
        <div className="dashboard-left">
          {/* Calendar Section */}
          <div className="dashboard-card calendar-card">
            <div className="calendar-header">
              <h3>Calendar & Attendance</h3>
              <div className="current-date">
                <div className="date-text">{now.format('dddd, MMMM D, YYYY')}</div>
                <div className="time-text">{now.format('HH:mm:ss')}</div>
              </div>
            </div>
            <div className="calendar-layout">
              <div className="calendar-container">
                <div className="calendar-month-nav">
                  <div className="month-year-selector">
                    <select value={selectedDate.format('MMMM YYYY')} onChange={(e) => {
                      const [month, year] = e.target.value.split(' ');
                      setSelectedDate(dayjs(`${year}-${dayjs().month(month).format('MM')}-01`));
                    }}>
                      {Array.from({length: 12}, (_, i) => {
                        const monthDate = dayjs().month(i);
                        return (
                          <option key={i} value={`${monthDate.format('MMMM')} ${selectedDate.year()}`}>
                            {monthDate.format('MMMM')} {selectedDate.year()}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="calendar-nav-buttons">
                    <button 
                      className="calendar-nav-btn" 
                      onClick={() => setSelectedDate(selectedDate.subtract(1, 'month'))}
                    >
                      &lt;
                    </button>
                    <button 
                      className="calendar-nav-btn" 
                      onClick={() => setSelectedDate(selectedDate.add(1, 'month'))}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
                
                <div className="calendar-grid">
                  <div className="weekday-header">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <span key={i}>{day}</span>
                    ))}
                  </div>
                  <div className="calendar-days">
                    {(() => {
                      // Create calendar grid
                      const firstDay = selectedDate.startOf('month');
                      const lastDay = selectedDate.endOf('month');
                      const daysInMonth = lastDay.date();
                      
                      // Find the first day of the calendar grid (might be in previous month)
                      const startDate = firstDay.subtract(firstDay.day(), 'day');
                      
                      const days = [];
                      // 6 rows × 7 days
                      for (let i = 0; i < 42; i++) {
                        const currentDate = startDate.add(i, 'day');
                        const isCurrentMonth = currentDate.month() === selectedDate.month();
                        const isToday = currentDate.isSame(dayjs(), 'day');
                        const isSelected = currentDate.isSame(selectedDate, 'day');
                        const hasEventOnDay = hasEvent(currentDate);
                        
                        days.push(
                          <div 
                            key={i} 
                            className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEventOnDay ? 'has-event' : ''}` }
                            onClick={() => setSelectedDate(currentDate)}
                          >
                            {currentDate.date()}
                          </div>
                        );
                      }
                      return days;
                    })()}
                  </div>
                </div>
              </div>
              
              {/* Selected Date Events Summary */}
              <div className="selected-date-summary">
                <div className="selected-date-header">
                  <h4>{selectedDate.format('dddd, MMMM D, YYYY')}</h4>
                  <button className="add-event-btn" onClick={() => { setEditEvent(null); setDialogOpen(true); }}>
                    +
                  </button>
                </div>
                {eventsOnDate(selectedDate).length > 0 ? (
                  <div className="quick-events-list">
                    {eventsOnDate(selectedDate).slice(0, 2).map(event => (
                      <div key={event.id} className="quick-event-item">
                        <div className="quick-event-title">{event.title}</div>
                      </div>
                    ))}
                    {eventsOnDate(selectedDate).length > 2 && (
                      <div className="quick-event-more">+{eventsOnDate(selectedDate).length - 2} more events</div>
                    )}
                  </div>
                ) : (
                  <div className="no-events">No events scheduled</div>
                )}
              </div>
            </div>
            
            {dialogOpen && (
              <EventDialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditEvent(null); }}
                onSave={(event) => {
                  if (editEvent) handleEditEvent(event); else handleAddEvent(event);
                  setDialogOpen(false); setEditEvent(null);
                }}
                event={editEvent}
                date={selectedDate}
              />
            )}
          </div>
        </div>

        <div className="dashboard-right">
          {/* School Performance Chart */}
          <div className="dashboard-card performance-card">
            <div className="card-header">
              <h3>School Performance</h3>
              <div className="performance-info">All the data in percentage (%)</div>
            </div>
            
            <div className="chart-container">
              <Bar data={schoolPerformance} options={chartOptions} />
            </div>
            
            <div className="chart-legend">
              {schoolPerformance.labels.map((label, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: schoolPerformance.datasets[0].backgroundColor[index] }}></span>
                  <div className="legend-text">
                    <div className="legend-label">{label}</div>
                    <div className="legend-sublabel">Performance</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Scorers */}
          <div className="dashboard-card scorers-card">
            <div className="card-header">
              <h3>Top Scorer</h3>
              <div className="year-selector">
                <select defaultValue="2018-2019">
                  <option value="2018-2019">2018 - 2019</option>
                  <option value="2019-2020">2019 - 2020</option>
                </select>
              </div>
            </div>
            
            <div className="top-scorers">
              {topScorers.map(scorer => (
                <div key={scorer.id} className="scorer-card" style={{ backgroundColor: scorer.color }}>
                  <div className="scorer-image">
                    <img src={scorer.image} alt={scorer.name} />
                  </div>
                  <div className="scorer-name">{scorer.name}</div>
                  <div className="scorer-school">{scorer.school}</div>
                  <div className="scorer-score">{scorer.score}</div>
                  <div className="scorer-rank">{scorer.rank}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// EventDialog component for add/edit
function EventDialog({ open, onClose, onSave, event, date }) {
  const [title, setTitle] = useState(event ? event.title : '');
  const [description, setDescription] = useState(event ? event.description : '');
  const [eventDate, setEventDate] = useState(event ? dayjs(event.date) : date);

  useEffect(() => {
    if (event) {
      setTitle(event.title); setDescription(event.description); setEventDate(dayjs(event.date));
    } else {
      setTitle(''); setDescription(''); setEventDate(date);
    }
  }, [event, date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: event ? event.id : Date.now(),
      title,
      description,
      date: eventDate.toISOString(),
    });
  };

  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.2)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <form style={{ background:'white', padding:24, borderRadius:12, minWidth:320, boxShadow:'0 2px 16px rgba(0,0,0,0.1)' }} onSubmit={handleSubmit}>
        <h3>{event ? 'Edit Event' : 'Add Event'}</h3>
        <div style={{ marginBottom:12 }}>
          <label style={{ display:'block', marginBottom:4 }}>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ width:'100%', padding:6, borderRadius:4, border:'1px solid #ccc' }} required />
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={{ display:'block', marginBottom:4 }}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width:'100%', padding:6, borderRadius:4, border:'1px solid #ccc' }} rows={3} />
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={{ display:'block', marginBottom:4 }}>Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar value={eventDate} onChange={setEventDate} />
          </LocalizationProvider>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" style={{ background:'#1976d2', color:'white', border:'none', borderRadius:4, padding:'6px 16px' }}>{event ? 'Save' : 'Add'}</button>
        </div>
      </form>
    </div>
  );
}

export default Dashboard;
