# ApointFlow Booking - Vision & Eye Health Appointment System

## Overview

ApointFlow Booking is a modern appointment booking system specialized for vision and eye health services. This application allows patients to book appointments with eye care professionals at different locations.

## Features

- Location selection
- Dynamic display of location address and office hours
- Provider selection based on location
- Appointment reason selection
- Streamlined booking process
- Responsive design for all devices

## Project Structure

The project follows a clean architecture with the following structure:

- `/src/types`: TypeScript interfaces based on the database schema
- `/src/services`: API services for backend communication
- `/src/context`: React context for state management across pages
- `/src/pages`: React components representing the main views
- `/src/utils`: Utility functions and mock data

## Setup & Configuration

### Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Backend Integration

By default, the application is configured to use mock data for demonstration purposes. When your backend is ready, you can configure it in `src/services/api.ts` by:

1. Setting `USE_MOCK_DATA` to `false`
2. Updating the `API_BASE_URL` to point to your Express backend

```typescript
// src/services/api.ts
const API_BASE_URL = 'http://your-backend-url/api';
const USE_MOCK_DATA = false;
```

### Database Schema

The application is designed to work with the following database tables:

- **locations**: Information about clinics/offices (id, name, address, phone)
- **providers**: Information about doctors/specialists (id, name, location_id, specialization)
- **office_hours**: Operating hours for each location (id, location_id, day_of_week, opening_time, closing_time)
- **appointment_reasons**: Available reasons for booking (id, reason)
- **appointments**: Actual booked appointments (id, location_id, date, time, patient info)

## Backend API Requirements

Your Express backend should implement the following endpoints:

- `GET /api/locations`: Return a list of all locations
- `GET /api/locations/{id}`: Return details of a specific location
- `GET /api/locations/{id}/providers`: Return providers for a specific location
- `GET /api/locations/{id}/office-hours`: Return office hours for a specific location
- `GET /api/providers`: Return a list of all providers
- `GET /api/appointment-reasons`: Return a list of all appointment reasons
- `POST /api/appointments`: Create a new appointment

## Technologies Used

- React
- TypeScript
- Vite
- TanStack React Query for data fetching
- Axios for API requests
- Tailwind CSS with shadcn/ui components
- React Router for navigation

## Development Notes

- To add new appointment reasons or specialization types, update both the backend database and the corresponding mock data in `src/utils/mockData.ts`
- The user interface follows the design provided in the mockups
- Form validation can be extended based on specific requirements
