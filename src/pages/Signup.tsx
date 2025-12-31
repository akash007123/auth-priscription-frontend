import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/Button';
import {
  User, Mail, Phone, Lock, MapPin, Building,
  GraduationCap, IdCard, Upload, Camera,
  UserPlus, Check
} from 'lucide-react';

const Signup: React.FC = () => {
  const role = 'Doctor';
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
  const [activeStep, setActiveStep] = useState(1);
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profilePic' | 'logoPic') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (field === 'profilePic') setProfilePic(file);
      else setLogoPic(file);
      
      // Preview logic can be added here
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
      addToast('Signup successful! Welcome to PrescriptionMaker', 'success');
      navigate('/');
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Professional Details' },
    { number: 3, label: 'Upload Files' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col lg:flex-row">
      {/* Left side - Hero Section */}
      <div className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="relative h-full flex flex-col items-center justify-center p-8 lg:p-12">
          <div className="relative z-10 text-center max-w-2xl">
            {/* Logo */}
            <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-white rounded-full blur-md opacity-30"></div>
              <img 
                src="/Dlogo.png" 
                alt="Prescription Maker Logo" 
                className="relative w-auto h-28 mx-auto drop-shadow-2xl"
              />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Join<span className="text-blue-200">Prescription</span>Maker
            </h1>
            
            {/* Tagline */}
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed font-light">
              Start your journey towards efficient healthcare management today
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: '⚡',
                  title: 'Instant Prescriptions',
                  desc: 'Create prescriptions in seconds'
                },
                {
                  icon: '🔒',
                  title: 'HIPAA Compliant',
                  desc: 'Secure patient data protection'
                },
                {
                  icon: '📊',
                  title: 'Smart Analytics',
                  desc: 'Track prescriptions & insights'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="text-3xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Stats */}
            <div className="flex justify-center space-x-8 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-blue-200">Medical Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1M+</div>
                <div className="text-sm text-blue-200">Prescriptions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-blue-200">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2
                    ${activeStep >= step.number
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                    }
                    transition-all duration-300
                  `}>
                    {activeStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{step.number}</span>
                    )}
                  </div>
                  <span className={`
                    text-sm font-medium
                    ${activeStep >= step.number ? 'text-indigo-700' : 'text-gray-500'}
                  `}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${(activeStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
            {/* Decorative header */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <div className="p-8 sm:p-10">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                  <UserPlus className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Create Your Account
                </h2>
                <p className="mt-2 text-gray-600">
                  Join thousands of medical professionals using PrescriptionMaker
                </p>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Step 1: Basic Information */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Address
                        </div>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Mobile */}
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Mobile Number
                        </div>
                      </label>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="9632587410"
                        value={formData.mobile}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                          <Lock className="w-4 h-4 mr-2" />
                          Password
                        </div>
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Name (for Doctor only) */}
                    {role === 'Doctor' && (
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Full Name
                          </div>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="Dr. Shashank Bhargawa"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 3: Professional Details (Doctor only) */}
                {role === 'Doctor' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Clinic/Hospital Name */}
                      <div>
                        <label htmlFor="clinicHospitalName" className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-2" />
                            Clinic/Hospital Name
                          </div>
                        </label>
                        <input
                          id="clinicHospitalName"
                          name="clinicHospitalName"
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="Medical Center Name"
                          value={formData.clinicHospitalName}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Qualification */}
                      <div>
                        <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Qualification
                          </div>
                        </label>
                        <input
                          id="qualification"
                          name="qualification"
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="MD, MBBS, etc."
                          value={formData.qualification}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Registration No */}
                      <div>
                        <label htmlFor="registrationNo" className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center">
                            <IdCard className="w-4 h-4 mr-2" />
                            Registration Number
                          </div>
                        </label>
                        <input
                          id="registrationNo"
                          name="registrationNo"
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                          placeholder="Medical license number"
                          value={formData.registrationNo}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Clinic Address
                        </div>
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="Full clinic address including city and zip code"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: File Uploads */}
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      <div className="flex items-center">
                        <Camera className="w-5 h-5 mr-2 text-indigo-600" />
                        Profile Picture
                      </div>
                    </label>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                          {profilePic ? (
                            <img 
                              src={URL.createObjectURL(profilePic)} 
                              alt="Profile preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        {profilePic && (
                          <button
                            type="button"
                            onClick={() => setProfilePic(null)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          id="profilePic"
                          type="file"
                          accept="image/*"
                          required
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'profilePic')}
                        />
                        <label
                          htmlFor="profilePic"
                          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <Upload className="w-5 h-5 mr-2" />
                          {profilePic ? 'Change Photo' : 'Upload Photo'}
                        </label>
                        <p className="text-sm text-gray-500 mt-2">
                          Recommended: Square image, max 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logo Picture (Doctor only) */}
                  {role === 'Doctor' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        <div className="flex items-center">
                          <Building className="w-5 h-5 mr-2 text-indigo-600" />
                          Clinic/Hospital Logo
                        </div>
                      </label>
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                            {logoPic ? (
                              <img 
                                src={URL.createObjectURL(logoPic)} 
                                alt="Logo preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Building className="w-12 h-12 text-gray-400" />
                            )}
                          </div>
                          {logoPic && (
                            <button
                              type="button"
                              onClick={() => setLogoPic(null)}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            id="logoPic"
                            type="file"
                            accept="image/*"
                            required
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'logoPic')}
                          />
                          <label
                            htmlFor="logoPic"
                            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <Upload className="w-5 h-5 mr-2" />
                            {logoPic ? 'Change Logo' : 'Upload Logo'}
                          </label>
                          <p className="text-sm text-gray-500 mt-2">
                            Clinic or hospital logo, max 2MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-3"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <UserPlus className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors group"
                    >
                      Sign in now
                      <span className="inline-block ml-1 transform group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Footer text */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Your data is encrypted and secure. We never share your information with third parties.
            <br />
            © {new Date().getFullYear()} PrescriptionMaker. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;