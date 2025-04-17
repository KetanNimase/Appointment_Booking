import React from 'react';
import { Button } from '@/components/ui/button';

const AppointmentCancelled: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/2 bg-teal-500 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <div className="mb-4">
            <svg className="w-24 h-24 mx-auto" viewBox="0 0 24 24" fill="none">
              <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 2V6M8 2V6M3 10H21M14 16L10 12M10 16L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your appointment is cancelled.</h2>

        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-xl mb-6">To schedule an appointment</h2>
          <Button
            variant="link"
            className="text-blue-500 underline p-0 h-auto"
            onClick={() => window.location.href = 'tel:+1234567890'}
          >
            Call our office
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCancelled;