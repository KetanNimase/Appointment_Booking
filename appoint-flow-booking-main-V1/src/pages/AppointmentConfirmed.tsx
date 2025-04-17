import React, { useEffect } from 'react';
import { useAppointment } from '../context/AppointmentContext';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';

const AppointmentConfirmed: React.FC = () => {
  const { appointmentRequest } = useAppointment();
  const navigate = useNavigate();

  useEffect(() => {
    const sendEmail = async () => {
    //     console.log('Current appointment request:', appointmentRequest);
    //   console.log('Patient details:', appointmentRequest?.patient_details);
      
    //   // Access email directly from patient_details
    //   const patientEmail = appointmentRequest?.email || appointmentRequest?.patient_details?.email;
    //   console.log('Email:', patientEmail);

      // Validate required fields before sending email
      const patientData = JSON.parse(localStorage.getItem('patientFormData') || '{}');
      const patientEmail = patientData?.email || appointmentRequest?.email;

      if (!patientEmail) {
        console.error('Missing email address');
        return;
      }

      try {
        const templateParams = {
          to_name: appointmentRequest?.patient_name || 'Patient',
          doctor_name: (appointmentRequest as any)?.provider?.name || 'Dr. Pune Doc',
          appointment_date: appointmentRequest?.appointment_date ? 
            new Date(appointmentRequest.appointment_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }) : '',
          appointment_time: appointmentRequest?.appointment_time || '',
          intake_form_link: `${window.location.origin}/intake-form`,
          website_link: 'www.rosecity.com',
          to_email: patientEmail,
          verify_link: `${window.location.origin}/verify-identity/${appointmentRequest?.id}`,
          verify_button: `<a href="${window.location.origin}/verify-identity/${appointmentRequest?.id}" 
            style="background-color: #2196F3; color: white; padding: 14px 25px; 
            text-align: center; text-decoration: none; display: inline-block; 
            border-radius: 6px; margin: 15px 0;">
            Confirm Appointment
          </a>`
        };

        const response = await emailjs.send(
          'service_o2jqb25',
          'template_p16l5u7',
          templateParams,
          'ngfcrIBDBDILAGrej'
        );

        if (response.status === 200) {
          console.log('Email sent successfully');
        }
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    };

    if (appointmentRequest) {
      sendEmail();
    }
  }, [appointmentRequest]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Teal Background */}
      <div className="w-1/2 bg-teal-500 p-12 flex flex-col items-center justify-center text-white">
        <div className="text-center">
          <div className="mb-6">
            <img 
              src="/calendar-check.svg" 
              alt="Calendar Check" 
              className="w-24 h-24 mx-auto"
            />
          </div>
          <h2 className="text-2xl font-bold mb-6">Appointment Confirmed</h2>
          <p className="text-lg mb-2">Dr. {(appointmentRequest as any)?.provider?.name || 'Pune Doc'}</p>
          <p className="text-lg mb-6">
            {appointmentRequest?.appointment_time || '09:00 AM'} {' '}
            {appointmentRequest?.appointment_date ? 
              new Date(appointmentRequest.appointment_date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }) : 
              'Wednesday, April 16, 2025'
            }
          </p>
          <p className="text-sm">We will send you a confirmation message.</p>
        </div>
      </div>

      {/* Right Panel - White Background */}
      <div className="w-1/2 bg-white p-12 flex items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Your appointment has been confirmed.
        </h2>
      </div>
    </div>
  );
};

export default AppointmentConfirmed;