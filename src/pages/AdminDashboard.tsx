import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Header from '../components/Header';
import Modal from '../components/Modal';
import UserViewModal from '../components/UserViewModal';
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
  Eye,
  Edit2,
  Trash2,
  Search,
  Download,
  UserPlus,
  Bell,
  LogOut,
  BarChart3,
  HelpCircle,
  Calendar,
  TrendingUp,
  Briefcase,
  Lock,
  Unlock,
  XCircle,
  AlertCircle,
  ChevronRight
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
    status: 'Active' as 'Active' | 'Inactive' 
  });

  // Dashboard stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDoctors: 0,
    totalAdmins: 0,
    newUsersThisMonth: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalUsers = users.length;
    const activeDoctors = users.filter(u => u.role === 'Doctor' && u.status === 'Active').length;
    const totalAdmins = users.filter(u => u.role === 'Admin').length;
    const newUsersThisMonth = users.filter(u => {
      const createdDate = new Date(u.createdAt);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
    }).length;

    setStats({ totalUsers, activeDoctors, totalAdmins, newUsersThisMonth });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobile?.includes(searchQuery);
    
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

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
      status: user.status 
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, active: true },
    { id: 'users', label: 'Users', icon: Users, active: false },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText, active: false },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, active: false },
    { id: 'settings', label: 'Settings', icon: Settings, active: false },
    { id: 'support', label: 'Support', icon: HelpCircle, active: false },
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
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.active && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
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
            {/* Dashboard Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your system.</p>
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

              {/* User Management Section */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Section Header */}
                <div className="px-6 py-5 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                      <p className="text-sm text-gray-600 mt-1">Manage all system users and their permissions</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                        />
                      </div>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="All">All Roles</option>
                        <option value="Doctor">Doctors</option>
                        <option value="Admin">Admins</option>
                      </select>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="py-16 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-3 text-gray-600">Loading users...</p>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  {user.profilePic ? (
                                    <img
                                      className="h-10 w-10 rounded-full ring-2 ring-white"
                                      src={user.profilePic}
                                      alt={user.name}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                      <UserCircle className="w-6 h-6 text-gray-600" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.role === 'Doctor' ? `Dr. ${user.name}` : user.name}
                                  </div>
                                  {user.role === 'Doctor' && (
                                    <div className="text-xs text-gray-500 flex items-center">
                                      <Briefcase className="w-3 h-3 mr-1" />
                                      {user.qualification || 'Medical Practitioner'}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.email}</div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.mobile || 'Not provided'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === 'Doctor' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                <Shield className="w-3 h-3 mr-1" />
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`h-2 w-2 rounded-full mr-2 ${
                                  user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                                <span className={`text-sm font-medium ${
                                  user.status === 'Active' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {user.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {formatDate(user.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleView(user)}
                                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Edit User"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(user.id, user.status)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    user.status === 'Active'
                                      ? 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                                  }`}
                                  title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                >
                                  {user.status === 'Active' ? (
                                    <Lock className="w-4 h-4" />
                                  ) : (
                                    <Unlock className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDelete(user)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  
                  {filteredUsers.length === 0 && !loading && (
                    <div className="py-16 text-center">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>

                {/* Table Footer */}
                {filteredUsers.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
                        <span className="font-medium">{users.length}</span> users
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg">
                          Previous
                        </button>
                        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg">
                          1
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg">
                          2
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg">
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
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