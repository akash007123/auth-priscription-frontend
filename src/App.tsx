import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import PrescriptionsPage from './pages/PrescriptionsPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Home /> : <Login />} />
      <Route path="/signup" element={user ? <Home /> : <Signup />} />
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
    </Routes>
  );
}
