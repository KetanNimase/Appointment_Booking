
import { Location, Provider, OfficeHours, AppointmentReason } from '../types';

// Mock Locations
export const mockLocations: Location[] = [
  {
    id: 1,
    name: 'Blank Location 1',
    address_line1: 'Test Add1',
    address_line2: 'Test Add2',
    city: 'Terra',
    state: 'UT',
    zip_code: '84022',
    phone: '(222) 222-2222'
  },
  {
    id: 2,
    name: 'Blank Location 2',
    address_line1: '456 Vision St',
    address_line2: 'Suite 200',
    city: 'Eyesville',
    state: 'CA',
    zip_code: '92101',
    phone: '(333) 333-3333'
  },
  {
    id: 3,
    name: 'Blank Location 3',
    address_line1: '789 Sight Blvd',
    address_line2: '',
    city: 'Opticville',
    state: 'NY',
    zip_code: '10001',
    phone: '(444) 444-4444'
  }
];

// Mock Office Hours
export const mockOfficeHours: OfficeHours[] = [
  { id: 1, location_id: 1, day_of_week: 'Monday', opening_time: '9:00 AM', closing_time: '5:00 PM' },
  { id: 2, location_id: 1, day_of_week: 'Tuesday', opening_time: '9:00 AM', closing_time: '5:00 PM' },
  { id: 3, location_id: 1, day_of_week: 'Wednesday', opening_time: '9:00 AM', closing_time: '5:00 PM' },
  { id: 4, location_id: 1, day_of_week: 'Thursday', opening_time: '9:00 AM', closing_time: '5:00 PM' },
  { id: 5, location_id: 1, day_of_week: 'Friday', opening_time: '9:00 AM', closing_time: '5:00 PM' },
  { id: 6, location_id: 2, day_of_week: 'Monday', opening_time: '8:00 AM', closing_time: '4:00 PM' },
  { id: 7, location_id: 2, day_of_week: 'Tuesday', opening_time: '8:00 AM', closing_time: '4:00 PM' },
  { id: 8, location_id: 2, day_of_week: 'Wednesday', opening_time: '8:00 AM', closing_time: '4:00 PM' },
  { id: 9, location_id: 2, day_of_week: 'Thursday', opening_time: '8:00 AM', closing_time: '4:00 PM' },
  { id: 10, location_id: 2, day_of_week: 'Friday', opening_time: '8:00 AM', closing_time: '4:00 PM' },
  { id: 11, location_id: 3, day_of_week: 'Monday', opening_time: '10:00 AM', closing_time: '6:00 PM' },
  { id: 12, location_id: 3, day_of_week: 'Tuesday', opening_time: '10:00 AM', closing_time: '6:00 PM' },
  { id: 13, location_id: 3, day_of_week: 'Wednesday', opening_time: '10:00 AM', closing_time: '6:00 PM' },
  { id: 14, location_id: 3, day_of_week: 'Thursday', opening_time: '10:00 AM', closing_time: '6:00 PM' },
  { id: 15, location_id: 3, day_of_week: 'Friday', opening_time: '10:00 AM', closing_time: '6:00 PM' }
];

// Mock Providers
export const mockProviders: Provider[] = [
  { id: 1, name: 'Dr. Jane Smith', location_id: 1, specialization: 'Optometrist' },
  { id: 2, name: 'Dr. Robert Johnson', location_id: 1, specialization: 'Ophthalmologist' },
  { id: 3, name: 'Dr. Maria Garcia', location_id: 2, specialization: 'Optometrist' },
  { id: 4, name: 'Dr. James Wilson', location_id: 2, specialization: 'Ophthalmologist' },
  { id: 5, name: 'Dr. Sarah Lee', location_id: 3, specialization: 'Optometrist' },
  { id: 6, name: 'Dr. Michael Brown', location_id: 3, specialization: 'Ophthalmologist' }
];

// Mock Appointment Reasons
export const mockAppointmentReasons: AppointmentReason[] = [
  { id: 1, reason: 'Comp. Exam Existing Patient' },
  { id: 2, reason: 'Contact Lens Fitting' },
  { id: 3, reason: 'Eye Infection / Injury' },
  { id: 4, reason: 'Glasses Adjustment' },
  { id: 5, reason: 'Annual Eye Exam' },
  { id: 6, reason: 'LASIK Consultation' },
  { id: 7, reason: 'Cataract Evaluation' }
];

export const getOfficeHoursByLocationId = (locationId: number): OfficeHours[] => {
  return mockOfficeHours.filter(hours => hours.location_id === locationId);
};

export const getProvidersByLocationId = (locationId: number): Provider[] => {
  return mockProviders.filter(provider => provider.location_id === locationId);
};

export const getLocationById = (locationId: number): Location | undefined => {
  return mockLocations.find(location => location.id === locationId);
};
