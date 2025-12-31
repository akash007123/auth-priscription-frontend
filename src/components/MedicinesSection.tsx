import React, { useState, useEffect } from 'react';
import Button from './Button';

interface Medicine {
  id: number;
  name: string;
  dose: string;
}

interface MedicinesSectionProps {
  medicines: Medicine[];
  onChange: (medicines: Medicine[]) => void;
}

export default function MedicinesSection({ medicines: initialMedicines, onChange }: MedicinesSectionProps) {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);

  useEffect(() => {
    setMedicines(initialMedicines);
  }, [initialMedicines]);

  const addMedicine = () => {
    const newId = Math.max(...medicines.map(m => m.id)) + 1;
    const newMedicines = [...medicines, { id: newId, name: '', dose: '' }];
    setMedicines(newMedicines);
    onChange(newMedicines);
  };

  const removeMedicine = (id: number) => {
    const newMedicines = medicines.filter(m => m.id !== id);
    setMedicines(newMedicines);
    onChange(newMedicines);
  };

  const updateMedicine = (id: number, field: 'name' | 'dose', value: string) => {
    const newMedicines = medicines.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    );
    setMedicines(newMedicines);
    onChange(newMedicines);
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-900">Medicines</h2>
      {medicines.map((medicine, index) => (
        <div key={medicine.id} className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Medicine {index + 1}
            </label>
            <input
              type="text"
              value={medicine.name}
              onChange={(e) => updateMedicine(medicine.id, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter medicine name"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Dose
            </label>
            <input
              type="text"
              value={medicine.dose}
              onChange={(e) => updateMedicine(medicine.id, 'dose', e.target.value)}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter dose"
            />
          </div>
          <div className="sm:pt-6">
            <Button
              variant="ghost"
              onClick={() => removeMedicine(medicine.id)}
              className="text-red-600 hover:text-red-800 w-full sm:w-auto"
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      <Button onClick={addMedicine} variant="primary">
        Add Medicine
      </Button>
    </div>
  );
}