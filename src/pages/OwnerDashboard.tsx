import React from 'react';
import { useNavigate } from 'react-router-dom';

interface OwnerDashboardProps {
  onLogout: () => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="main-panel">
      <div className="welcome-header">
        <h2>Welcome</h2>
        <p>Library Work Automate Dashboard</p>
      </div>

      <div className="button-grid">
        <button 
          className="dashboard-btn" 
          onClick={() => navigate('/students')}
          style={{ background: 'linear-gradient(135deg, #007bff, #00bcd4)' }}
        >
          <i className="fas fa-users"></i>
          Students Data
        </button>

        <button 
          className="dashboard-btn" 
          onClick={() => navigate('/wow')}
          style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--glow-color))' }}
        >
          <i className="fas fa-magic"></i>
          WOW
        </button>

        <button 
          className="dashboard-btn" 
          onClick={() => navigate('/graph')}
          style={{ background: 'linear-gradient(135deg, #ff9800, #ffc107)' }}
        >
          <i className="fas fa-chart-bar"></i>
          Graph
        </button>

        <button 
          className="dashboard-btn" 
          onClick={() => navigate('/pay-details')}
          style={{ background: 'linear-gradient(135deg, #dc3545, var(--glow-color))' }}
        >
          <i className="fas fa-wallet"></i>
          Pay Details
        </button>

        <button 
          className="dashboard-btn" 
          onClick={() => navigate('/qr-location')}
          style={{ background: 'linear-gradient(135deg, #009688, #00bcd4)' }}
        >
          <i className="fas fa-map-marked-alt"></i>
          QR & LOCATION
        </button>

        <button 
          className="dashboard-btn" 
          onClick={() => navigate('/attendance')}
          style={{ background: 'linear-gradient(135deg, var(--gradient-start), #3366ff)' }}
        >
          <i className="fas fa-calendar-check"></i>
          Attendance Log
        </button>

        <button 
          className="dashboard-btn" 
          onClick={() => navigate('/make-payment')}
          style={{ background: 'linear-gradient(135deg, #4caf50, #28a745)' }}
        >
          <i className="fas fa-wallet"></i>
          Make Payment
        </button>
      </div>

      <button className="logout-btn" onClick={onLogout}>
        LOGOUT
      </button>
    </div>
  );
};

export default OwnerDashboard;
