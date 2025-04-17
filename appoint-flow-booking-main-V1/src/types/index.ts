
// Define types based on database schema
export interface Location {
  id: number;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
}

export interface Provider {
  id: number;
  name: string;
  location_id: number;
  specialization: string;
}

export interface OfficeHours {
  id: number;
  location_id: number;
  day_of_week: string;
  opening_time: string;
  closing_time: string;
}

export interface AppointmentReason {
  id: number;
  name: string;
  description: string;
}

export interface PatientDetails {
  id: number;
  appointment_id: number;
  legal_first_name: string;
  last_name: string;
  preferred_name?: string;
  dob: string;
}

export interface VerificationCode {
  id: number;
  appointment_id: number;
  code: string;
  expires_at: string;
  created_at: string;
}

export interface Appointment {
  id: number;
  location_id: number;
  provider_id?: number;
  appointment_date: string;
  appointment_time: string;
  patient_name: string;
  email: string;
  phone: string;
  reason_id?: number;
  verification_status: 'pending' | 'verified';
}

export interface AppointmentRequest {
  id: number;
  location_id: number;
  provider_id?: number;
  appointment_date: string;
  appointment_time: string;
  patient_name: string;
  email: string;
  phone: string;
  reason_id?: number;
}

export interface AppointmentResponse extends Appointment {
  location?: Location;
  provider?: Provider;
  reason?: AppointmentReason;
  patient_details?: PatientDetails;
}
