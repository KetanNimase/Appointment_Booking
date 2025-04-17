import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const navigate = useNavigate();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleResend = async () => {
    // Add resend OTP logic here
  };

  const verifyOTP = () => {
      const storedOTP = sessionStorage.getItem('verification_otp');
      const expiryTime = sessionStorage.getItem('otp_expiry');
      const enteredOTP = otp.join('');
  
      if (!storedOTP || !expiryTime) {
        console.error('OTP information not found');
        return false;
      }
  
      const isExpired = new Date() > new Date(expiryTime);
      if (isExpired) {
        console.error('OTP has expired');
        return false;
      }
  
      return storedOTP === enteredOTP;
    };
  
    const handleProceed = () => {
      if (verifyOTP()) {
        // Clear OTP data from session storage
        sessionStorage.removeItem('verification_otp');
        sessionStorage.removeItem('otp_expiry');
        // Navigate to success page or next step
        console.log('OTP verified successfully');
      } else {
        console.error('Invalid or expired OTP');
      }
    };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Teal Background */}
      <div className="w-1/2 bg-teal-500 p-12 flex flex-col items-center justify-center text-white">
        <div className="text-center">
          <div className="mb-6">
            <img 
              src="/security-code.svg" 
              alt="Security Code" 
              className="w-24 h-24 mx-auto"
            />
          </div>
          <h2 className="text-2xl font-bold mb-6">Security Code Sent</h2>
        </div>
      </div>

      {/* Right Panel - White Background */}
      <div className="w-1/2 bg-white p-12 flex flex-col items-center justify-center">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-6">
            Enter security code received on your Phone/Email
          </h2>
          
          <div className="flex gap-4 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-16 h-16 text-center text-2xl border-2 rounded-md focus:border-blue-500 focus:outline-none"
              />
            ))}
          </div>

          <p className="text-gray-600 mb-6">
            If you did not receive a code click resend to try again. If you are still not receiving a code via
            your text or message please <a href="#" className="underline">call our office</a> as your contact information may not be up to date.
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleResend}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Resend Code
            </button>
            <button
              onClick={handleProceed}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;