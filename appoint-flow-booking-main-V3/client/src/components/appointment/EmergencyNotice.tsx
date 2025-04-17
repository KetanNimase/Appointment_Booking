
import React from 'react';

interface EmergencyNoticeProps {
  emergencyContact: string;
}

export const EmergencyNotice: React.FC<EmergencyNoticeProps> = ({ emergencyContact }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 my-4 text-sm text-gray-700">
      <p>
        Note: If this is a medical emergency, please dial 911 immediately or go to the nearest emergency room. If 
        experiencing flashes, floaters, or sudden loss of vision please call the office immediately at {emergencyContact}
      </p>
    </div>
  );
};
