import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const AppointmentStatus: React.FC = () => {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    navigate('/appointment-cancelled');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/2 bg-blue-500 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <div className="mb-4">
            <div className="w-24 h-24 bg-white/10 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12a4 4 0 108 0 4 4 0 00-8 0z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2">demo test</h2>
          <div className="text-white/90">
            <p>You have an upcoming appointment</p>
            <p>09:30 AM Friday, April 18, 2025</p>
            <p>Reason: AE</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-xl mb-6">Thank you for booking an appointment with us.</h2>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel Appointment
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/select-time')}
              className="flex-1"
            >
              Reschedule
            </Button>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogDescription className="text-center py-4">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-yellow-500" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            Do you really want to cancel this appointment?
          </DialogDescription>
          <DialogFooter className="flex justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCancelDialog(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              NO
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={confirmCancel}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              YES
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentStatus;