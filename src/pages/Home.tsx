import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import PatientForm, { PatientData } from '../components/PatientForm';
import MedicinesSection from '../components/MedicinesSection';
import PrescriptionPreview from '../components/PrescriptionPreview';
import Button from '../components/Button';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import { useToast } from '../contexts/ToastContext';
import { Prescription, createPrescription } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Medicine {
  id: number;
  name: string;
  dose: string;
}

export default function Home() {
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: '',
    gender: 'Male',
    diagnosis: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: 1, name: '', dose: '' },
  ]);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const prescriptionRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { addToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (location.state?.prescription) {
      const prescription: Prescription = location.state.prescription;
      setPatientData(prescription.patientData);
      setMedicines(prescription.medicines);
      setNote(prescription.note);
    }
  }, [location.state]);

  const handlePrint = useReactToPrint({
    contentRef: prescriptionRef,
  });

  const handleDownloadPDF = () => {
    if (prescriptionRef.current) {
      const opt = {
        margin: 0,
        filename: 'prescription.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const },
        cssMediaType: 'print' as const,
        pagebreak: { mode: 'avoid-all' as const }
      };
      html2pdf().set(opt).from(prescriptionRef.current).save();
    }
  };

  const handleClearForm = () => {
    setPatientData({
      name: '',
      age: '',
      gender: 'Male',
      diagnosis: '',
      date: new Date().toISOString().split('T')[0],
    });
    setMedicines([{ id: 1, name: '', dose: '' }]);
    setNote('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createPrescription({ patientData, medicines, note });
      addToast('Prescription saved successfully!', 'success');
    } catch (error) {
      addToast('Failed to save prescription', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <PatientForm patientData={patientData} onChange={setPatientData} />
            <MedicinesSection medicines={medicines} onChange={setMedicines} />
            <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter any additional notes"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleSave} variant="primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Prescription'}
              </Button>
              {/* <Button onClick={handleDownloadPDF}>
                Download PDF
              </Button> */}
              <Button onClick={handlePrint}>
                Print
              </Button>
              <Button onClick={handleClearForm} variant="ghost" className="text-red-600">
                Clear Form
              </Button>
            </div>
          </div>
          <div>
            <PrescriptionPreview
              ref={prescriptionRef}
              patientData={patientData}
              medicines={medicines}
              note={note}
            />
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link to="/prescriptions">
            <Button variant="primary">
              View Saved Prescriptions
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}