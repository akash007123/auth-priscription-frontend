import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PrescriptionsList from '../components/PrescriptionsList';
import PrescriptionPreview from '../components/PrescriptionPreview';
import Modal from '../components/Modal';
import { useReactToPrint } from 'react-to-print';
import { useToast } from '../contexts/ToastContext';
import { Prescription, getPrescriptions, deletePrescription } from '../services/api';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [printPrescription, setPrintPrescription] = useState<Prescription | null>(null);
  const [previewPrescription, setPreviewPrescription] = useState<Prescription | null>(null);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [inputSearch, setInputSearch] = useState('');
  const [inputFromDate, setInputFromDate] = useState('');
  const [inputToDate, setInputToDate] = useState('');
  const prescriptionRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleActualPrint = useReactToPrint({
    contentRef: prescriptionRef,
  });

  const handlePreviewPrint = useReactToPrint({
    contentRef: previewRef,
  });

  useEffect(() => {
    getPrescriptions({ search, fromDate, toDate }).then(setPrescriptions).catch(console.error);
  }, [search, fromDate, toDate]);

  const handleLoad = (prescription: Prescription) => {
    navigate('/', { state: { prescription } });
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePrescription(id);
      setPrescriptions(prescriptions.filter(p => p._id !== id));
      addToast('Prescription deleted successfully', 'success');
    } catch (error) {
      addToast('Failed to delete prescription', 'error');
    }
  };

  const handlePrint = (prescription: Prescription) => {
    setPrintPrescription(prescription);
  };

  const handlePreview = (prescription: Prescription) => {
    setPreviewPrescription(prescription);
  };

  const handleClosePrint = () => {
    setPrintPrescription(null);
  };

  const handleClosePreview = () => {
    setPreviewPrescription(null);
  };

  const handleFilterClick = () => {
    setSearch(inputSearch);
    setFromDate(inputFromDate);
    setToDate(inputToDate);
  };

  const handleResetClick = () => {
    setInputSearch('');
    setInputFromDate('');
    setInputToDate('');
    setSearch('');
    setFromDate('');
    setToDate('');
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">Prescriptions</h1>
        <PrescriptionsList
          prescriptions={prescriptions}
          onLoad={handleLoad}
          onDelete={handleDelete}
          onPrint={handlePrint}
          onPreview={handlePreview}
          search={inputSearch}
          fromDate={inputFromDate}
          toDate={inputToDate}
          onSearchChange={setInputSearch}
          onFromDateChange={setInputFromDate}
          onToDateChange={setInputToDate}
          onFilterClick={handleFilterClick}
          onResetClick={handleResetClick}
        />
      </main>
      <Modal open={!!printPrescription} onClose={handleClosePrint}>
        {printPrescription && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Print Prescription</h2>
              <button onClick={handleActualPrint} className="bg-blue-600 text-white px-4 py-2 rounded">
                Print
              </button>
            </div>
            <PrescriptionPreview
              ref={prescriptionRef}
              patientData={printPrescription.patientData}
              medicines={printPrescription.medicines}
              note={printPrescription.note}
            />
          </div>
        )}
      </Modal>
      <Modal open={!!previewPrescription} onClose={handleClosePreview}>
        {previewPrescription && (
          <div>
            <div className="flex justify-between items-center mb-4">
              {/* <h2 className="text-xl font-semibold">Preview Prescription</h2> */}
              <button onClick={handlePreviewPrint} className="bg-orange-500 text-white px-4 py-2 ml-10 mt-5 rounded hover:bg-orange-600">
                Print
              </button>
            </div>
            <PrescriptionPreview
              ref={previewRef}
              patientData={previewPrescription.patientData}
              medicines={previewPrescription.medicines}
              note={previewPrescription.note}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}