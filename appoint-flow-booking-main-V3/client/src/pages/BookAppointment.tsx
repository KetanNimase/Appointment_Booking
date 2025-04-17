
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Location, OfficeHours } from '../types';
import { getLocations, getLocationById, getOfficeHoursByLocation } from '../services/api';
import { useAppointment } from '../context/AppointmentContext';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BookAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedLocation, setAppointmentRequest } = useAppointment();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [officeHours, setOfficeHours] = useState<OfficeHours[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await getLocations();
        setLocations(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch locations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (!selectedLocationId) return;
      
      try {
        setLoading(true);
        const [locationData, hoursData] = await Promise.all([
          getLocationById(selectedLocationId),
          getOfficeHoursByLocation(selectedLocationId)
        ]);
        
        setCurrentLocation(locationData);
        setSelectedLocation(locationData);
        setOfficeHours(hoursData);
        setAppointmentRequest(prev => ({
          ...prev,
          location_id: selectedLocationId
        }));
        setError(null);
      } catch (err) {
        setError('Failed to fetch location details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
  }, [selectedLocationId, setSelectedLocation, setAppointmentRequest]);

  const handleProceed = () => {
    navigate('/request-appointment');
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-20 bg-white shadow-sm">
        <h1 className="text-xl text-gray-800 text-center">
          We are honored you have chosen us for your vision and eye health needs.
        </h1>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel */}
        <div className="w-1/2 p-8 bg-white">
          <div className="mb-8">
            <div className="flex gap-4 items-center">
              <label className="text-gray-700 font-medium">Location</label>
              <Select
                value={selectedLocationId?.toString()}
                onValueChange={(value) => setSelectedLocationId(parseInt(value))}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentLocation && (
            <>
              <div className="mb-8">
                <h2 className="text-gray-700 font-medium mb-3">Address</h2>
                <div className="text-gray-600 space-y-1">
                  <p>{currentLocation.address_line1}</p>
                  {currentLocation.address_line2 && <p>{currentLocation.address_line2}</p>}
                  <p>{currentLocation.city}, {currentLocation.state}, {currentLocation.zip_code}</p>
                  <p>Phone: {currentLocation.phone}</p>
                </div>
              </div>

              <div>
                <h2 className="text-gray-700 font-medium mb-3">Office Hours</h2>
                <div className="space-y-2">
                  {officeHours.map((hour) => (
                    <div key={hour.id} className="flex justify-between text-gray-600">
                      <span>{hour.day_of_week}</span>
                      <span>{hour.opening_time} - {hour.closing_time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-blue-500 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Book Appointment</h2>
            <p className="mb-8">Request from available appointment</p>
            <Button 
              onClick={handleProceed}
              disabled={!selectedLocationId}
              variant="outline"
              className="border-2 border-white bg-transparent hover:bg-white/10 text-white font-medium px-8 py-2"
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>

      {loading && <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">Loading...</div>}
      {error && <div className="absolute bottom-4 right-4 bg-red-500 text-white p-4 rounded">{error}</div>}
    </div>
  );
};

export default BookAppointment;
