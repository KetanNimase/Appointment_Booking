import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { useAppointment } from '../context/AppointmentContext';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { ScrollArea } from '../components/ui/scroll-area';
import axios from 'axios';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { cn } from '../lib/utils';
import bookingService from '../services/api';

// Generate time slots from 10 AM to 4:45 PM in 15-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 10; hour < 17; hour++) {
    const maxMinute = hour === 16 ? 45 : 60; // Stop at 4:45 PM
    for (let minute = 0; minute < maxMinute; minute += 15) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(`${time}`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const SelectTime: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProvider, selectedReason, appointmentRequest, setAppointmentRequest } = useAppointment();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [bookedSlots, setBookedSlots] = useState<Array<{
    appointment_date: string;
    appointment_time: string;
    provider_id: number;
    patient_name: string | null;
    temporary?: boolean;
  }>>([]);

  // Update startDate when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      // When a date is selected, use that as the start date
      setStartDate(selectedDate);
    } else {
      // By default, use the current date
      setStartDate(new Date());
    }
  }, [selectedDate]);

  // Fetch booked slots
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        if (selectedProvider?.id) {
          const { data } = await bookingService.get(`/booked-slots/${selectedProvider.id}`);
          setBookedSlots(data);
        }
      } catch (error) {
        console.error('Error fetching booked slots:', error);
      }
    };

    fetchBookedSlots();
  }, [selectedProvider?.id]);

  // Handle slot selection with booking
  const handleSlotSelection = (date: Date, time: string) => {
    if (isSlotBooked(date, time) || !selectedProvider?.id) return;

    // Just update the UI selection without booking the slot yet
    setSelectedDate(date);
    setSelectedTime(time);
  };

  // Check if a slot is booked
  const isSlotBooked = (date: Date, time: string) => {
    return bookedSlots.some(slot => 
      slot.appointment_date === format(date, 'yyyy-MM-dd') &&
      slot.appointment_time === time.concat(':00') && // Add seconds to match MySQL time format
      slot.provider_id === selectedProvider?.id
    );
  };

  // Update the time slots rendering
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
                onSelect={setSelectedDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                disabled={(date) => {
                  const day = date.getDay();
                  // Disable past dates and weekends (Saturday = 6, Sunday = 0)
                  return date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                         day === 0 || 
                         day === 6;
                }}
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
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-7xl mx-auto">
          {Array.from({ length: 8 }).map((_, index) => {
            const date = addDays(startDate, index);
            const dayOfWeek = date.getDay();
            
            // Skip weekends
            if (dayOfWeek === 0 || dayOfWeek === 6) {
              return null;
            }

            // Only render first 6 non-weekend days
            const nonWeekendDays = Array.from({ length: index + 1 })
              .filter((_, i) => {
                const d = addDays(startDate, i);
                return d.getDay() !== 0 && d.getDay() !== 6;
              });

            if (nonWeekendDays.length > 6) {
              return null;
            }

            return (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <div className="text-center mb-4">
                  <div className="text-gray-600">{format(date, 'EEEE').toUpperCase()}</div>
                  <div className="text-blue-500 font-bold">
                    {format(date, 'MMM dd').toUpperCase()}
                  </div>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-4">
                    {timeSlots.map((time) => {
                      const isBooked = isSlotBooked(date, time);
                      const isSelected = selectedDate?.toDateString() === date.toDateString() && selectedTime === time;
                      
                      return (
                        <button
                          key={time}
                          onClick={() => !isBooked && handleSlotSelection(date, time)}
                          className={cn(
                            "w-full p-2 text-sm rounded-md transition-colors",
                            isBooked 
                              ? "bg-red-500 text-white cursor-not-allowed opacity-70" 
                              : isSelected
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                          )}
                          disabled={isBooked}
                        >
                          {time}
                          {isBooked && (
                            <span className="block text-xs mt-1">
                              Booked
                            </span>
                          )}
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
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          onClick={() => {
            if (selectedDate && selectedTime && selectedProvider?.id) {
              setAppointmentRequest({
                ...appointmentRequest,
                appointment_date: format(selectedDate, 'yyyy-MM-dd'),
                appointment_time: selectedTime,
                provider_id: selectedProvider.id
              });
              navigate('/visit-details'); // Changed from '/confirm' to '/visit-details'
            }
          }}
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
