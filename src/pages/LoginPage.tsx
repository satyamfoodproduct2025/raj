import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  onLogin: (userType: 'owner' | 'student', mobile?: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loginType, setLoginType] = useState<'owner' | 'student'>('owner');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginType === 'owner') {
        // Fetch owner credentials from settings
        const { data: settings } = await supabase
          .from('settings')
          .select('*')
          .in('key', ['owner_mobile', 'owner_password']);

        const ownerMobile = settings?.find(s => s.key === 'owner_mobile')?.value || '6201530654';
        const ownerPassword = settings?.find(s => s.key === 'owner_password')?.value || 'Avinash';

        if (mobile === ownerMobile && password === ownerPassword) {
          onLogin('owner');
        } else {
          setError('LOGIN FAILED! Invalid credentials.');
        }
      } else {
        // Student login
        const { data: student } = await supabase
          .from('students')
          .select('*')
          .eq('user_name', mobile)
          .eq('password', password)
          .eq('is_removed', false)
          .single();

        if (student) {
          onLogin('student', mobile);
        } else {
          setError('LOGIN FAILED! Invalid credentials.');
        }
      }
    } catch (err) {
      setError('LOGIN FAILED! Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="header-text">
        <h2>Library Work</h2>
        <h1>Automate</h1>
      </div>

      <div className="tab-buttons">
        <button 
          className={`tab-button ${loginType === 'owner' ? 'active' : ''}`}
          onClick={() => setLoginType('owner')}
        >
          Owner Login
        </button>
        <button 
          className={`tab-button ${loginType === 'student' ? 'active' : ''}`}
          onClick={() => setLoginType('student')}
        >
          Student Login
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <i className="fas fa-mobile-alt"></i>
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="login-btn-final"
          disabled={loading}
        >
          {loading ? 'LOGGING IN...' : `${loginType.toUpperCase()} LOGIN`}
        </button>

        {error && (
          <p className="error-message">{error}</p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
