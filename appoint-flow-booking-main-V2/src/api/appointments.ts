const API_BASE_URL = 'http://localhost:3001/api';

export const createAppointment = async (appointmentData: any) => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  });
  return response.json();
};

export const sendVerificationCode = async (appointmentId: number) => {
  const response = await fetch(`${API_BASE_URL}/verify/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ appointment_id: appointmentId }),
  });
  return response.json();
};

export const verifyCode = async (appointmentId: number, code: string) => {
  const response = await fetch(`${API_BASE_URL}/verify/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ appointment_id: appointmentId, code }),
  });
  return response.json();
};

export const getProviders = async (locationId?: number) => {
  const url = locationId 
    ? `${API_BASE_URL}/locations/${locationId}/providers`
    : `${API_BASE_URL}/providers`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch providers');
  }
  return response.json();
};

export const getAppointmentReasons = async () => {
  const response = await fetch(`${API_BASE_URL}/appointment-reasons`);
  if (!response.ok) {
    throw new Error('Failed to fetch appointment reasons');
  }
  return response.json();
};