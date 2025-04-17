import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Location, Provider, AppointmentReason, AppointmentRequest } from '../types';

interface AppointmentContextProps {
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  selectedProvider: Provider | null;
  setSelectedProvider: (provider: Provider | null) => void;
  selectedReason: AppointmentReason | null;
  setSelectedReason: (reason: AppointmentReason | null) => void;
  appointmentRequest: AppointmentRequest;
  setAppointmentRequest: (request: AppointmentRequest | ((prev: AppointmentRequest) => AppointmentRequest)) => void;
  resetAppointmentData: () => void;
}

const AppointmentContext = createContext<AppointmentContextProps | undefined>(undefined);

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedReason, setSelectedReason] = useState<AppointmentReason | null>(null);
  const [appointmentRequest, setAppointmentRequest] = useState<AppointmentRequest>({
    id:0,
    location_id: 0,
    provider_id: undefined,
    appointment_date: '',
    appointment_time: '',
    patient_name: '',
    email: '',
    phone: '',
    reason_id: undefined,
  });

  const resetAppointmentData = () => {
    setSelectedLocation(null);
    setSelectedProvider(null);
    setSelectedReason(null);
    setAppointmentRequest({
      id:0,
      location_id: 0,
      provider_id: undefined,
      appointment_date: '',
      appointment_time: '',
      patient_name: '',
      email: '',
      phone: '',
      reason_id: undefined,
    });
  };

  return (
    <AppointmentContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        selectedProvider,
        setSelectedProvider,
        selectedReason,
        setSelectedReason,
        appointmentRequest,
        setAppointmentRequest,
        resetAppointmentData,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
