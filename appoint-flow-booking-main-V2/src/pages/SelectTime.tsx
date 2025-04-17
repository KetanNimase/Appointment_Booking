
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { useAppointment } from '../context/AppointmentContext';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { appointmentService } from '../services/appointmentService';

// Generate time slots from 8 AM to 5 PM in 15-minute intervals
// Add these imports at the top
import { isWeekend, isBefore, startOfDay } from "date-fns";

// Update the time slots generator with office hours
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 9; // Office opens at 9 AM
  const endHour = 17; // Office closes at 5 PM
  const interval = 30; // 30-minute intervals

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Add this function to check if a slot is booked
const isSlotBooked = (date: Date, time: string, bookedSlots: BookedSlot[]) => {
  const slotDateTime = new Date(`${format(date, 'yyyy-MM-dd')}T${time}`);
  return bookedSlots.some(slot => 
    slot.date === format(date, 'yyyy-MM-dd') && 
    slot.time === time
  );
};

// Add interface for booked slots
interface BookedSlot {
  date: string;
  time: string;
}

const SelectTime: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProvider, selectedReason, appointmentRequest, setAppointmentRequest } = useAppointment();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  
  const handleBack = () => {
    navigate('/request-appointment');
  };

  // Add useEffect to fetch booked slots
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (selectedProvider?.id) {
        const slots = await appointmentService.getBookedSlots(selectedProvider.id.toString());
        setBookedSlots(slots);
      }
    };
    fetchBookedSlots();
  }, [selectedProvider]);

  // Update handleProceed
  const handleProceed = async () => {
    if (selectedDate && selectedTime && selectedProvider?.id) {
      try {
        const bookingData = {
          providerId: Number(selectedProvider.id),
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          patientName: appointmentRequest.patient_name || 'Anonymous'
        };
        const bookedSlot = await appointmentService.bookSlot(bookingData);
        
        // Update local state
        setBookedSlots(prev => [...prev, {
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime
        }]);
        
        // Continue with navigation
        navigate('/visit-details');
      } catch (error) {
        // Handle booking failure
        alert('This slot is no longer available. Please select another time.');
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setStartDate(date || new Date());
  };

  // Update the Calendar component props
  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return (
      isWeekend(date) || // Disable weekends
      isBefore(date, today) || // Disable past dates
      !isBefore(today, date) // Disable today
    );
  };

  // Update the time slots grid section
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full bg-blue-500 p-8 text-white">
        <h1 className="text-3xl font-bold text-center mb-4">Select Time</h1>
        <h2 className="text-xl text-center">
          {selectedProvider?.name} | {selectedReason?.name || "No reason selected"}
        </h2>
        <div className="flex justify-center items-center mt-4">
          <span className="mr-2">Select Date </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-center text-left font-large bg-blue-500",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                disabled={isDateDisabled}
                classNames={{
                  day_selected: "bg-blue-500 text-white hover:bg-blue-500 hover:text-white",
                  day_today: "bg-gray-100 text-gray-900"
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="flex-grow p-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {Array.from({ length: 5 }).map((_, dayIndex) => {
            const date = addDays(startDate, dayIndex);
            
            // Skip weekends
            if (isWeekend(date)) {
              return null;
            }

            return (
              <div key={dayIndex} className="bg-white rounded-lg shadow p-4">
                <div className="text-center mb-4">
                  <div className="text-gray-600">{format(date, 'EEEE').toUpperCase()}</div>
                  <div className="text-blue-500 font-bold">
                    {format(date, 'MMM dd').toUpperCase()}
                  </div>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-4">
                    {timeSlots.map((time) => {
                      const isBooked = isSlotBooked(date, time, bookedSlots);
                      return (
                        <button
                          key={time}
                          onClick={() => {
                            if (!isBooked) {
                              setSelectedDate(date);
                              setSelectedTime(time);
                            }
                          }}
                          className={cn(
                            "w-full p-2 text-sm rounded-md transition-colors",
                            isBooked && "bg-gray-300 cursor-not-allowed",
                            selectedDate?.toDateString() === date.toDateString() && selectedTime === time
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          )}
                          disabled={isBooked}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between p-4 border-t">
        <Button
          onClick={handleBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleProceed}
          disabled={!selectedDate || !selectedTime}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default SelectTime;
