
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointment } from '../context/AppointmentContext';
import { useRequestAppointmentData } from '../hooks/useRequestAppointmentData';
import { EmergencyNotice } from '../components/appointment/EmergencyNotice';
import { AppointmentForm } from '../components/appointment/AppointmentForm';
import { getLocationById, getProvidersByLocation } from '../services/api';

const RequestAppointment: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  
  const { 
    setSelectedLocation,
    appointmentRequest, 
    setAppointmentRequest,
    setSelectedProvider,
    setSelectedReason
  } = useAppointment();

  const {
    loading,
    error,
    locations,
    providers,
    reasons,
    emergencyContact
  } = useRequestAppointmentData(selectedLocationId);

  const handleLocationChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = parseInt(e.target.value);
    setSelectedLocationId(locationId);
    
    try {
      const locationData = await getLocationById(locationId);
      setSelectedLocation(locationData);
      
      setAppointmentRequest(prev => ({
        ...prev,
        location_id: locationId,
        provider_id: 0
      }));
      
    } catch (err) {
      console.error(err);
    }
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const providerId = parseInt(e.target.value);
    const selectedProvider = providers.find(p => p.id === providerId) || null;
    setSelectedProvider(selectedProvider);
    
    setAppointmentRequest(prev => ({
      ...prev,
      provider_id: providerId
    }));
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const reasonId = parseInt(e.target.value);
    const selectedReason = reasons.find(r => r.id === reasonId) || null;
    setSelectedReason(selectedReason);
    
    setAppointmentRequest(prev => ({
      ...prev,
      reason_id: reasonId
    }));
  };

  const onSubmit = (data: any) => {
    setAppointmentRequest(prev => ({
      ...prev,
      ...data
    }));
    navigate('/select-time');
  };

  // Add this before the return statement
  console.log('Reasons:', reasons);
  console.log('Locations:', locations);
  console.log('Providers:', providers);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full bg-blue-500 p-4 text-white text-center">
        <h1 className="text-2xl font-bold">Request Appointment</h1>
      </div>

      <EmergencyNotice emergencyContact={emergencyContact} />

      <div className="flex-grow flex flex-col items-center p-4">
        <AppointmentForm
          locations={locations}
          providers={providers}
          reasons={reasons}
          onLocationChange={handleLocationChange}
          onProviderChange={handleProviderChange}
          onReasonChange={handleReasonChange}
          onSubmit={onSubmit}
          defaultValues={{
            location_id: appointmentRequest.location_id,
            provider_id: appointmentRequest.provider_id,
            reason_id: appointmentRequest.reason_id,
          }}
        />
      </div>

      {loading && <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">Loading...</div>}
      {error && <div className="absolute bottom-4 right-4 bg-red-500 text-white p-4 rounded">{error}</div>}
    </div>
  );
};

export default RequestAppointment;
