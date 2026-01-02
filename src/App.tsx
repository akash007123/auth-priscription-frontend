import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import PrescriptionsPage from './pages/PrescriptionsPage';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import DoctorProfilePage from './pages/DoctorProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'Admin' ? '/admin' : '/'} /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to={user.role === 'Admin' ? '/admin' : '/'} /> : <Signup />} />
      <Route path="/forgot-password" element={user ? <Navigate to={user.role === 'Admin' ? '/admin' : '/'} /> : <ForgotPassword />} />
      <Route path="/reset-password/:token" element={user ? <Navigate to={user.role === 'Admin' ? '/admin' : '/'} /> : <ResetPassword />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctor/:id"
        element={
          <ProtectedRoute requiredRole="Admin">
            <DoctorProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="Doctor">
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute>
            <PrescriptionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
