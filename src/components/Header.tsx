import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

export default function Header() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-300 pb-4">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* LEFT: Logo + User Info */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="rounded-lg p-2 flex items-center justify-center w-14 h-14">
              {user.role === 'Doctor' && user.logoPic ? (
                <img
                  src={user.logoPic}
                  alt="Clinic Logo"
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
              )}
            </div>
            {/* User Name/Email */}
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-teal-800">
                {user.role === 'Doctor' ? `Dr. ${user.name}` : `Admin: ${user.email}`}
              </h1>
            </div>
          </div>

          {/* RIGHT: Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/prescriptions">
              <Button variant="primary">
                View Prescriptions
              </Button>
            </Link>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
