export const formatDate = (date: string, format: 'long' | 'short' = 'long'): string => {
  const options: Intl.DateTimeFormatOptions = format === 'long' 
    ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: '2-digit', day: '2-digit' };
  
  return new Date(date).toLocaleDateString('en-US', options);
};

export const generateTimeSlots = (startHour = 9, endHour = 17): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  return slots;
};