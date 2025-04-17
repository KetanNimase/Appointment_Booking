
import axios from 'axios';
import { 
  Location, 
  Provider, 
  OfficeHours, 
  AppointmentReason, 
  Appointment,
  AppointmentRequest
} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

export const getLocations = async (): Promise<Location[]> => {
  try {
    const response = await api.get<Location[]>('/locations');
    console.log('Locations response:', response.data); // For debugging
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const getLocationById = async (id: number): Promise<Location> => {
  const response = await api.get<Location>(`/locations/${id}`);
  return response.data;
};

// Provider endpoints
export const getProviders = async (): Promise<Provider[]> => {
  const response = await api.get<Provider[]>('/providers');
  return response.data;
};

export const getProvidersByLocation = async (locationId: number): Promise<Provider[]> => {
  const response = await api.get<Provider[]>(`/locations/${locationId}/providers`);
  return response.data;
};

// Office hours endpoints
export const getOfficeHoursByLocation = async (locationId: number): Promise<OfficeHours[]> => {
  const response = await api.get<OfficeHours[]>(`/locations/${locationId}/hours`);
  return response.data;
};

// Appointment reasons endpoint
export const getAppointmentReasons = async (): Promise<AppointmentReason[]> => {
  const response = await api.get<AppointmentReason[]>('/appointment-reasons');
  return response.data;
};

// Create appointment
export const createAppointment = async (appointmentData: AppointmentRequest): Promise<Appointment> => {
  const response = await api.post<Appointment>('/appointments', appointmentData);
  return response.data;
};

export default api;
