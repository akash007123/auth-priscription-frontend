import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Header from '../components/Header';
import Modal from '../components/Modal';
import UserViewModal from '../components/UserViewModal';
import UserManagementSection from '../components/UserManagementSection';
import {
  Users,
  FileText,
  Settings,
  Home,
  UserCircle,
  Mail,
  Phone,
  Shield,
  Activity,
  Download,
  UserPlus,
  Bell,
  LogOut,
  BarChart3,
  HelpCircle,
  Calendar,
  TrendingUp,
  XCircle,
  AlertCircle,
  ChevronRight,
  Lock,
  MapPin,
  Building,
  Award,
  FileText as FileIcon,
  Stethoscope
} from 'lucide-react';

interface User {
  id: string;
  role: 'Admin' | 'Doctor';
  email: string;
  name: string;
  mobile: string;
  address: string;
  clinicHospitalName: string;
  qualification: string;
  registrationNo: string;
  specialty?: string;
  profilePic: string | null;
  logoPic: string | null;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'Doctor' as 'Admin' | 'Doctor',
    status: 'Active' as 'Active' | 'Inactive',
    password: '',
    address: '',
    clinicHospitalName: '',
    qualification: '',
    registrationNo: '',
    specialty: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Dashboard stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDoctors: 0,
    totalAdmins: 0,
    newUsersThisMonth: 0,
  });

  // Active section state
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [users]);

  // Refetch users when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchUsers(1);
  }, [searchQuery, roleFilter, statusFilter]);

  const fetchUsers = async (page = 1) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (roleFilter !== 'All') params.append('role', roleFilter);
      if (statusFilter !== 'All') params.append('status', statusFilter);

      const response = await axios.get(`/api/admin/users?${params.toString()}`);
      setUsers(response.data.users);
      setTotalPages(response.data.pagination.totalPages);
      setTotalUsers(response.data.pagination.totalUsers);
      setCurrentPage(response.data.pagination.currentPage);
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    // Since we now have paginated data, we'll calculate stats from the current page users
    // For accurate stats, we might need a separate endpoint, but for now we'll use current data
    const activeDoctors = users.filter(u => u.role === 'Doctor' && u.status === 'Active').length;
    const totalAdmins = users.filter(u => u.role === 'Admin').length;
    const newUsersThisMonth = users.filter(u => {
      const createdDate = new Date(u.createdAt);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    }).length;

    setStats({ totalUsers, activeDoctors, totalAdmins, newUsersThisMonth });
  };


  const handleView = (user: User) => {
    setViewUser(user);
    setIsViewModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
      password: '',
      address: user.address,
      clinicHospitalName: user.clinicHospitalName,
      qualification: user.qualification,
      registrationNo: user.registrationNo,
      specialty: user.specialty || ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setDeleteUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteUser) return;
    try {
      await axios.delete(`/api/admin/users/${deleteUser.id}`);
      addToast('User deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to delete user', 'error');
    }
  };

  const handleStatusChange = async (userId: string, currentStatus: 'Active' | 'Inactive') => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await axios.put(`/api/admin/users/${userId}`, { status: newStatus });
      addToast(`User status changed to ${newStatus}`, 'success');
      fetchUsers();
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to change status', 'error');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      await axios.put(`/api/admin/users/${editUser.id}`, editForm);
      addToast('User updated successfully', 'success');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to update user', 'error');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar - Fixed and independently scrollable */}
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Admin Console</h2>
                <p className="text-xs text-gray-400 mt-1">Control Panel v2.1</p>
              </div>
            </div>
          </div>

          {/* Admin Profile - Fixed at top */}
          <div className="px-4 pb-4 flex-shrink-0">
            <div className="bg-gray-800/50 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                    {user?.profilePic ? (
                      <img src={user.profilePic} alt="Admin" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserCircle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-400">Super Admin</p>
                  </div>
                </div>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Scrollable Navigation */}
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.id === activeSection;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                );
              })}
            </nav>

            {/* Logout at bottom of scrollable area */}
            <div className="pt-6 mt-6 border-t border-gray-700">
              <button className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl w-full text-sm font-medium">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content - Scrolls independently */}
        <main className="flex-1 ml-64 overflow-y-auto h-screen">
          {/* Main Content Container */}
          <div className="p-6">
            {activeSection === 'dashboard' && (
              <div className="mb-8">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your system.</p>
                  </div>
                  {/* <div className="flex items-center space-x-3">
                    <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div> */}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-xs text-green-600">+12% from last month</span>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                        <Users className="w-7 h-7 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Active Doctors</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.activeDoctors}</p>
                        <div className="flex items-center mt-2">
                          <Activity className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-xs text-green-600">Currently active</span>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                        <Users className="w-7 h-7 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Administrators</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalAdmins}</p>
                        <div className="flex items-center mt-2">
                          <Shield className="w-4 h-4 text-purple-500 mr-1" />
                          <span className="text-xs text-purple-600">System administrators</span>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                        <Shield className="w-7 h-7 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">New This Month</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.newUsersThisMonth}</p>
                        <div className="flex items-center mt-2">
                          <Calendar className="w-4 h-4 text-orange-500 mr-1" />
                          <span className="text-xs text-orange-600">Monthly growth</span>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                        <Users className="w-7 h-7 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'users' && (
              <div className="mb-8">
                {/* Users Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-2">Manage users, roles, and permissions.</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-sm">
                      <UserPlus className="w-4 h-4" />
                      <span>Add User</span>
                    </button>
                  </div>
                </div>

                <UserManagementSection
                  users={users}
                  loading={loading}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  roleFilter={roleFilter}
                  setRoleFilter={setRoleFilter}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                  formatDate={formatDate}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalUsers={totalUsers}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {activeSection !== 'dashboard' && activeSection !== 'users' && (
              <div className="mb-8">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeSection}</h1>
                    <p className="text-gray-600 mt-2">This section is under development.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <UserViewModal open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} user={viewUser} />
      
      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="max-w-lg">
        {editUser && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                <p className="text-sm text-gray-600 mt-1">Update user information</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={editForm.mobile}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-gray-500 text-xs">(leave empty to keep current)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'Admin' | 'Doctor' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Doctor">Doctor</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'Active' | 'Inactive' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {editForm.role === 'Doctor' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic/Hospital Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={editForm.clinicHospitalName}
                        onChange={(e) => setEditForm({ ...editForm, clinicHospitalName: e.target.value })}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter clinic/hospital name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qualification
                      </label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={editForm.qualification}
                          onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter qualification"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration No
                      </label>
                      <div className="relative">
                        <FileIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={editForm.registrationNo}
                          onChange={(e) => setEditForm({ ...editForm, registrationNo: e.target.value })}
                          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter registration number"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialty
                    </label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={editForm.specialty}
                        onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })}
                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter specialty"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-sm transition-all"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="max-w-md">
        {deleteUser && (
          <div className="p-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Delete User</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{deleteUser.name}</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg shadow-sm transition-all"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminDashboard;