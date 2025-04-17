
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointment } from '../context/AppointmentContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { format } from 'date-fns';

const VisitDetails: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProvider, appointmentRequest, setAppointmentRequest } = useAppointment();
  const [visitDetails, setVisitDetails] = React.useState('');

  const handleBack = () => {
    navigate('/select-time');
  };

  const handleProceed = () => {
    setAppointmentRequest(prev => ({
      ...prev,
      visit_details: visitDetails
    }));
    navigate('/patient-form');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full bg-blue-500 p-6 text-white">
        <h1 className="text-2xl font-bold text-center mb-2">Request Appointment</h1>
        <h2 className="text-center">
          Dr. {selectedProvider?.name} | {appointmentRequest.reason_id ? "Comp. Exam Existing Patient" : ""} | {" "}
          {appointmentRequest.appointment_date && appointmentRequest.appointment_time ? 
            format(new Date(`${appointmentRequest.appointment_date} ${appointmentRequest.appointment_time}`), 
            'hh:mm a EEEE, MMMM dd, yyyy') : ""}
        </h2>
      </div>

      <div className="flex-grow p-8 max-w-4xl mx-auto w-full">
        <div className="relative bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Reason for Visit/ Eye Health Issues</h3>
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setVisitDetails('')}
          >
            <X className="h-4 w-4" />
          </Button>
          <Textarea
            value={visitDetails}
            onChange={(e) => setVisitDetails(e.target.value)}
            placeholder="Please describe your reason for visit or any eye health concerns..."
            className="min-h-[200px]"
          />
        </div>
      </div>

      <div className="flex justify-between p-4 border-t max-w-4xl mx-auto w-full">
        <Button
          onClick={handleBack}
          variant="outline"
        >
          Back
        </Button>
        <Button
          onClick={handleProceed}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default VisitDetails;
