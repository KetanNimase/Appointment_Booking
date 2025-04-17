import axios from 'axios';
import { BookedSlot, BookSlotRequest } from '../types/appointment';

const API_BASE_URL = 'http://localhost:3001/api';

export const appointmentService = {
  async getBookedSlots(providerId: string): Promise<BookedSlot[]> {
    const response = await axios.get(`${API_BASE_URL}/booked-slots`, {
      params: { providerId }
    });
    return response.data;
  },

  async bookSlot(bookingData: BookSlotRequest): Promise<BookedSlot> {
    const response = await axios.post(`${API_BASE_URL}/book-slot`, bookingData);
    return response.data;
  },

  async cancelBooking(slotId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/booked-slots/${slotId}`);
  }
};