import React, { useState, useEffect } from 'react';

interface PatientFormProps {
  patientData: PatientData;
  onChange: (data: PatientData) => void;
}

export interface PatientData {
  name: string;
  age: string;
  gender: string;
  diagnosis: string;
  date: string;
}

export default function PatientForm({ patientData, onChange }: PatientFormProps) {
  const [data, setData] = useState<PatientData>(patientData);

  useEffect(() => {
    setData(patientData);
  }, [patientData]);

  const handleChange = (field: keyof PatientData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onChange(newData);
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-900">Patient Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Patient Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="Enter patient name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Age
          </label>
          <input
            type="number"
            value={data.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="Enter age"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Gender
          </label>
          <select
            value={data.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Date
          </label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-blue-800 mb-1">
          Diagnosis
        </label>
        <textarea
          value={data.diagnosis}
          onChange={(e) => handleChange('diagnosis', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          placeholder="Enter diagnosis"
        />
      </div>
    </div>
  );
}