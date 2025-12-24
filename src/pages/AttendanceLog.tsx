import React from 'react';
import { useNavigate } from 'react-router-dom';

const AttendanceLog: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="main-panel">
      <h3 style={{ marginTop: 0 }}>AttendanceLog</h3>
      <p style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '50px' }}>
        AttendanceLog feature coming soon...
      </p>
      <div className="action-buttons-footer" style={{ marginTop: '50px' }}>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>
    </div>
  );
};

export default AttendanceLog;
