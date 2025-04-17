import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useAppointment } from '../context/AppointmentContext';

const VerifyIdentity: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appointmentRequest } = useAppointment();

  const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const sendOTPEmail = async () => {
    const otp = generateOTP();
    
    // Get patient data from both sources
    const storedData = localStorage.getItem('patientFormData');
    const patientData = storedData ? JSON.parse(storedData) : null;
    
    // Try multiple sources for email
    const patientEmail = patientData?.email || 
                        appointmentRequest?.email;
    
    console.log('Patient Data:', patientData);
    console.log('Patient Email:', patientEmail);
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000);

    if (!patientEmail) {
      console.error('No email found');
      alert('No email address found. Please try again.');
      return;
    }

    try {
      const templateParams = {
        to_name: patientData?.legalFirstName || appointmentRequest?.patient_name || 'Patient',
        to_email: patientEmail,
        otp: otp,
        time: '15 minutes'
      };

      console.log('Sending email with params:', templateParams);
      const response = await emailjs.send(
        'service_o2jqb25',
        'template_jia3vs7',
        templateParams,
        'ngfcrIBDBDILAGrej'
      );

      if (response.status === 200) {
        console.log('OTP sent successfully');
        // Store OTP and expiration time in sessionStorage
        sessionStorage.setItem('verification_otp', otp);
        sessionStorage.setItem('otp_expiry', expirationTime.toISOString());
        navigate('/otp-verification');
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Top Message - White Background */}
      <div className="w-full bg-white p-24 text-center border-b">
        <p className="text-gray-600 text-lg">
          We are honored you have chosen us for your vision and eye health needs.
        </p>
      </div>

      <div className="flex flex-1">
        {/* Left Side - Profile Section */}
        <div className="w-1/2 bg-white flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-20 h-20 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <p className="text-blue-500 text-xl">demo test</p>
          </div>
        </div>

        {/* Right Side - Verification Section */}
        <div className="w-1/2 bg-blue-500 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <p className="text-white text-lg mb-10">
              Please take a moment to verify it's you. This helps us confirm your identity
              and keep your account information secure.
            </p>
            <button
              className="w-full bg-white text-blue-500 py-3 px-6 rounded-md text-lg font-medium 
                       hover:bg-blue-100 transition-colors duration-200"
              onClick={sendOTPEmail}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyIdentity;