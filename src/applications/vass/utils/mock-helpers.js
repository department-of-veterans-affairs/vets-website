import { addDays, setHours, setMinutes, addMinutes } from 'date-fns';

/**
 * Generates appointment time slots for weekdays over a specified period.
 *
 * Creates slots starting at 8 AM with 30-minute intervals, excluding weekends.
 * Each slot has a start and end time in ISO 8601 format.
 *
 * @param {number} numberOfDays - Number of days to generate slots for (default: 14)
 * @param {number} slotsPerDay - Number of time slots per day (default: 18)
 * @returns {Array<{start: string, end: string}>} Array of slot objects with ISO timestamp strings
 *
 * @example
 * const slots = generateSlots(7, 10);
 * // Returns 10 slots per weekday for the next 7 days
 * // Each slot: { start: '2025-11-27T08:00:00.000Z', end: '2025-11-27T08:30:00.000Z' }
 */
const generateSlots = (numberOfDays = 14, slotsPerDay = 18) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate time slots (8 AM, 8:30 AM, 9 AM, etc.)
  const timeSlots = Array.from(
    { length: slotsPerDay },
    (_, index) => 8 + index * 0.5,
  );

  const days = Array.from({ length: numberOfDays }, (_, index) =>
    addDays(today, index + 1),
  ).filter(date => {
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Skip weekends
  });

  return days.flatMap(date => {
    return timeSlots.map(hour => {
      const hours = Math.floor(hour);
      const minutes = (hour % 1) * 60;
      const slotStart = setMinutes(setHours(date, hours), minutes);
      const slotEnd = addMinutes(slotStart, 30);

      return {
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
      };
    });
  });
};

export { generateSlots };
