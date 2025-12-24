import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Student, WowSeatRecord } from '../lib/supabase';

interface StudentDashboardProps {
  studentMobile: string;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ studentMobile, onLogout }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [wowRecord, setWowRecord] = useState<WowSeatRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [studentMobile]);

  const fetchStudentData = async () => {
    try {
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('mobile_number', studentMobile)
        .single();

      const { data: wowData } = await supabase
        .from('wow_seat_records')
        .select('*')
        .eq('mobile_number', studentMobile)
        .single();

      setStudent(studentData);
      setWowRecord(wowData);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="main-panel">Loading...</div>;

  const seatInfo = wowRecord?.seat_no && wowRecord?.shifts > 0
    ? `Seat No: ${wowRecord.seat_no} | Shift: ${wowRecord.batch_string}`
    : 'Seat: Not Allotted | Shift: N/A';

  return (
    <div className="main-panel">
      <div className="student-welcome-card">
        <div className="welcome-sub-text">Welcome Back</div>
        <div className="student-name-hero">{student?.full_name || 'Student'}</div>
        <div className="seat-badge">
          <i className="fas fa-chair"></i>
          <span>{seatInfo}</span>
        </div>
      </div>

      <div className="button-grid" style={{ gridTemplateColumns: '1fr', gap: '20px' }}>
        <button 
          className="dashboard-btn"
          onClick={() => alert('Attendance marking feature')}
          style={{ background: 'linear-gradient(135deg, #17a2b8, #00bcd4)' }}
        >
          <i className="fas fa-camera"></i>
          Mark Attendance
        </button>

        <button 
          className="dashboard-btn"
          onClick={() => alert('Payment feature')}
          style={{ background: 'linear-gradient(135deg, #4caf50, #28a745)' }}
        >
          <i className="fas fa-wallet"></i>
          Online Payment
        </button>

        <button 
          className="dashboard-btn"
          onClick={() => alert('Attendance history')}
          style={{ background: 'linear-gradient(135deg, #ff9800, #ffc107)' }}
        >
          <i className="fas fa-history"></i>
          Attendance History
        </button>
      </div>

      <button className="logout-btn" onClick={onLogout}>
        LOGOUT
      </button>
    </div>
  );
};

export default StudentDashboard;
