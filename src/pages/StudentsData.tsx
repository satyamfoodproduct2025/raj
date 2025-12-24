import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Student } from '../lib/supabase';

const StudentsData: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    address: '',
    mobileNumber: '',
    admissionDate: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students data');
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = (fullName: string, mobile: string) => {
    const namePart = fullName.trim().toUpperCase().replace(/[^A-Z\s]/g, '').slice(0, 4).replace(/\s/g, '');
    const mobilePart = mobile.slice(-4);
    return namePart + mobilePart;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.mobileNumber.length !== 10 || isNaN(Number(formData.mobileNumber))) {
      alert('Invalid Mobile Number');
      return;
    }

    // Check if mobile already exists
    const exists = students.some(s => s.mobile_number === formData.mobileNumber);
    if (exists) {
      alert('Already registered!');
      return;
    }

    const password = generatePassword(formData.fullName, formData.mobileNumber);

    try {
      // Insert student
      const { error: studentError } = await supabase
        .from('students')
        .insert([{
          full_name: formData.fullName,
          father_name: formData.fatherName,
          address: formData.address,
          mobile_number: formData.mobileNumber,
          admission_date: formData.admissionDate,
          user_name: formData.mobileNumber,
          password: password,
          is_removed: false,
        }])
        .select()
        .single();

      if (studentError) throw studentError;

      // Insert WOW seat record
      const { error: wowError } = await supabase
        .from('wow_seat_records')
        .insert([{
          mobile_number: formData.mobileNumber,
          seat_no: '',
          batch_string: 'N/A',
          shifts: 0,
          payment: 0,
          custom_rate: 0,
          fixed_total_payment: 0,
        }]);

      if (wowError) throw wowError;

      alert(`Student added! Password: ${password}`);
      setFormData({
        fullName: '',
        fatherName: '',
        address: '',
        mobileNumber: '',
        admissionDate: '',
      });
      setShowForm(false);
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student');
    }
  };

  const handleStudentClick = async (student: Student) => {
    if (student.is_removed) {
      const reAdd = confirm(`Student ${student.mobile_number} was removed. Do you want to re-add them?`);
      if (!reAdd) return;
      
      const newName = prompt('Enter new full name:');
      if (!newName) return;
      
      const newFather = prompt('Enter father name:');
      if (!newFather) return;
      
      const newAddress = prompt('Enter address:');
      if (!newAddress) return;
      
      const password = prompt('Enter admin password:');
      if (password !== 'Avinash') {
        alert('Incorrect admin password');
        return;
      }
      
      const newPassword = generatePassword(newName, student.mobile_number);
      
      try {
        await supabase
          .from('students')
          .update({
            full_name: newName,
            father_name: newFather,
            address: newAddress,
            password: newPassword,
            is_removed: false,
          })
          .eq('id', student.id);
        
        alert(`Student re-added! New password: ${newPassword}`);
        fetchStudents();
      } catch (error) {
        console.error('Error updating student:', error);
        alert('Failed to update student');
      }
    } else {
      const action = confirm('Click OK to REMOVE student, Cancel to EDIT student');
      
      if (action) {
        // Remove student
        const password = prompt('Enter admin password to remove:');
        if (password !== 'Avinash') {
          alert('Incorrect admin password');
          return;
        }
        
        try {
          await supabase
            .from('students')
            .update({
              full_name: null,
              father_name: null,
              address: null,
              password: null,
              user_name: null,
              is_removed: true,
            })
            .eq('id', student.id);
          
          // Clear bookings
          await supabase
            .from('bookings')
            .delete()
            .eq('mobile_number', student.mobile_number);
          
          // Reset WOW record
          await supabase
            .from('wow_seat_records')
            .update({
              seat_no: '',
              batch_string: 'N/A',
              shifts: 0,
              payment: 0,
            })
            .eq('mobile_number', student.mobile_number);
          
          alert('Student removed (index kept)');
          fetchStudents();
        } catch (error) {
          console.error('Error removing student:', error);
          alert('Failed to remove student');
        }
      } else {
        // Edit student
        const newName = prompt('Enter new full name:', student.full_name);
        if (!newName) return;
        
        const newFather = prompt('Enter father name:', student.father_name);
        if (!newFather) return;
        
        const newAddress = prompt('Enter address:', student.address);
        if (!newAddress) return;
        
        const password = prompt('Enter admin password:');
        if (password !== 'Avinash') {
          alert('Incorrect admin password');
          return;
        }
        
        const newPassword = generatePassword(newName, student.mobile_number);
        
        try {
          await supabase
            .from('students')
            .update({
              full_name: newName,
              father_name: newFather,
              address: newAddress,
              password: newPassword,
            })
            .eq('id', student.id);
          
          alert(`Student updated! New password: ${newPassword}`);
          fetchStudents();
        } catch (error) {
          console.error('Error updating student:', error);
          alert('Failed to update student');
        }
      }
    }
  };

  if (loading) return <div className="main-panel">Loading...</div>;

  return (
    <div className="main-panel">
      <h3 style={{ marginTop: 0, color: 'var(--glow-color)' }}>Registered Students (Airtable Style)</h3>

      <div className="data-table-container">
        <table>
          <thead>
            <tr>
              <th style={{ borderColor: 'var(--gradient-start)' }}>S.No.</th>
              <th style={{ borderColor: 'var(--glow-color)' }}>Full Name</th>
              <th style={{ borderColor: '#17a2b8' }}>Father Name</th>
              <th style={{ borderColor: '#ffc107' }}>Address</th>
              <th style={{ borderColor: 'var(--gradient-end)' }}>Mobile No.</th>
              <th style={{ borderColor: '#3366ff' }}>Admission Date</th>
              <th style={{ borderColor: '#4caf50' }}>User Name</th>
              <th style={{ borderColor: '#f44336' }}>Password</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id} onClick={() => handleStudentClick(student)}>
                <td>{index + 1}</td>
                <td>{student.is_removed ? '--- REMOVED ---' : student.full_name}</td>
                <td>{student.is_removed ? '--- REMOVED ---' : student.father_name}</td>
                <td>{student.is_removed ? '--- REMOVED ---' : student.address}</td>
                <td>{student.mobile_number}</td>
                <td>{student.admission_date}</td>
                <td>{student.is_removed ? '---' : student.user_name}</td>
                <td>{student.is_removed ? '---' : student.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px',
            marginBottom: '30px',
            padding: '20px',
            border: '1px solid var(--gradient-start)',
            borderRadius: '10px',
          }}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid var(--gradient-end)',
              background: 'var(--input-bg)',
              color: 'var(--text-color)',
            }}
          />
          <input
            type="text"
            placeholder="Father Name"
            value={formData.fatherName}
            onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
            required
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid var(--gradient-end)',
              background: 'var(--input-bg)',
              color: 'var(--text-color)',
            }}
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid var(--gradient-end)',
              background: 'var(--input-bg)',
              color: 'var(--text-color)',
            }}
          />
          <input
            type="tel"
            placeholder="Mobile Number (10 digits)"
            value={formData.mobileNumber}
            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
            required
            minLength={10}
            maxLength={10}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid var(--gradient-end)',
              background: 'var(--input-bg)',
              color: 'var(--text-color)',
            }}
          />
          <input
            type="date"
            value={formData.admissionDate}
            onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
            required
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid var(--gradient-end)',
              background: 'var(--input-bg)',
              color: 'var(--text-color)',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(45deg, var(--login-border), var(--login-glow))',
              color: 'var(--bg-color)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ADD NEW STUDENT
          </button>
        </form>
      )}

      <div className="action-buttons-footer">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            fontWeight: 700,
            cursor: 'pointer',
            borderRadius: '10px',
            border: 'none',
            background: showForm ? '#dc3545' : 'linear-gradient(45deg, var(--login-border), var(--login-glow))',
            color: 'white',
          }}
        >
          <i className={`fas fa-${showForm ? 'minus' : 'plus'}`}></i> {showForm ? 'Hide' : 'Add New'}
        </button>
        <button className="print-btn" onClick={() => window.print()}>
          <i className="fas fa-print"></i> Print
        </button>
      </div>
    </div>
  );
};

export default StudentsData;
