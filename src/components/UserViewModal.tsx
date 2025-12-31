import React from 'react';
import Modal from './Modal';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  role: 'Admin' | 'Doctor';
  email: string;
  name: string;
  mobile: string;
  clinicHospitalName: string;
  registrationNo: string;
  address: string;
  qualification: string;
  profilePic: string | null;
  logoPic: string | null;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

interface UserViewModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UserViewModal: React.FC<UserViewModalProps> = ({ open, onClose, user }) => {
  if (!user) return null;

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-rose-100 text-rose-800 border-rose-200';
  };

  const getRoleColor = (role: string) => {
    return role === 'Doctor'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const userDetails = [
    { label: 'Full Name', value: user.name, icon: UserIcon, color: 'text-gray-700' },
    { label: 'Email Address', value: user.email, icon: EnvelopeIcon, color: 'text-gray-700' },
    { label: 'Mobile Number', value: user.mobile, icon: PhoneIcon, color: 'text-gray-700' },
    { label: 'Clinic/Hospital', value: user.clinicHospitalName, icon: BuildingOfficeIcon, color: 'text-gray-700' },
    { label: 'Qualification', value: user.qualification, icon: AcademicCapIcon, color: 'text-gray-700' },
    { label: 'Registration No.', value: user.registrationNo, icon: DocumentTextIcon, color: 'text-gray-700' },
    { label: 'Address', value: user.address, icon: MapPinIcon, color: 'text-gray-700', spanFull: true },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              <p className="text-sm text-gray-500 mt-1">Complete user information</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-5">
          {/* User Profile Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 pb-6 border-b border-gray-200">
            {/* Profile Images */}
            <div className="flex flex-col items-center space-y-4">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    {user.status}
                  </span>
                </div>
              </div>

              {/* Logo Picture (for Doctors) */}
              {user.role === 'Doctor' && user.logoPic && (
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Clinic Logo</p>
                  <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 flex items-center justify-center p-2 shadow-sm">
                    <img
                      src={user.logoPic}
                      alt="Clinic Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* User Info Summary */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {user.role === 'Doctor' ? `Dr. ${user.name}` : user.name}
                </h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
                  <ShieldCheckIcon className="w-4 h-4 mr-1" />
                  {user.role}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-1 rounded mt-1">
                    {user.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PhotoIcon className="w-5 h-5 mr-2 text-gray-400" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userDetails.map((detail, index) => (
                <div 
                  key={index} 
                  className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${detail.spanFull ? 'md:col-span-2' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${detail.color.replace('text-', 'bg-').replace('-700', '-100')}`}>
                      <detail.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        {detail.label}
                      </p>
                      <p className="text-gray-900 break-words">
                        {detail.value || <span className="text-gray-400 italic">Not provided</span>}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information Section (Expandable) */}
          <div className="mt-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Notes</h4>
              <p className="text-sm text-gray-500">
                {/* You could add a notes field to the User interface */}
                No additional notes available.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Add edit functionality here
                console.log('Edit user:', user.id);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-sm transition-all hover:shadow"
            >
              Edit User
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserViewModal;