import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('Login successful', 'success');
      // Redirect based on role
      if (user?.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col lg:flex-row">
      {/* Left side - Hero Section */}
      <div className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="relative h-full flex flex-col items-center justify-center p-8 lg:p-12">
          {/* Animated background elements */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          
          <div className="relative z-10 text-center max-w-2xl">
            {/* Logo with animation */}
            <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-white rounded-full blur-md opacity-30"></div>
                <img 
                  src="/Dlogo.png" 
                  alt="Prescription Maker Logo" 
                  className="relative w-auto h-28 mx-auto drop-shadow-2xl"
                />
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Prescription<span className="text-blue-200">Maker</span>
            </h1>
            
            {/* Tagline */}
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed font-light">
              Transforming healthcare management with intelligent prescription solutions
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

      {/* Right side - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full">
          <Card className="shadow-2xl border border-gray-200/50 rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm">
            {/* Decorative header */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <div className="p-8 sm:p-10">
              {/* Mobile logo */}
              <div className="lg:hidden mb-8 text-center">
                <img 
                  src="/Dlogo.png" 
                  alt="Logo" 
                  className="w-auto h-16 mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900">
                  PrescriptionMaker
                </h2>
              </div>
              
              {/* Welcome text */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome Back
                </h2>
                <p className="mt-2 text-gray-600">
                  Sign in to access your prescription dashboard
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50 hover:bg-white"
                      placeholder="doctor@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Password
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-gray-50 hover:bg-white"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                
                {/* Submit Button */}
                <div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-3"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                {/* Social Login (Optional) */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                      <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                      <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.27497 6.60986C0.464966 8.22986 0 10.0599 0 11.9999C0 13.9399 0.464966 15.7699 1.27497 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                      <path d="M12.0003 24C15.2403 24 17.9653 22.935 19.9453 21.095L16.0803 18.095C15.0053 18.82 13.6203 19.25 12.0003 19.25C8.87028 19.25 6.21525 17.14 5.27028 14.295L1.28027 17.39C3.25527 21.31 7.31028 24 12.0003 24Z" fill="#34A853"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                  </button>
                </div>
              </form>
              
              {/* Sign up link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors group"
                  >
                    Sign up now
                    <span className="inline-block ml-1 transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </Card>
          
          {/* Footer text */}
          <p className="mt-6 text-center text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            <br />
            © {new Date().getFullYear()} PrescriptionMaker. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;