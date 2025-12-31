import axios from 'axios';

export interface Prescription {
  _id: string;
  doctorId?: {
    _id: string;
    name: string;
    clinicHospitalName?: string;
    qualification?: string;
    registrationNo?: string;
    address?: string;
    mobile?: string;
    logoPic?: string;
  };
  patientData: {
    name: string;
    age: string;
    gender: string;
    diagnosis: string;
    date: string;
  };
  medicines: {
    id: number;
    name: string;
    dose: string;
  }[];
  note: string;
}

export const getPrescriptions = (params?: { search?: string; fromDate?: string; toDate?: string }): Promise<Prescription[]> => {
  return axios.get('/api/prescriptions', { params }).then(res => res.data);
};

export const getPrescription = (id: string): Promise<Prescription> =>
  axios.get(`/api/prescriptions/${id}`).then(res => res.data);

export const createPrescription = (data: Omit<Prescription, '_id' | 'doctorId'>): Promise<Prescription> =>
  axios.post('/api/prescriptions', data).then(res => res.data);

export const updatePrescription = (id: string, data: Omit<Prescription, '_id' | 'doctorId'>): Promise<Prescription> =>
  axios.put(`/api/prescriptions/${id}`, data).then(res => res.data);

export const deletePrescription = (id: string): Promise<void> =>
  axios.delete(`/api/prescriptions/${id}`);