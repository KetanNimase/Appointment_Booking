import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/2 bg-teal-500 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <div className="mb-4">
            <svg 
              className="w-24 h-24 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 12L11 15L16 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Record match found</h2>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <p className="text-gray-700 mb-6">
            We have found a matching record. We will send you a one time security code on your Phone/Email so that you can securely login. If you do not receive code please{' '}
            <button 
              className="text-blue-500 underline"
              onClick={() => navigate('/')} // Changed to navigate to booking page
            >
              call our office
            </button>
          </p>
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => navigate('/otp-verification')}
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;