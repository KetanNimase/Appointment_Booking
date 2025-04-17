export interface Provider {
  id: string;
  name: string;
  specialty?: string;
  image?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export interface AppointmentDate {
  date: string;
  slots: TimeSlot[];
}