import React, { useState, useEffect } from 'react';
import './Students.css';
import { studentService } from '../../services/api';
import StudentForm from '../StudentForm/StudentForm';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(id);
        loadStudents();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedStudent) {
        await studentService.update(selectedStudent.id, formData);
      } else {
        await studentService.add(formData);
      }
      setShowForm(false);
      loadStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedStudent(null);
  };
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!uploadFile) return;
    
    const fileExt = uploadFile.name.split('.').pop().toLowerCase();
    if (!['xls', 'xlsx', 'csv'].includes(fileExt)) {
      setUploadResult({
        success: false,
        message: 'Invalid file format. Please upload XLS, XLSX, or CSV files only.'
      });
      return;
    }
    
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const result = await studentService.uploadList(uploadFile);
      setUploadResult({
        success: true,
        message: result.message,
        details: {
          successCount: result.success_count,
          errorCount: result.error_count,
          errors: result.errors
        }
      });
      loadStudents();
    } catch (err) {
      setUploadResult({
        success: false,
        message: err.message
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadResult(null);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading students...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Unable to Load Students</h3>
      <p>{error}</p>
      <div className="error-help">
        <p>Please check:</p>
        <ul>
          <li>The backend server is running</li>
          <li>Database connection is active</li>
          <li>Network connection is stable</li>
        </ul>
      </div>
      <button onClick={() => {
        setError(null);
        setLoading(true);
        loadStudents();
      }}>
        Try Loading Again
      </button>
    </div>
  );

  const departments = [
    {
      id: 1,
      name: 'Information Technology',
      shortName: 'IT',
      icon: '💻',
      studentCount: students.filter(s => s.department === 'IT').length,
      description: 'Computer Science, Software Engineering, and Data Science',
      color: '#3B82F6'
    },
    {
      id: 2,
      name: 'Tourism & Hospitality',
      shortName: 'Tourism',
      icon: '✈️',
      studentCount: students.filter(s => s.department === 'Tourism').length,
      description: 'Hotel Management, Travel & Tourism, Event Planning',
      color: '#10B981'
    },
    {
      id: 3,
      name: 'English Studies',
      shortName: 'English',
      icon: '📚',
      studentCount: students.filter(s => s.department === 'English').length,
      description: 'Literature, Linguistics, and Communication',
      color: '#8B5CF6'
    },
    {
      id: 4,
      name: 'Agricultural Science',
      shortName: 'Agronomy',
      icon: '🌾',
      studentCount: students.filter(s => s.department === 'Agronomy').length,
      description: 'Crop Science, Soil Management, and Sustainable Agriculture',
      color: '#F59E0B'
    },
    {
      id: 5,
      name: 'Social Services',
      shortName: 'Social Work',
      icon: '🤝',
      studentCount: students.filter(s => s.department === 'Social Work').length,
      description: 'Community Development, Counseling, and Social Welfare',
      color: '#EC4899'
    }
  ];

  return (
    <div className="students-container">
      <div className="departments-section">
        <h2>Featured Departments</h2>
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
                  <span className="student-count">{dept.studentCount} Students</span>
                  <span className="department-code">{dept.shortName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedDepartment && (
          <div className="filter-indicator">
            <p>Showing students from {departments.find(d => d.shortName === selectedDepartment)?.name || selectedDepartment} department</p>
            <button className="clear-filter" onClick={() => setSelectedDepartment(null)}>Clear Filter</button>
          </div>
        )}
      </div>

      <div className="students-header">
        <div className="header-left">
          <div className="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
              <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
            </svg>
          </div>
          <h1>Students</h1>
        </div>
        <div className="student-actions">
          <button className="upload-list-btn" onClick={() => setShowUploadModal(true)}>
            <span className="btn-icon">📁</span>
            Upload Student List
          </button>
          <button className="add-student-btn" onClick={handleAddStudent}>
            Add Student
          </button>
        </div>
      </div>

      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter(student => selectedDepartment ? (student.department || 'IT') === selectedDepartment : true)
              .map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.department || 'IT'}</td>
                  <td>{student.grade}</td>
                  <td>
                    <span className={`status ${student.status}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEditStudent(student)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteStudent(student.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <StudentForm
          student={selectedStudent}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
      
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="upload-modal">
            <div className="modal-header">
              <h3>Upload Student List</h3>
              <button className="close-modal" onClick={closeUploadModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="upload-instructions">
                <p>Upload an Excel or CSV file with student data.</p>
                <p>Required columns: <strong>Name</strong>, <strong>Email</strong>, <strong>Phone</strong></p>
                <p>Optional columns: Department, Grade, Status</p>
              </div>
              
              <div className="file-upload-container">
                <input 
                  type="file" 
                  id="student-file" 
                  accept=".xls,.xlsx,.csv" 
                  onChange={handleFileChange} 
                  className="file-input"
                />
                <label htmlFor="student-file" className="file-label">
                  {uploadFile ? uploadFile.name : 'Choose file...'}
                </label>
              </div>
              
              {uploadResult && (
                <div className={`upload-result ${uploadResult.success ? 'success' : 'error'}`}>
                  <div className="result-icon">
                    {uploadResult.success ? '✅' : '❌'}
                  </div>
                  <div className="result-content">
                    <h4>{uploadResult.success ? 'Success!' : 'Error!'}</h4>
                    <p>{uploadResult.message}</p>
                    {uploadResult.success && uploadResult.details && (
                      <div className="result-details">
                        <p>Successfully added/updated: {uploadResult.details.successCount} students</p>
                        {uploadResult.details.errorCount > 0 && (
                          <div className="result-errors">
                            <p>Errors: {uploadResult.details.errorCount}</p>
                            {uploadResult.details.errors.length > 0 && (
                              <ul className="error-list">
                                {uploadResult.details.errors.slice(0, 3).map((err, idx) => (
                                  <li key={idx}>{err}</li>
                                ))}
                                {uploadResult.details.errors.length > 3 && (
                                  <li>...and {uploadResult.details.errors.length - 3} more errors</li>
                                )}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn" 
                onClick={closeUploadModal}
              >
                Cancel
              </button>
              <button 
                className="upload-btn" 
                onClick={handleUpload} 
                disabled={!uploadFile || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
