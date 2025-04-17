
import React, { useState } from 'react';
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

// Generate time slots from 8 AM to 5 PM in 15-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(`${time}`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const SelectTime: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProvider, appointmentRequest, setAppointmentRequest } = useAppointment();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  
  const handleBack = () => {
    navigate('/request-appointment');
  };

  const handleProceed = () => {
    if (selectedDate && selectedTime) {
      // Convert time to AM/PM format
      const timeDate = new Date(`2000-01-01T${selectedTime}`);
      const formattedTime = timeDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).toUpperCase();

      setAppointmentRequest(prev => ({
        ...prev,
        selected_date: selectedDate.toISOString(),
        selected_time: formattedTime,
        provider: selectedProvider,
        appointment_time: formattedTime
      }));
      navigate('/visit-details');
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setStartDate(date || new Date());
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full bg-blue-500 p-8 text-white">
        <h1 className="text-3xl font-bold text-center mb-4">Select Time</h1>
        <h2 className="text-xl text-center">
          {selectedProvider?.name} | {appointmentRequest.reason_id ? "Comp. Exam Existing Patient" : ""}
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
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
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
          {Array.from({ length: 6 }).map((_, dayIndex) => {
            const date = addDays(startDate, dayIndex);
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
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(time);
                        }}
                        className={cn(
                          "w-full p-2 text-sm rounded-md transition-colors",
                          selectedDate?.toDateString() === date.toDateString() && selectedTime === time
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        )}
                        disabled={false} // You can add logic here to disable booked slots
                      >
                        {time}
                      </button>
                    ))}
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
