import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/LoginPage';
import OwnerDashboard from './pages/OwnerDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentsData from './pages/StudentsData';
import WOWView from './pages/WOWView';
import SeatGraph from './pages/SeatGraph';
import PayDetails from './pages/PayDetails';
import AttendanceLog from './pages/AttendanceLog';
import QRLocation from './pages/QRLocation';
import MakePayment from './pages/MakePayment';


export interface AppState {
  isAuthenticated: boolean;
  userType: 'owner' | 'student' | null;
  studentMobile: string | null;
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    isAuthenticated: false,
    userType: null,
    studentMobile: null,
  });

  const handleLogin = (userType: 'owner' | 'student', mobile?: string) => {
    setAppState({
      isAuthenticated: true,
      userType,
      studentMobile: mobile || null,
    });
  };

  const handleLogout = () => {
    setAppState({
      isAuthenticated: false,
      userType: null,
      studentMobile: null,
    });
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            appState.isAuthenticated ? (
              appState.userType === 'owner' ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/student-dashboard" replace />
              )
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            appState.isAuthenticated && appState.userType === 'owner' ? (
              <OwnerDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/student-dashboard" 
          element={
            appState.isAuthenticated && appState.userType === 'student' ? (
              <StudentDashboard 
                studentMobile={appState.studentMobile!} 
                onLogout={handleLogout} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/students" 
          element={
            appState.isAuthenticated && appState.userType === 'owner' ? (
              <StudentsData />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/wow" 
          element={
            appState.isAuthenticated && appState.userType === 'owner' ? (
              <WOWView />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/graph" 
          element={
            appState.isAuthenticated && appState.userType === 'owner' ? (
              <SeatGraph />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/pay-details" 
          element={
            appState.isAuthenticated && appState.userType === 'owner' ? (
              <PayDetails />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/attendance" 
          element={
            appState.isAuthenticated && appState.userType === 'owner' ? (
              <AttendanceLog />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/qr-location" 
          element={
            appState.isAuthenticated && appState.userType === 'owner' ? (
              <QRLocation />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/make-payment" 
          element={
            appState.isAuthenticated && appState.userType === 'owner' ? (
              <MakePayment />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
