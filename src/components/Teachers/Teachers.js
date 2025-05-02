import React, { useState } from 'react';
import './Teachers.css';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Box,
  Badge,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import ComputerIcon from '@mui/icons-material/Computer';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import LanguageIcon from '@mui/icons-material/Language';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';

// Department data with their respective colors and icons
const departments = [
  { 
    id: 'it',
    name: 'Information Technology',
    color: '#2196F3',
    icon: ComputerIcon,
    shortName: 'IT'
  },
  { 
    id: 'agronomy',
    name: 'Agronomy',
    color: '#4CAF50',
    icon: AgricultureIcon,
    shortName: 'AGR'
  },
  { 
    id: 'english',
    name: 'English',
    color: '#FF9800',
    icon: LanguageIcon,
    shortName: 'ENG'
  },
  { 
    id: 'tourism',
    name: 'Tourism',
    color: '#9C27B0',
    icon: TravelExploreIcon,
    shortName: 'TOUR'
  },
  { 
    id: 'social',
    name: 'Social Work',
    color: '#E91E63',
    icon: PeopleIcon,
    shortName: 'SOC'
  },
];

// Sample data with updated departments
const teachersData = [
  {
    id: 1,
    name: 'San Sophar',
    department: 'it',
    subject: 'Web Development',
    email: 'sopharsan@spi.com',
    experience: '10 years',
    students: [
      { id: 1, name: 'SR DVP', grade: 'A+', attendance: '99%', class: 'IT-Th13-Y4' },
      { id: 2, name: 'Chhoun Senghok', grade: 'A-', attendance: '97%', class: 'IT-Th13-Y4' },
      { id: 3, name: 'San Soklai', grade: 'A', attendance: '96%', class: 'IT-Th13-Y4' },
    ],
  },
  {
    id: 2,
    name: 'Sophal',
    department: 'agronomy',
    subject: 'Crop Science',
    email: 'Sophal@school.com',
    experience: '2 years',
    students: [
      { id: 3, name: 'Ny Kimsri', grade: 'A+', attendance: '92%', class: 'AGR-Th12-G' },
      { id: 4, name: 'Srey Pov', grade: 'B-', attendance: '90%', class: 'AGR-Th12-G' },
    ],
  },
  {
    id: 3,
    name: 'Michael Chen',
    department: 'english',
    subject: 'Business English',
    email: 'michael.chen@school.com',
    experience: '6 years',
    students: [
      { id: 5, name: 'Eva White', grade: 'A', attendance: '94%', class: 'ENG-10A' },
      { id: 6, name: 'Frank Lee', grade: 'A-', attendance: '91%', class: 'ENG-10A' },
    ],
  },
  {
    id: 4,
    name: 'Laura Martinez',
    department: 'tourism',
    subject: 'Hospitality Management',
    email: 'laura.martinez@school.com',
    experience: '7 years',
    students: [
      { id: 7, name: 'George Brown', grade: 'B+', attendance: '89%', class: 'TOUR-11A' },
      { id: 8, name: 'Helen Garcia', grade: 'A', attendance: '96%', class: 'TOUR-11A' },
    ],
  },
  {
    id: 5,
    name: 'David Wilson',
    department: 'social',
    subject: 'Community Development',
    email: 'david.wilson@school.com',
    experience: '9 years',
    students: [
      { id: 9, name: 'Ian Clark', grade: 'A-', attendance: '93%', class: 'SOC-12B' },
      { id: 10, name: 'Julia Wright', grade: 'B+', attendance: '87%', class: 'SOC-12B' },
    ],
  },
];

const TeacherCard = ({ teacher, department }) => {
  const [open, setOpen] = useState(false);
  const DepartmentIcon = department.icon;

  return (
    <>
      <Card className="teacher-card">
        <CardContent>
          <div className="teacher-card-header">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Avatar 
                  className="department-badge"
                  style={{ backgroundColor: department.color }}
                >
                  <DepartmentIcon style={{ fontSize: '14px' }} />
                </Avatar>
              }
            >
              <Avatar className="teacher-avatar">
                <PersonIcon />
              </Avatar>
            </Badge>
            <div className="teacher-title">
              <Typography variant="h6" className="teacher-name">
                {teacher.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {teacher.subject}
              </Typography>
              <Chip 
                label={department.shortName}
                size="small"
                className="department-chip"
                style={{ 
                  backgroundColor: `${department.color}15`,
                  color: department.color,
                  marginTop: '4px'
                }}
              />
            </div>
          </div>
          
          <div className="teacher-card-content">
            <div className="teacher-info-item">
              <EmailIcon fontSize="small" />
              <Typography variant="body2">{teacher.email}</Typography>
            </div>
            <div className="teacher-info-item">
              <WorkIcon fontSize="small" />
              <Typography variant="body2">{teacher.experience}</Typography>
            </div>
            <div className="teacher-info-item">
              <PeopleIcon fontSize="small" />
              <Typography variant="body2">
                {teacher.students.length} Students
              </Typography>
            </div>
          </div>

          <div className="teacher-card-actions">
            <Chip 
              label="View Students" 
              color="primary" 
              onClick={() => setOpen(true)}
              className="view-students-chip"
              style={{ backgroundColor: department.color }}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <div className="dialog-title">
            <div className="dialog-title-content">
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Avatar 
                    className="department-badge"
                    style={{ backgroundColor: department.color }}
                  >
                    <DepartmentIcon style={{ fontSize: '14px' }} />
                  </Avatar>
                }
              >
                <Avatar className="teacher-avatar-large">
                  <PersonIcon />
                </Avatar>
              </Badge>
              <div>
                <Typography variant="h6">{teacher.name}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {teacher.subject}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {teacher.experience} • {teacher.email}
                </Typography>
              </div>
            </div>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" className="enrolled-students-title">
            Enrolled Students
          </Typography>
          <List>
            {teacher.students.map((student, index) => (
              <React.Fragment key={student.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <div className="student-name-container">
                        <span>{student.name}</span>
                        <Chip 
                          label={student.class} 
                          size="small" 
                          className="class-chip"
                          style={{
                            backgroundColor: `${department.color}15`,
                            color: department.color
                          }}
                        />
                      </div>
                    }
                    secondary={
                      <div className="student-stats">
                        <Chip 
                          label={`Grade: ${student.grade}`} 
                          size="small" 
                          className="grade-chip"
                        />
                        <Chip 
                          label={`Attendance: ${student.attendance}`} 
                          size="small" 
                          className="attendance-chip"
                        />
                      </div>
                    }
                  />
                </ListItem>
                {index < teacher.students.length - 1 && <Divider variant="inset" />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Teachers = () => {
  const [currentDepartment, setCurrentDepartment] = useState('all');

  const filteredTeachers = currentDepartment === 'all'
    ? teachersData
    : teachersData.filter(teacher => teacher.department === currentDepartment);

  return (
    <div className="teachers-container">
      <Card className="teachers-header">
        <CardContent>
          <Typography variant="h5" component="h2">
            Academic Departments
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            View teachers and students by department
          </Typography>
          
          <Tabs
            value={currentDepartment}
            onChange={(e, newValue) => setCurrentDepartment(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            className="department-tabs"
          >
            <Tab 
              label="All Departments" 
              value="all"
              className="department-tab"
            />
            {departments.map(dept => (
              <Tab
                key={dept.id}
                label={dept.name}
                value={dept.id}
                icon={<dept.icon />}
                iconPosition="start"
                className="department-tab"
                style={{ borderBottom: `3px solid ${dept.color}` }}
              />
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <Grid container spacing={3} className="teachers-grid">
        {filteredTeachers.map((teacher) => {
          const department = departments.find(d => d.id === teacher.department);
          return (
            <Grid item xs={12} sm={6} md={4} key={teacher.id}>
              <TeacherCard 
                teacher={teacher} 
                department={department}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Teachers;
