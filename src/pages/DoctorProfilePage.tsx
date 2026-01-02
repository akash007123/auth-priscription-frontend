import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import Header from '../components/Header';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Award,
  FileText,
  Stethoscope,
  Calendar,
  Pill,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  email: string;
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
}

interface Prescription {
  id: string;
  patientData: {
    name: string;
    age: string;
    gender: string;
    diagnosis: string;
    date: string;
  };
  medicines: Array<{
    id: number;
    name: string;
    dose: string;
  }>;
  note: string;
  createdAt: string;
}

const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPrescriptions, setTotalPrescriptions] = useState(0);

  useEffect(() => {
    if (id) {
      fetchDoctorProfile();
      fetchPrescriptions(1);
    }
  }, [id]);

  const fetchDoctorProfile = async () => {
    try {
      const response = await axios.get(`/api/admin/users/${id}`);
      setDoctor(response.data.user);
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to fetch doctor profile', 'error');
      navigate('/admin');
    }
  };

  const fetchPrescriptions = async (page: number) => {
    setPrescriptionLoading(true);
    try {
      const response = await axios.get(`/api/admin/doctors/${id}/prescriptions?page=${page}&limit=10`);
      setPrescriptions(response.data.prescriptions);
      setTotalPages(response.data.pagination.totalPages);
      setTotalPrescriptions(response.data.pagination.totalPrescriptions);
      setCurrentPage(response.data.pagination.currentPage);
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to fetch prescriptions', 'error');
    } finally {
      setPrescriptionLoading(false);
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPrescriptions(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Doctor not found</h2>
            <button
              onClick={() => navigate('/admin')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Admin Dashboard</span>
          </button>

          {/* Doctor Profile Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                {doctor.profilePic ? (
                  <img
                    src={doctor.profilePic}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">Dr. {doctor.name}</h1>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{doctor.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{doctor.mobile}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{doctor.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{doctor.clinicHospitalName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{doctor.qualification}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Reg: {doctor.registrationNo}</span>
                  </div>
                  {doctor.specialty && (
                    <div className="flex items-center space-x-3">
                      <Stethoscope className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{doctor.specialty}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Joined {formatDate(doctor.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
                  <p className="text-gray-600 mt-1">All prescriptions created by Dr. {doctor.name}</p>
                </div>
                <div className="text-sm text-gray-500">
                  Total: {totalPrescriptions} prescriptions
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {prescriptionLoading ? (
                <div className="py-16 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-3 text-gray-600">Loading prescriptions...</p>
                </div>
              ) : prescriptions.length === 0 ? (
                <div className="py-16 text-center">
                  <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
                  <p className="text-gray-600">This doctor hasn't created any prescriptions yet.</p>
                </div>
              ) : (
                prescriptions.map((prescription) => (
                  <div key={prescription.id} className="p-8 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {prescription.patientData.name}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {prescription.patientData.age} years, {prescription.patientData.gender}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(prescription.createdAt)}
                          </span>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Diagnosis:</strong> {prescription.patientData.diagnosis}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Date:</strong> {prescription.patientData.date}
                          </p>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Medicines:</h4>
                          <div className="space-y-1">
                            {prescription.medicines.map((medicine) => (
                              <div key={medicine.id} className="text-sm text-gray-600 flex items-center space-x-2">
                                <Pill className="w-4 h-4 text-blue-500" />
                                <span><strong>{medicine.name}</strong> - {medicine.dose}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {prescription.note && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Note:</h4>
                            <p className="text-sm text-gray-600">{prescription.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorProfilePage;