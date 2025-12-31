import React, { useState } from 'react';
import { Prescription } from '../services/api';
import Button from './Button';
import Modal from './Modal';
import {
  Eye,
  Printer,
  Trash2,
  FileText,
  Calendar,
  Download,
  Search,
  Filter,
  RotateCcw
} from 'lucide-react';

interface PrescriptionsListProps {
  prescriptions: Prescription[];
  onLoad: (prescription: Prescription) => void;
  onDelete: (id: string) => void;
  onPrint: (prescription: Prescription) => void;
  onPreview: (prescription: Prescription) => void;
  onDownload?: (prescription: Prescription) => void;
  isLoading?: boolean;
  search: string;
  fromDate: string;
  toDate: string;
  onSearchChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onFilterClick: () => void;
  onResetClick: () => void;
}

export default function PrescriptionsList({
  prescriptions,
  onLoad,
  onDelete,
  onPrint,
  onPreview,
  onDownload,
  isLoading = false,
  search,
  fromDate,
  toDate,
  onSearchChange,
  onFromDateChange,
  onToDateChange,
  onFilterClick,
  onResetClick
}: PrescriptionsListProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<Prescription | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status?: string) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Prescription History</h2>
            <p className="text-sm text-gray-600 mt-1">
              {prescriptions.length} {prescriptions.length === 1 ? 'prescription' : 'prescriptions'} saved
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="From date"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="To date"
            />
            <Button variant="ghost" className="flex items-center justify-center gap-2" onClick={onFilterClick}>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="ghost" className="flex items-center justify-center gap-2" onClick={onResetClick}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {prescriptions.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Start by creating your first prescription. All saved prescriptions will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="block sm:hidden">
            {prescriptions.map((prescription) => (
              <div key={prescription._id} className="p-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {getInitials(prescription.patientData.name)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {prescription.patientData.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{prescription.patientData.age} years</span>
                      <span className="text-gray-300">•</span>
                      <span>{prescription.patientData.gender}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-600">Diagnosis</p>
                  <p className="text-gray-900 font-medium truncate">
                    {prescription.patientData.diagnosis}
                  </p>
                </div>
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatDate(prescription.patientData.date)}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => onPreview(prescription)}
                    variant="ghost"
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2"
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => onLoad(prescription)}
                    variant="ghost"
                    className="text-gray-600 hover:text-green-600 hover:bg-green-50 p-2"
                    title="View Details"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  {onDownload && (
                    <Button
                      onClick={() => onDownload(prescription)}
                      variant="ghost"
                      className="text-gray-600 hover:text-purple-600 hover:bg-purple-50 p-2"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {/* <Button
                    onClick={() => onPrint(prescription)}
                    variant="ghost"
                    className="text-gray-600 hover:text-orange-600 hover:bg-orange-50 p-2"
                    title="Print"
                  >
                    <Printer className="h-4 w-4" />
                  </Button> */}
                  <Button
                    onClick={() => {
                      setPrescriptionToDelete(prescription);
                      setDeleteModalOpen(true);
                    }}
                    variant="ghost"
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 p-2"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Patient Information
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Diagnosis
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {prescriptions.map((prescription) => (
                    <tr
                      key={prescription._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {getInitials(prescription.patientData.name)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {prescription.patientData.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <span>{prescription.patientData.age} years</span>
                              <span className="text-gray-300">•</span>
                              <span>{prescription.patientData.gender}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="max-w-xs">
                          <p className="text-gray-900 font-medium truncate">
                            {prescription.patientData.diagnosis}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(prescription.patientData.date)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => onPreview(prescription)}
                            variant="ghost"
                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            onClick={() => onLoad(prescription)}
                            variant="ghost"
                            className="text-gray-600 hover:text-green-600 hover:bg-green-50"
                            title="View Details"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>

                          {onDownload && (
                            <Button
                              onClick={() => onDownload(prescription)}
                              variant="ghost"
                              className="text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}

                          {/* <Button
                            onClick={() => onPrint(prescription)}
                            variant="ghost"
                            className="text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                            title="Print"
                          >
                            <Printer className="h-4 w-4" />
                          </Button> */}

                          <Button
                            onClick={() => {
                              setPrescriptionToDelete(prescription);
                              setDeleteModalOpen(true);
                            }}
                            variant="ghost"
                            className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                Showing <span className="font-medium">{prescriptions.length}</span> of{' '}
                <span className="font-medium">{prescriptions.length}</span> prescriptions
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" disabled>
                  Previous
                </Button>
                <span className="text-gray-900 font-medium">1</span>
                <Button variant="ghost" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Confirm Delete</h2>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete the prescription for{' '}
            <span className="font-medium">{prescriptionToDelete?.patientData.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-4 justify-end">
            <Button onClick={() => setDeleteModalOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (prescriptionToDelete) {
                  onDelete(prescriptionToDelete._id);
                }
                setDeleteModalOpen(false);
              }}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              Delete Prescription
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}