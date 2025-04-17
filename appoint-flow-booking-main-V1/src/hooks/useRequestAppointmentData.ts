
import { useState, useEffect } from 'react';
import { Location, Provider, AppointmentReason } from '../types';
import { getLocations, getLocationById, getProvidersByLocation, getAppointmentReasons } from '../services/api';

export const useRequestAppointmentData = (selectedLocationId: number | null) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [reasons, setReasons] = useState<AppointmentReason[]>([]);
  const [emergencyContact, setEmergencyContact] = useState<string>('(222) 222-2222');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [locationsData, reasonsData] = await Promise.all([
          getLocations(),
          getAppointmentReasons()
        ]);
        
        setLocations(locationsData);
        setReasons(reasonsData);
        
        if (selectedLocationId) {
          const locationData = await getLocationById(selectedLocationId);
          const providersData = await getProvidersByLocation(selectedLocationId);
          setProviders(providersData);
          setEmergencyContact(locationData.phone);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [selectedLocationId]);

  return {
    loading,
    error,
    locations,
    providers,
    reasons,
    emergencyContact
  };
};
