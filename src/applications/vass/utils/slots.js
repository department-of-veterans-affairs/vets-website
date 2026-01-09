/**
 * Maps the appointment availability returned from the API a format that
 * can be used to display in the CalendarWidget component.
 * @param {Object} appointmentAvailability - The appointment availability.
 * @returns {Array} The slots.
 */
export const mapAppointmentAvailabilityToSlots = appointmentAvailability => {
  if (!appointmentAvailability?.availableTimeSlots?.length) return [];
  return appointmentAvailability?.availableTimeSlots?.map(slot => {
    return {
      start: slot.dtStartUtc,
      end: slot.dtEndUtc,
    };
  });
};
