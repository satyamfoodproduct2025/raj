import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Student, WowSeatRecord } from '../lib/supabase';

const WOWView: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [wowRecords, setWowRecords] = useState<WowSeatRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, wowRes] = await Promise.all([
        supabase.from('students').select('*').order('created_at'),
        supabase.from('wow_seat_records').select('*'),
      ]);

      setStudents(studentsRes.data || []);
      setWowRecords(wowRes.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="main-panel">Loading...</div>;

  return (
    <div className="main-panel">
      <h3 style={{ marginTop: 0, color: 'var(--glow-color)' }}>WOW Seat Allocation & Booking</h3>

      <div className="data-table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: '4%' }}>Seat No</th>
              <th style={{ width: '14%' }}>Full Name</th>
              <th style={{ width: '14%' }}>Father Name</th>
              <th style={{ width: '14%' }}>Address</th>
              <th style={{ width: '12%' }}>Mobile No.</th>
              <th style={{ width: '12%' }}>Batch Time (Shifts)</th>
              <th style={{ width: '10%' }}>Shifts</th>
              <th style={{ width: '10%' }}>Payment</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const wow = wowRecords.find(w => w.mobile_number === student.mobile_number);
              return (
                <tr key={student.id} style={{ backgroundColor: wow?.seat_no ? '#d1e5f0' : 'transparent' }}>
                  <td>
                    <input
                      type="text"
                      style={{
                        background: '#f8f8f8',
                        border: '1px solid #ccc',
                        color: '#000',
                        padding: '5px',
                        width: '90%',
                        borderRadius: '5px',
                        textAlign: 'center',
                      }}
                      placeholder="Seat or S.Shift"
                      defaultValue={wow?.seat_no || ''}
                    />
                  </td>
                  <td>{student.full_name || '--- REMOVED ---'}</td>
                  <td>{student.father_name || '--- REMOVED ---'}</td>
                  <td>{student.address || '--- REMOVED ---'}</td>
                  <td>{student.mobile_number}</td>
                  <td>
                    <textarea
                      readOnly
                      style={{
                        background: '#f8f8f8',
                        border: '1px solid #ccc',
                        color: '#000',
                        textAlign: 'center',
                        width: '100%',
                        display: 'block',
                        marginBottom: '5px',
                        padding: '5px',
                        borderRadius: '5px',
                      }}
                      value={wow?.batch_string || 'N/A'}
                    />
                  </td>
                  <td>{wow?.shifts || 0} Shift{(wow?.shifts || 0) !== 1 ? 's' : ''}</td>
                  <td style={{ fontWeight: 'bold', fontSize: '1.2em', color: '#4caf50' }}>
                    ₹{wow?.payment || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="action-buttons-footer">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button className="print-btn" onClick={() => window.print()}>
          <i className="fas fa-print"></i> Print WOW
        </button>
      </div>
    </div>
  );
};

export default WOWView;
