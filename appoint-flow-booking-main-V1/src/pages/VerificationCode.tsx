import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const VerificationCode: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '']);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleResend = () => {
    // Will implement later
    console.log('Resend code clicked');
  };

  const handleProceed = () => {
    // Will implement later
    console.log('Proceed clicked');
    navigate('/appointment-confirmed');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="w-1/3 bg-teal-500 flex items-center justify-center p-8">
        <div className="text-white text-center">
          <div className="mb-4">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Security Code Sent</h2>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-2/3 p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h2 className="text-xl mb-6">Enter security code received on your Phone/Email</h2>
          
          <div className="flex gap-4 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                className="w-16 h-16 text-center text-2xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <p className="text-sm text-gray-600 mb-6">
            If you did not receive a code click resend to try again. If you are still not receiving a code via your text or message please{' '}
            <a href="#" className="text-blue-600 underline">call our office</a> as your contact information may not be up to date.
          </p>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleResend}
              className="px-6"
            >
              Resend Code
            </Button>
            <Button
              onClick={handleProceed}
              className="px-6 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;