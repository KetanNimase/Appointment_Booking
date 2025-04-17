import { Provider } from './common';

export interface AppointmentRequest {
  id: string;
  patient_name: string;
  email: string;
  phone?: string;
  appointment_date: string;
  appointment_time: string;
  provider: Provider;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
}

export interface BookedSlot {
  id: number;
  providerId: number;
  date: string;
  time: string;
  patientName: string;
  createdAt: string;
}

export interface BookSlotRequest {
  providerId: number;
  date: string;
  time: string;
  patientName: string;
}