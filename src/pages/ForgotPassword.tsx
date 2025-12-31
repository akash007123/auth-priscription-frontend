import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/Button';
import Card from '../components/Card';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });

      setEmailSent(true);
      addToast('Password reset email sent successfully', 'success');
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to send reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <div className="relative h-full flex flex-col items-center justify-center p-8 lg:p-12">
            <div className="text-center max-w-2xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Check Your Email
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed font-light">
                We've sent a password reset link to your email address.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="max-w-md w-full">
            <Card className="shadow-2xl border border-gray-200/50 rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm">
              <div className="p-8 sm:p-10">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Email Sent
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Check your inbox for the password reset link.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back to Login
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col lg:flex-row">
      <div className="lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="relative h-full flex flex-col items-center justify-center p-8 lg:p-12">
          <div className="text-center max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Forgot Password?
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed font-light">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full">
          <Card className="shadow-2xl border border-gray-200/50 rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm">
            <div className="p-8 sm:p-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900">
                  Reset Password
                </h2>
                <p className="mt-2 text-gray-600">
                  Enter your email address to receive a password reset link.
                </p>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
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
                <div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </div>
              </form>
              <div className="mt-8 text-center">
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors group"
                >
                  <ArrowLeft className="inline-block mr-1 w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;