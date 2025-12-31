import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  // Navigation items
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Squares2X2Icon,
      active: location.pathname === '/dashboard'
    },
    {
      name: 'Prescriptions',
      path: '/prescriptions',
      icon: DocumentTextIcon,
      active: location.pathname.startsWith('/prescriptions')
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LEFT: Logo + Navigation */}
          <div className="flex items-center space-x-8">
            {/* Company Logo */}
            <div className="items-center space-x-3">
              <img
                src='/Dlogo.png'
                alt="Sosapient Logo"
                className="w-32 h-auto object-contain"
              />
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Navigation Toggle */}
            <div className="md:hidden">
              <Link to="/prescriptions">
                <Button
                  variant="secondary"
                  size="sm"
                  className="!p-2"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Desktop View Prescriptions Button */}
            <div className="hidden md:block">
              <Link to="/prescriptions">
                <Button
                  variant="primary"
                  size="md"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-1000 shadow-sm"
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>Prescriptions</span>
                </Button>
              </Link>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-all hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={user.profilePic || '/default-avatar.png'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const img = e.currentTarget;
                      img.onerror = null;
                      img.src = '/default-avatar.png';
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                </div>
                <ChevronDownIcon 
                  className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden animate-fadeIn">
                  {/* Profile Section */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.profilePic || '/default-avatar.png'}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.role === 'Doctor' ? `Dr. ${user.name}` : user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <p className="text-xs text-teal-600 font-medium mt-1">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserCircleIcon className="w-5 h-5 text-gray-400" />
                      <span>My Profile</span>
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-100 mt-2 pt-3">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center px-3 py-2 rounded-lg ${
                  item.active
                    ? 'text-teal-600'
                    : 'text-gray-500 hover:text-teal-600'
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}