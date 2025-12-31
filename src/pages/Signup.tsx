import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/Button';

const Signup: React.FC = () => {
  const [role, setRole] = useState<'Admin' | 'Doctor'>('Doctor');
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    password: '',
    name: '',
    address: '',
    clinicHospitalName: '',
    qualification: '',
    registrationNo: '',
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [logoPic, setLogoPic] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profilePic' | 'logoPic') => {
    if (e.target.files && e.target.files[0]) {
      if (field === 'profilePic') setProfilePic(e.target.files[0]);
      else setLogoPic(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('role', role);
      data.append('email', formData.email);
      data.append('mobile', formData.mobile);
      data.append('password', formData.password);
      if (role === 'Doctor') {
        data.append('name', formData.name);
        data.append('address', formData.address);
        data.append('clinicHospitalName', formData.clinicHospitalName);
        data.append('qualification', formData.qualification);
        data.append('registrationNo', formData.registrationNo);
      }
      if (profilePic) data.append('profilePic', profilePic);
      if (role === 'Doctor' && logoPic) data.append('logoPic', logoPic);

      await signup(data);
      addToast('Signup successful', 'success');
      navigate('/');
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'Admin' | 'Doctor')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Doctor">Doctor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
              Mobile
            </label>
            <input
              id="mobile"
              name="mobile"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.mobile}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {role === 'Doctor' && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="clinicHospitalName" className="block text-sm font-medium text-gray-700">
                  Clinic/Hospital Name
                </label>
                <input
                  id="clinicHospitalName"
                  name="clinicHospitalName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.clinicHospitalName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                  Qualification
                </label>
                <input
                  id="qualification"
                  name="qualification"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.qualification}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700">
                  Registration No.
                </label>
                <input
                  id="registrationNo"
                  name="registrationNo"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.registrationNo}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <input
              id="profilePic"
              name="profilePic"
              type="file"
              accept="image/*"
              required
              className="mt-1 block w-full"
              onChange={(e) => handleFileChange(e, 'profilePic')}
            />
          </div>

          {role === 'Doctor' && (
            <div>
              <label htmlFor="logoPic" className="block text-sm font-medium text-gray-700">
                Logo Picture
              </label>
              <input
                id="logoPic"
                name="logoPic"
                type="file"
                accept="image/*"
                required
                className="mt-1 block w-full"
                onChange={(e) => handleFileChange(e, 'logoPic')}
              />
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;