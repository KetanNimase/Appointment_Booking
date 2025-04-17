const API_BASE_URL = 'http://localhost:3001/api';

export const getLocations = async () => {
  const response = await fetch(`${API_BASE_URL}/locations`);
  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }
  return response.json();
};

export const getLocationHours = async (locationId: number) => {
  const response = await fetch(`${API_BASE_URL}/locations/${locationId}/hours`);
  if (!response.ok) {
    throw new Error('Failed to fetch office hours');
  }
  return response.json();
};

export const getLocationDetails = async (locationId: number) => {
  const response = await fetch(`${API_BASE_URL}/locations/${locationId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch location details');
  }
  return response.json();
};