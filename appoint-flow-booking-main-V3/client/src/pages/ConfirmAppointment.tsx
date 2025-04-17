import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppointment } from '../context/AppointmentContext';

const ConfirmAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { appointmentRequest } = useAppointment();

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/2 bg-teal-500 flex flex-col items-center justify-center p-8 text-white">
        <div className="text-center">
          <svg 
            className="w-24 h-24 mx-auto mb-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Confirm your Appointment</h2>
          <p className="text-lg mb-2">Friday, 04/18/2025, 09:30 AM</p>
          <p className="text-lg">with Dr. Pune Doc.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-white flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto">
          <p className="mb-4">Dear {appointmentRequest?.patient_name},</p>
          <p className="mb-4">Prior to your appointment, click here to complete the <a href="#" className="text-blue-500 underline">Intake Form</a>.</p>
          <p className="mb-8">We truly care about your well-being, so if you have any questions or needs in advance of your appointment, give us a call.</p>
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => navigate('/appointment-confirmed')}
          >
            Confirm Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAppointment;