import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import './Attendance.css';

const Attendance = ({ department, departmentData }) => {
  // Pie chart for attendance breakdown
  const attendanceData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [
          Math.round(departmentData.attendanceRate),
          Math.round(100 - departmentData.attendanceRate),
          0
        ],
        backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
        borderWidth: 0,
      },
    ],
  };

  // Line chart for attendance trend
  const trendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Attendance Rate %',
        data: departmentData.attendanceTrend,
        borderColor: departmentData.color,
        backgroundColor: `${departmentData.color}33`,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        min: 80,
        max: 100,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="attendance-section">
      <div className="attendance-overview">
        <div className="attendance-chart">
          <h4>Attendance Breakdown</h4>
          <div className="pie-chart-container">
            <Pie data={attendanceData} options={pieOptions} />
          </div>
        </div>
        <div className="attendance-trend">
          <h4>6-Week Attendance Trend</h4>
          <div className="line-chart-container">
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>
      </div>

      <div className="attendance-summary">
        <h4>Attendance Summary</h4>
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-label">Present Today</span>
            <span className="stat-value">{Math.round(departmentData.totalStudents * (departmentData.attendanceRate / 100))}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Absent Today</span>
            <span className="stat-value">{Math.round(departmentData.totalStudents * (1 - departmentData.attendanceRate / 100))}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Students</span>
            <span className="stat-value">{departmentData.totalStudents}</span>
          </div>
        </div>
      </div>
      
      <div className="attendance-records">
        <h4>Recent Attendance Records</h4>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Recorded By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departmentData.recentAttendance.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>
                  <span className={`status ${record.status === 'present' ? 'active' : 'absent'}`}>
                    {record.status === 'present' ? 'Present' : 'Absent'}
                  </span>
                </td>
                <td>System</td>
                <td>
                  <button className="action-btn small">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="attendance-actions">
        <button className="action-btn">Take Attendance</button>
        <button className="action-btn">Generate Attendance Report</button>
        <button className="action-btn">Send Alerts for Low Attendance</button>
      </div>

      <div className="recent-activity">
        <h4>Recent Activity</h4>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📊</div>
            <div className="activity-content">
              <div className="activity-title">Monthly Attendance Report Generated</div>
              <div className="activity-time">2 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <div className="activity-title">Today's Attendance Recorded</div>
              <div className="activity-time">5 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📱</div>
            <div className="activity-content">
              <div className="activity-title">Absence Notifications Sent to Parents</div>
              <div className="activity-time">Yesterday</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
