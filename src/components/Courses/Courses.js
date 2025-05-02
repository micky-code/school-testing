import React, { useState, useEffect } from 'react';
import './Courses.css';
import { courseService } from '../../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await courseService.getAll();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadCourses();
  }, []);

  const departments = [
    {
      id: 1,
      name: 'Information Technology',
      shortName: 'IT',
      icon: '💻',
      courseCount: courses.filter(c => c.department === 'IT').length,
      description: 'Computer Science, Software Engineering, and Data Science',
      color: '#3B82F6'
    },
    {
      id: 2,
      name: 'Tourism & Hospitality',
      shortName: 'Tourism',
      icon: '✈️',
      courseCount: courses.filter(c => c.department === 'Tourism').length,
      description: 'Hotel Management, Travel & Tourism, Event Planning',
      color: '#10B981'
    },
    {
      id: 3,
      name: 'English Studies',
      shortName: 'English',
      icon: '📚',
      courseCount: courses.filter(c => c.department === 'English').length,
      description: 'Literature, Linguistics, and Communication',
      color: '#8B5CF6'
    },
    {
      id: 4,
      name: 'Agricultural Science',
      shortName: 'Agronomy',
      icon: '🌾',
      courseCount: courses.filter(c => c.department === 'Agronomy').length,
      description: 'Crop Science, Soil Management, and Sustainable Agriculture',
      color: '#F59E0B'
    },
    {
      id: 5,
      name: 'Social Services',
      shortName: 'Social Work',
      icon: '🤝',
      courseCount: courses.filter(c => c.department === 'Social Work').length,
      description: 'Community Development, Counseling, and Social Welfare',
      color: '#EC4899'
    }
  ];

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setShowCourseForm(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseForm(true);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.delete(id);
        setCourses(courses.filter(course => course.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCourseFormClose = () => {
    setShowCourseForm(false);
    setSelectedCourse(null);
  };

  const handleCourseFormSubmit = async (formData) => {
    try {
      if (selectedCourse) {
        // Update existing course
        await courseService.update(selectedCourse.id, formData);
        setCourses(courses.map(course => 
          course.id === selectedCourse.id ? { ...formData, id: course.id } : course
        ));
      } else {
        // Add new course
        const result = await courseService.add(formData);
        const newCourse = {
          ...formData,
          id: result.id,
        };
        setCourses([...courses, newCourse]);
      }
      setShowCourseForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading courses...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Unable to Load Courses</h3>
      <p>{error}</p>
      <button onClick={() => {
        setError(null);
        setLoading(true);
        // Reload courses
        courseService.getAll()
          .then(data => {
            setCourses(data);
            setLoading(false);
          })
          .catch(err => {
            setError(err.message);
            setLoading(false);
          });
      }}>
        Try Loading Again
      </button>
    </div>
  );

  return (
    <div className="courses-container">
      <div className="departments-section">
        <h2>Departments</h2>
        <div className="department-cards">
          {departments.map(dept => (
            <div 
              key={dept.id} 
              className={`department-card ${selectedDepartment === dept.shortName ? 'selected' : ''}`}
              style={{
                '--card-color': dept.color
              }}
              onClick={() => setSelectedDepartment(selectedDepartment === dept.shortName ? null : dept.shortName)}
            >
              <div className="department-icon">{dept.icon}</div>
              <div className="department-info">
                <h3>{dept.name}</h3>
                <p className="department-description">{dept.description}</p>
                <div className="department-stats">
                  <span className="course-count">{dept.courseCount} Courses</span>
                  <span className="department-code">{dept.shortName}</span>
                </div>
              </div>
              {selectedDepartment === dept.shortName && (
                <div className="department-selected-indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        {selectedDepartment && (
          <div className="filter-indicator">
            <p>Showing courses from {departments.find(d => d.shortName === selectedDepartment)?.name || selectedDepartment} department</p>
            <button className="clear-filter" onClick={() => setSelectedDepartment(null)}>Clear Filter</button>
          </div>
        )}
      </div>

      <div className="courses-header">
        <div className="header-left">
          <div className="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/>
              <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>
            </svg>
          </div>
          <h1>Courses</h1>
        </div>
        <button className="add-course-btn" onClick={handleAddCourse}>
          Add Course
        </button>
      </div>

      <div className="courses-table">
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Name</th>
              <th>Department</th>
              <th>Credits</th>
              <th>Instructor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses
              .filter(course => selectedDepartment ? course.department === selectedDepartment : true)
              .map((course) => (
                <tr key={course.id}>
                  <td><span className="course-code">{course.code}</span></td>
                  <td>
                    <div className="course-name-cell">
                      <div className="course-name">{course.name}</div>
                      <div className="course-description">{course.description}</div>
                    </div>
                  </td>
                  <td>{course.department}</td>
                  <td>{course.credits}</td>
                  <td>{course.instructor}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEditCourse(course)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteCourse(course.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showCourseForm && (
        <CourseForm
          course={selectedCourse}
          onSubmit={handleCourseFormSubmit}
          onClose={handleCourseFormClose}
          departments={departments}
        />
      )}
    </div>
  );
};

// Course Form Component
const CourseForm = ({ course, onSubmit, onClose, departments }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: 'IT',
    credits: 3,
    description: '',
    instructor: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (course) {
      setFormData(course);
    }
  }, [course]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Course name is required';
        if (value.length < 3) return 'Course name must be at least 3 characters';
        if (value.length > 100) return 'Course name must be less than 100 characters';
        return '';

      case 'code':
        if (!value.trim()) return 'Course code is required';
        if (!/^[A-Z]{2,}\d{3,}$/.test(value)) return 'Course code must be in format XX000 (e.g., CS101)';
        return '';

      case 'department':
        if (!value) return 'Department is required';
        return '';

      case 'credits':
        if (!value) return 'Credits are required';
        if (value < 1 || value > 6) return 'Credits must be between 1 and 6';
        return '';

      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.length < 10) return 'Description must be at least 10 characters';
        if (value.length > 500) return 'Description must be less than 500 characters';
        return '';

      case 'instructor':
        if (!value.trim()) return 'Instructor name is required';
        return '';

      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  return (
    <div className="course-form-overlay">
      <div className="course-form-container">
        <div className="form-header">
          <h2>{course ? 'Edit Course' : 'Add New Course'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Course Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('name') ? 'error' : ''}
              required
              placeholder="Enter course name"
            />
            {getFieldError('name') && (
              <div className="error-message">{errors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="code">Course Code</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('code') ? 'error' : ''}
              required
              placeholder="Enter course code (e.g., CS101)"
            />
            {getFieldError('code') && (
              <div className="error-message">{errors.code}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('department') ? 'error' : ''}
              required
            >
              {departments.map(dept => (
                <option key={dept.id} value={dept.shortName}>{dept.name}</option>
              ))}
            </select>
            {getFieldError('department') && (
              <div className="error-message">{errors.department}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="credits">Credits</label>
            <input
              type="number"
              id="credits"
              name="credits"
              min="1"
              max="6"
              value={formData.credits}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('credits') ? 'error' : ''}
              required
            />
            {getFieldError('credits') && (
              <div className="error-message">{errors.credits}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('description') ? 'error' : ''}
              required
              placeholder="Enter course description"
              rows="3"
            ></textarea>
            {getFieldError('description') && (
              <div className="error-message">{errors.description}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="instructor">Instructor</label>
            <input
              type="text"
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldError('instructor') ? 'error' : ''}
              required
              placeholder="Enter instructor name"
            />
            {getFieldError('instructor') && (
              <div className="error-message">{errors.instructor}</div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {course ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Courses;
