import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Header from '../components/Header';
import Modal from '../components/Modal';
import UserViewModal from '../components/UserViewModal';

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
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', mobile: '', role: 'Doctor' as 'Admin' | 'Doctor', status: 'Active' as 'Active' | 'Inactive' });

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleView = (user: User) => {
    setViewUser(user);
    setIsViewModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, mobile: user.mobile, role: user.role, status: user.status });
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

  return (
    <>
      <Header />
      <div className="flex" style={{ height: 'calc(100vh - 4rem)' }} >
        {/* Side Navigation */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <div className="px-6 py-3 bg-gray-200 text-gray-700 font-medium">
              Dashboard
            </div>
            <div className="px-6 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer">
              Users
            </div>
            <div className="px-6 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer">
              Prescriptions
            </div>
            <div className="px-6 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer">
              Settings
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">All Users</h2>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profile
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">
                          {user.profilePic ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.profilePic}
                              alt="Profile"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-600 text-sm">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {user.name || 'N/A'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {user.mobile}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {user.role}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {user.status}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <button onClick={() => handleView(user)} className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                          <button onClick={() => handleEdit(user)} className="text-green-600 hover:text-green-900 mr-2">Edit</button>
                          <button onClick={() => handleDelete(user)} className="text-red-600 hover:text-red-900 mr-2">Delete</button>
                          <button onClick={() => handleStatusChange(user.id, user.status)} className="text-yellow-600 hover:text-yellow-900">
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <UserViewModal open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} user={viewUser} />
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {editUser && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <input type="text" value={editForm.mobile} onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'Admin' | 'Doctor' })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                  <option value="Doctor">Doctor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'Active' | 'Inactive' })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
            </form>
          </div>
        )}
      </Modal>
      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        {deleteUser && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Delete User</h2>
            <p>Are you sure you want to delete {deleteUser.name}?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminDashboard;