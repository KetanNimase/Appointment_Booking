import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useAppointment } from '../context/AppointmentContext';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const { appointmentRequest } = useAppointment();

  const handleResend = async () => {
    if (resendTimer > 0) return;

    try {
      // Get email from multiple sources
      const patientData = JSON.parse(localStorage.getItem('patientFormData') || '{}');
      const patientEmail = patientData?.email || appointmentRequest?.email;

      if (!patientEmail) {
        console.error('No email address found');
        return;
      }

      const templateParams = {
        to_name: patientData?.firstName || appointmentRequest?.patient_name || 'Patient',
        to_email: patientEmail,
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        time: '15 minutes'
      };

      const response = await emailjs.send(
        'service_o2jqb25',
        'template_jia3vs7',
        templateParams,
        'ngfcrIBDBDILAGrej'
      );

      if (response.status === 200) {
        sessionStorage.setItem('verification_otp', templateParams.otp);
        sessionStorage.setItem('otp_expiry', new Date(Date.now() + 15 * 60 * 1000).toISOString());
        setResendTimer(600); // 10 minutes in seconds
      }
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
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
      sessionStorage.removeItem('verification_otp');
      sessionStorage.removeItem('otp_expiry');
      navigate('/appointment-status');
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
            your text or message please{' '}
            <a 
              href="/" 
              className="underline text-blue-500 hover:text-blue-600"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              call our office
            </a>{' '}
            as your contact information may not be up to date.
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleResend}
              disabled={resendTimer > 0}
              className={`px-6 py-2 ${
                resendTimer > 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300'
              } text-gray-700 rounded`}
            >
              {resendTimer > 0 
                ? `Resend in ${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}`
                : 'Resend Code'
              }
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